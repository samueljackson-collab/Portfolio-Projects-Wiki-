"""
GitHub Repository Scanner
=========================
Scans a GitHub user's repositories to detect:
1. New repositories not yet in the wiki
2. Significant changes to existing repos (new features, status changes)
3. New technologies not yet covered by deep dives

Uses the GitHub REST API (no auth needed for public repos, token for private).
"""

import json
import os
import re
import time
import logging
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional
from urllib.request import urlopen, Request
from urllib.error import HTTPError

logger = logging.getLogger(__name__)


@dataclass
class RepoInfo:
    """Raw repository data from GitHub API."""
    name: str
    full_name: str
    description: str
    primary_language: str
    languages: dict
    topics: list[str]
    default_branch: str
    created_at: str
    updated_at: str
    pushed_at: str
    stars: int
    has_wiki: bool
    open_issues: int
    readme_content: str = ""
    file_tree: list[str] = field(default_factory=list)
    config_files: dict = field(default_factory=dict)
    cicd_workflows: dict = field(default_factory=dict)
    recent_commits: list[dict] = field(default_factory=list)


@dataclass
class ChangeDetection:
    """Represents a detected change that needs wiki processing."""
    change_type: str  # "new_repo", "new_feature", "status_update", "new_tech"
    repo_name: str
    repo_info: Optional[RepoInfo] = None
    changed_files: list[str] = field(default_factory=list)
    commit_messages: list[str] = field(default_factory=list)
    diff_summary: str = ""
    new_dependencies: list[str] = field(default_factory=list)
    existing_entry: Optional[dict] = None
    detected_technologies: list[str] = field(default_factory=list)


class GitHubScanner:
    """Scans GitHub repos and detects changes needing wiki updates."""

    API_BASE = "https://api.github.com"
    # Files that signal project configuration/capabilities
    CONFIG_PATTERNS = [
        "package.json", "requirements.txt", "Pipfile", "pyproject.toml",
        "go.mod", "Cargo.toml", "pom.xml", "build.gradle",
        "Dockerfile", "docker-compose.yml", "docker-compose.yaml",
        "Makefile", "Taskfile.yml",
        "terraform.tf", "main.tf",
        ".env.example", "config.yaml", "config.yml",
    ]

    def __init__(self, username: str, token: str = "",
                 exclude_repos: list[str] = None,
                 lookback_days: int = 7):
        self.username = username
        self.token = token or os.environ.get("GITHUB_TOKEN", "")
        self.exclude_repos = set(exclude_repos or [])
        self.lookback_days = lookback_days
        self.cutoff_date = datetime.now(timezone.utc) - timedelta(days=lookback_days)

    def _api_request(self, url: str, accept: str = "application/vnd.github.v3+json") -> dict | list | str:
        """Make a GitHub API request with optional auth and rate limit handling."""
        headers = {"Accept": accept, "User-Agent": "wiki-generator"}
        if self.token:
            headers["Authorization"] = f"token {self.token}"

        req = Request(url, headers=headers)
        for attempt in range(3):
            try:
                with urlopen(req, timeout=30) as resp:
                    if "json" in accept:
                        return json.loads(resp.read().decode())
                    return resp.read().decode()
            except HTTPError as e:
                if e.code == 403:
                    # Rate limited - check reset time
                    reset = e.headers.get("X-RateLimit-Reset")
                    if reset:
                        wait = max(int(reset) - int(time.time()), 1)
                        logger.warning(f"Rate limited. Waiting {wait}s...")
                        time.sleep(min(wait, 60))
                        continue
                if e.code == 404:
                    logger.debug(f"Not found: {url}")
                    return {} if "json" in accept else ""
                raise
            except Exception as e:
                if attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                raise
        return {} if "json" in accept else ""

    def scan_all_repos(self) -> list[RepoInfo]:
        """Fetch all public repos for the configured user."""
        repos = []
        page = 1
        while True:
            url = (f"{self.API_BASE}/users/{self.username}/repos"
                   f"?per_page=100&page={page}&sort=updated&type=owner")
            batch = self._api_request(url)
            if not batch:
                break
            for r in batch:
                if r["name"] in self.exclude_repos or r.get("fork", False):
                    continue
                repos.append(self._build_repo_info(r))
            if len(batch) < 100:
                break
            page += 1
        logger.info(f"Scanned {len(repos)} repositories for {self.username}")
        return repos

    def _build_repo_info(self, api_repo: dict) -> RepoInfo:
        """Convert API response to RepoInfo with enriched data."""
        repo = RepoInfo(
            name=api_repo["name"],
            full_name=api_repo["full_name"],
            description=api_repo.get("description") or "",
            primary_language=api_repo.get("language") or "Unknown",
            languages={},
            topics=api_repo.get("topics", []),
            default_branch=api_repo.get("default_branch", "main"),
            created_at=api_repo.get("created_at", ""),
            updated_at=api_repo.get("updated_at", ""),
            pushed_at=api_repo.get("pushed_at", ""),
            stars=api_repo.get("stargazers_count", 0),
            has_wiki=api_repo.get("has_wiki", False),
            open_issues=api_repo.get("open_issues_count", 0),
        )
        return repo

    def enrich_repo(self, repo: RepoInfo) -> RepoInfo:
        """Fetch additional details for a repo (README, file tree, configs)."""
        # Languages
        lang_url = f"{self.API_BASE}/repos/{repo.full_name}/languages"
        repo.languages = self._api_request(lang_url) or {}

        # README
        readme_url = f"{self.API_BASE}/repos/{repo.full_name}/readme"
        readme_data = self._api_request(readme_url)
        if readme_data and isinstance(readme_data, dict) and "download_url" in readme_data:
            raw = self._api_request(readme_data["download_url"],
                                    accept="text/plain")
            repo.readme_content = raw[:8000] if isinstance(raw, str) else ""

        # File tree (top-level + key dirs)
        tree_url = f"{self.API_BASE}/repos/{repo.full_name}/contents/"
        tree = self._api_request(tree_url)
        if isinstance(tree, list):
            repo.file_tree = [f["name"] + ("/" if f["type"] == "dir" else "")
                              for f in tree]

        # Config files
        for fname in self.CONFIG_PATTERNS:
            if fname in [f.rstrip("/") for f in repo.file_tree]:
                content_url = (f"{self.API_BASE}/repos/{repo.full_name}"
                               f"/contents/{fname}")
                data = self._api_request(content_url)
                if isinstance(data, dict) and "download_url" in data:
                    raw = self._api_request(data["download_url"],
                                            accept="text/plain")
                    if isinstance(raw, str):
                        repo.config_files[fname] = raw[:3000]

        # CI/CD workflows
        if ".github/" in repo.file_tree or any(".github" in f for f in repo.file_tree):
            wf_url = (f"{self.API_BASE}/repos/{repo.full_name}"
                      f"/contents/.github/workflows")
            wf_list = self._api_request(wf_url)
            if isinstance(wf_list, list):
                for wf in wf_list[:5]:
                    if wf["name"].endswith((".yml", ".yaml")):
                        raw = self._api_request(wf["download_url"],
                                                accept="text/plain")
                        if isinstance(raw, str):
                            repo.cicd_workflows[wf["name"]] = raw[:3000]

        # Recent commits
        since = self.cutoff_date.isoformat()
        commits_url = (f"{self.API_BASE}/repos/{repo.full_name}"
                       f"/commits?per_page=30&since={since}")
        commits = self._api_request(commits_url)
        if isinstance(commits, list):
            repo.recent_commits = [
                {
                    "sha": c["sha"][:7],
                    "message": c["commit"]["message"][:200],
                    "date": c["commit"]["committer"]["date"],
                    "files_changed": [],  # Would need another API call per commit
                }
                for c in commits
            ]

        return repo

    def detect_changes(self, repos: list[RepoInfo],
                       existing_entries: list[dict],
                       existing_tech_dives: dict) -> list[ChangeDetection]:
        """Compare scanned repos against existing wiki to find changes."""
        changes = []
        existing_slugs = {e.get("slug", ""): e for e in existing_entries}
        existing_names = {e.get("name", "").lower(): e for e in existing_entries}
        covered_techs = set(existing_tech_dives.keys())

        for repo in repos:
            slug = self._name_to_slug(repo.name)
            match = existing_slugs.get(slug) or existing_names.get(repo.name.lower())

            if not match:
                # New repository - needs full wiki entry
                changes.append(ChangeDetection(
                    change_type="new_repo",
                    repo_name=repo.name,
                    repo_info=repo,
                ))
                logger.info(f"NEW REPO detected: {repo.name}")
            else:
                # Existing repo - check for significant changes
                if repo.recent_commits:
                    commit_msgs = [c["message"] for c in repo.recent_commits]
                    signals = self._detect_change_signals(commit_msgs, repo)

                    if signals.get("has_significant_changes"):
                        changes.append(ChangeDetection(
                            change_type="new_feature",
                            repo_name=repo.name,
                            repo_info=repo,
                            commit_messages=commit_msgs,
                            existing_entry=match,
                            new_dependencies=signals.get("new_deps", []),
                        ))
                        logger.info(f"FEATURE UPDATE detected: {repo.name}")
                    elif signals.get("has_progress"):
                        changes.append(ChangeDetection(
                            change_type="status_update",
                            repo_name=repo.name,
                            repo_info=repo,
                            commit_messages=commit_msgs,
                            existing_entry=match,
                        ))
                        logger.info(f"STATUS UPDATE detected: {repo.name}")

            # Check for new technologies needing deep dives
            if repo.languages:
                for tech in repo.languages:
                    tech_key = tech.lower().replace(" ", "_").replace(".", "")
                    if tech_key not in covered_techs:
                        changes.append(ChangeDetection(
                            change_type="new_tech",
                            repo_name=repo.name,
                            repo_info=repo,
                            detected_technologies=[tech],
                        ))
                        covered_techs.add(tech_key)  # Don't duplicate
                        logger.info(f"NEW TECH detected: {tech} (from {repo.name})")

        logger.info(f"Total changes detected: {len(changes)}")
        return changes

    def _detect_change_signals(self, commit_messages: list[str],
                               repo: RepoInfo) -> dict:
        """Analyze commit messages and repo state for change signals."""
        signals = {"has_significant_changes": False, "has_progress": False,
                   "new_deps": []}
        all_msgs = " ".join(commit_messages).lower()

        # Significant feature keywords
        feature_keywords = ["feat", "feature", "add", "implement", "new",
                            "integrate", "support"]
        # Progress keywords
        progress_keywords = ["fix", "refactor", "test", "doc", "update",
                             "improve", "optimize", "ci", "deploy"]

        feature_hits = sum(1 for kw in feature_keywords if kw in all_msgs)
        progress_hits = sum(1 for kw in progress_keywords if kw in all_msgs)

        if feature_hits >= 2 or len(commit_messages) >= 10:
            signals["has_significant_changes"] = True
        elif progress_hits >= 2 or len(commit_messages) >= 5:
            signals["has_progress"] = True

        # Detect new dependencies from config files
        for fname, content in repo.config_files.items():
            if fname == "package.json":
                try:
                    pkg = json.loads(content)
                    deps = list(pkg.get("dependencies", {}).keys())
                    deps += list(pkg.get("devDependencies", {}).keys())
                    signals["new_deps"].extend(deps[:20])
                except json.JSONDecodeError:
                    pass
            elif fname == "requirements.txt":
                for line in content.split("\n"):
                    line = line.strip()
                    if line and not line.startswith("#"):
                        pkg_name = re.split(r'[>=<\[]', line)[0].strip()
                        if pkg_name:
                            signals["new_deps"].append(pkg_name)

        return signals

    @staticmethod
    def _name_to_slug(name: str) -> str:
        """Convert repo name to URL slug."""
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        return slug.strip('-')


class StateTracker:
    """Tracks what has already been processed to avoid duplicate work."""

    def __init__(self, state_file: str):
        self.state_file = Path(state_file)
        self.state = self._load()

    def _load(self) -> dict:
        if self.state_file.exists():
            return json.loads(self.state_file.read_text())
        return {"processed_repos": {}, "last_run": None}

    def save(self):
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        self.state_file.write_text(json.dumps(self.state, indent=2))

    def is_processed(self, repo_name: str, change_type: str,
                     commit_sha: str = "") -> bool:
        """Check if this specific change was already processed."""
        key = f"{repo_name}:{change_type}"
        entry = self.state["processed_repos"].get(key, {})
        if not entry:
            return False
        if commit_sha and entry.get("last_sha") == commit_sha:
            return True
        return False

    def mark_processed(self, repo_name: str, change_type: str,
                       commit_sha: str = ""):
        """Record that a change has been processed."""
        key = f"{repo_name}:{change_type}"
        self.state["processed_repos"][key] = {
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "last_sha": commit_sha,
        }
        self.state["last_run"] = datetime.now(timezone.utc).isoformat()
        self.save()
