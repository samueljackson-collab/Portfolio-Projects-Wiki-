#!/usr/bin/env python3
"""
Wiki Generator Pipeline
=======================
Main orchestrator that connects:
1. GitHub Scanner → detects changes
2. Draft Generator (free AI) → creates initial content
3. Opus Reviewer (Claude) → polishes to production quality
4. Output Writer → produces updated constants.ts entries

Usage:
    # Full pipeline (scan → draft → review → output)
    python pipeline.py

    # Scan only (see what would be updated)
    python pipeline.py --scan-only

    # Skip review (draft only, no Opus pass)
    python pipeline.py --skip-review

    # Process a specific repo
    python pipeline.py --repo "my-repo-name"

    # Dry run (no file writes)
    python pipeline.py --dry-run
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

# Add parent dir to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from scanner.github_scanner import GitHubScanner, StateTracker, ChangeDetection
from generator.draft_generator import DraftGenerator
from generator.prompts import (
    load_template, build_new_repo_prompt, build_feature_update_prompt,
    build_status_update_prompt, build_tech_deep_dive_prompt
)
from reviewer.opus_reviewer import OpusReviewer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("pipeline")


class WikiPipeline:
    """Main orchestrator for the wiki generation pipeline."""

    def __init__(self, config_path: str = None):
        config_file = config_path or str(
            Path(__file__).parent / "config.yaml"
        )
        with open(config_file) as f:
            self.config = yaml.safe_load(f)

        self.base_dir = Path(__file__).parent
        self.project_root = self.base_dir.parent

        # Initialize components
        self.scanner = GitHubScanner(
            username=self.config["github"]["username"],
            exclude_repos=self.config["github"].get("exclude_repos", []),
            lookback_days=self.config["github"].get("lookback_days", 7),
        )
        self.state = StateTracker(
            str(self.base_dir / self.config["state_file"])
        )
        self.drafter = DraftGenerator(
            provider=self.config["draft_agent"]["provider"],
            model=self.config["draft_agent"]["model"],
            fallback_provider=self.config["draft_agent"].get("fallback_provider", "groq"),
            fallback_model=self.config["draft_agent"].get("fallback_model", "llama-3.3-70b-versatile"),
            temperature=self.config["draft_agent"].get("temperature", 0.4),
            max_retries=self.config["draft_agent"].get("max_retries", 3),
            retry_delay=self.config["draft_agent"].get("retry_delay_seconds", 10),
        )
        self.reviewer = OpusReviewer(
            model=self.config["review_agent"]["model"],
            temperature=self.config["review_agent"].get("temperature", 0.2),
            max_tokens=self.config["review_agent"].get("max_tokens", 8192),
        )

        # Ensure output dirs exist
        drafts_dir = self.project_root / self.config["output"]["drafts_dir"]
        reviewed_dir = self.project_root / self.config["output"]["reviewed_dir"]
        drafts_dir.mkdir(parents=True, exist_ok=True)
        reviewed_dir.mkdir(parents=True, exist_ok=True)

    def load_existing_data(self) -> tuple[list[dict], dict]:
        """Load existing projects and tech deep dives from constants.ts."""
        constants_path = self.project_root / self.config["output"]["constants_file"]
        if not constants_path.exists():
            logger.warning("constants.ts not found, starting fresh")
            return [], {}

        content = constants_path.read_text()

        # Extract PROJECTS_DATA array
        projects = []
        projects_match = _extract_ts_array(content, "PROJECTS_DATA")
        if projects_match:
            try:
                projects = json.loads(_normalize_ts_to_json(projects_match))
            except json.JSONDecodeError as e:
                logger.warning(f"Could not parse PROJECTS_DATA from constants.ts: {e}")

        # Extract tech deep dives keys (just the keys for comparison)
        tech_dives = {}
        tech_match = _extract_ts_object(content, "TECHNOLOGY_DEEP_DIVES")
        if tech_match:
            try:
                tech_dives = json.loads(_normalize_ts_to_json(tech_match))
            except json.JSONDecodeError as e:
                logger.warning(f"Could not parse TECHNOLOGY_DEEP_DIVES: {e}")

        return projects, tech_dives

    def run(self, scan_only: bool = False, skip_review: bool = False,
            target_repo: str = None, dry_run: bool = False) -> dict:
        """Execute the full pipeline."""
        results = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "changes_detected": 0,
            "drafts_generated": 0,
            "reviews_completed": 0,
            "entries_written": 0,
            "errors": [],
            "details": [],
        }

        # Step 1: Scan GitHub repos
        logger.info("=" * 60)
        logger.info("STEP 1: Scanning GitHub repositories...")
        logger.info("=" * 60)

        repos = self.scanner.scan_all_repos()
        if target_repo:
            repos = [r for r in repos if r.name == target_repo]
            if not repos:
                logger.error(f"Repository '{target_repo}' not found")
                results["errors"].append(f"Repo not found: {target_repo}")
                return results

        # Enrich repos with detailed data
        logger.info(f"Enriching {len(repos)} repositories with details...")
        for repo in repos:
            try:
                self.scanner.enrich_repo(repo)
            except Exception as e:
                logger.warning(f"Failed to enrich {repo.name}: {e}")

        # Step 2: Detect changes
        logger.info("=" * 60)
        logger.info("STEP 2: Detecting changes...")
        logger.info("=" * 60)

        existing_projects, existing_techs = self.load_existing_data()
        changes = self.scanner.detect_changes(repos, existing_projects, existing_techs)

        # Filter out already-processed changes
        unprocessed = []
        for change in changes:
            sha = ""
            if change.repo_info and change.repo_info.recent_commits:
                sha = change.repo_info.recent_commits[0].get("sha", "")
            if not self.state.is_processed(change.repo_name, change.change_type, sha):
                unprocessed.append(change)

        results["changes_detected"] = len(unprocessed)
        logger.info(f"Found {len(unprocessed)} unprocessed changes "
                     f"(filtered from {len(changes)} total)")

        if scan_only:
            for change in unprocessed:
                logger.info(f"  [{change.change_type}] {change.repo_name}")
                results["details"].append({
                    "type": change.change_type,
                    "repo": change.repo_name,
                })
            return results

        if not unprocessed:
            logger.info("No changes to process. Wiki is up to date!")
            return results

        # Step 3: Generate drafts
        logger.info("=" * 60)
        logger.info("STEP 3: Generating drafts with free AI agent...")
        logger.info("=" * 60)

        drafts = []
        for change in unprocessed:
            try:
                draft = self._generate_draft(change, existing_projects, existing_techs)
                if draft:
                    drafts.append((change, draft))
                    results["drafts_generated"] += 1

                    # Save draft to disk
                    if not dry_run:
                        self._save_draft(change, draft)

                    logger.info(f"  Draft generated: [{change.change_type}] "
                                f"{change.repo_name}")
            except Exception as e:
                logger.error(f"  Draft failed for {change.repo_name}: {e}")
                results["errors"].append(f"Draft error: {change.repo_name}: {e}")

        # Step 4: Review with Claude Opus
        if not skip_review:
            logger.info("=" * 60)
            logger.info("STEP 4: Reviewing with Claude Opus...")
            logger.info("=" * 60)

            reviewed_drafts = []
            for change, draft in drafts:
                try:
                    reviewed = self.reviewer.review(
                        draft=draft,
                        change_type=change.change_type,
                        repo_name=change.repo_name,
                        repo_description=(
                            change.repo_info.description
                            if change.repo_info else ""
                        ),
                        languages=(
                            ", ".join(change.repo_info.languages.keys())
                            if change.repo_info and change.repo_info.languages
                            else ""
                        ),
                        example_entries=existing_projects[:2],
                    )
                    reviewed_drafts.append((change, reviewed))
                    results["reviews_completed"] += 1

                    if not dry_run:
                        self._save_reviewed(change, reviewed)

                    logger.info(f"  Review completed: [{change.change_type}] "
                                f"{change.repo_name}")
                except Exception as e:
                    logger.error(f"  Review failed for {change.repo_name}: {e}")
                    # Use the unreviewed draft as fallback
                    reviewed_drafts.append((change, draft))
                    results["errors"].append(
                        f"Review error (using draft): {change.repo_name}: {e}"
                    )
        else:
            reviewed_drafts = drafts
            logger.info("Skipping Opus review (--skip-review flag)")

        # Step 5: Write output
        if not dry_run:
            logger.info("=" * 60)
            logger.info("STEP 5: Writing output files...")
            logger.info("=" * 60)

            for change, entry in reviewed_drafts:
                try:
                    self._write_output(change, entry)
                    results["entries_written"] += 1

                    # Mark as processed
                    sha = ""
                    if change.repo_info and change.repo_info.recent_commits:
                        sha = change.repo_info.recent_commits[0].get("sha", "")
                    self.state.mark_processed(
                        change.repo_name, change.change_type, sha
                    )

                    logger.info(f"  Written: [{change.change_type}] "
                                f"{change.repo_name}")
                except Exception as e:
                    logger.error(f"  Write failed for {change.repo_name}: {e}")
                    results["errors"].append(
                        f"Write error: {change.repo_name}: {e}"
                    )
        else:
            logger.info("Dry run - no files written")

        # Summary
        logger.info("=" * 60)
        logger.info("PIPELINE COMPLETE")
        logger.info(f"  Changes detected: {results['changes_detected']}")
        logger.info(f"  Drafts generated: {results['drafts_generated']}")
        logger.info(f"  Reviews completed: {results['reviews_completed']}")
        logger.info(f"  Entries written: {results['entries_written']}")
        if results["errors"]:
            logger.warning(f"  Errors: {len(results['errors'])}")
            for err in results["errors"]:
                logger.warning(f"    - {err}")
        logger.info("=" * 60)

        return results

    def _generate_draft(self, change: ChangeDetection,
                        existing_projects: list[dict],
                        existing_techs: dict) -> dict:
        """Generate a draft entry based on change type."""
        templates_dir = self.base_dir / "templates"

        if change.change_type == "new_repo":
            template = load_template(str(templates_dir / "new_repo.yaml"))
            system, user = build_new_repo_prompt(
                template, change.repo_info, existing_projects
            )

        elif change.change_type == "new_feature":
            template = load_template(str(templates_dir / "new_feature.yaml"))
            system, user = build_feature_update_prompt(
                template, change.repo_info, change.existing_entry,
                change.commit_messages, change.new_dependencies
            )

        elif change.change_type == "status_update":
            template = load_template(str(templates_dir / "status_update.yaml"))
            system, user = build_status_update_prompt(
                template, change.existing_entry,
                change.commit_messages,
                self.config["github"].get("lookback_days", 7)
            )

        elif change.change_type == "new_tech":
            template = load_template(str(templates_dir / "technology_deep_dive.yaml"))
            # Find all projects using this tech
            tech_name = change.detected_technologies[0] if change.detected_technologies else "Unknown"
            projects_using = [p["name"] for p in existing_projects
                              if tech_name in p.get("technologies", [])]
            if change.repo_name not in projects_using:
                projects_using.append(change.repo_name)

            system, user = build_tech_deep_dive_prompt(
                template, tech_name, projects_using, existing_techs
            )
        else:
            raise ValueError(f"Unknown change type: {change.change_type}")

        return self.drafter.generate(system, user)

    def _save_draft(self, change: ChangeDetection, draft: dict):
        """Save a draft to the drafts directory."""
        drafts_dir = self.project_root / self.config["output"]["drafts_dir"]
        filename = f"{change.change_type}_{change.repo_name}.json"
        filepath = drafts_dir / _sanitize_filename(filename)
        filepath.write_text(json.dumps(draft, indent=2))

    def _save_reviewed(self, change: ChangeDetection, reviewed: dict):
        """Save a reviewed entry to the reviewed directory."""
        reviewed_dir = self.project_root / self.config["output"]["reviewed_dir"]
        filename = f"{change.change_type}_{change.repo_name}.json"
        filepath = reviewed_dir / _sanitize_filename(filename)
        filepath.write_text(json.dumps(reviewed, indent=2))

    def _write_output(self, change: ChangeDetection, entry: dict):
        """Write the final entry as a standalone JSON file for manual merge."""
        output_dir = self.project_root / "wiki-generator" / ".output"
        output_dir.mkdir(parents=True, exist_ok=True)

        # Validate URLs in tech deep dive learning resources
        url_warnings = []
        if change.change_type == "new_tech":
            value = entry.get("value", entry)
            url_warnings = _validate_learning_resource_urls(
                value.get("learning_resources", [])
            )
            if url_warnings:
                for w in url_warnings:
                    logger.warning(f"  URL validation: {w}")

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{change.change_type}_{change.repo_name}.json"

        output = {
            "change_type": change.change_type,
            "repo_name": change.repo_name,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "entry": entry,
            "instructions": self._get_merge_instructions(change),
        }
        if url_warnings:
            output["url_validation_warnings"] = url_warnings

        filepath = output_dir / _sanitize_filename(filename)
        filepath.write_text(json.dumps(output, indent=2))
        logger.info(f"Output written: {filepath}")

    def _get_merge_instructions(self, change: ChangeDetection) -> str:
        """Generate human-readable instructions for merging this entry."""
        if change.change_type == "new_repo":
            return (
                "NEW PROJECT ENTRY: Add this object to the PROJECTS_DATA array "
                "in constants.ts. Assign the next available id number and update "
                "the github_path accordingly."
            )
        elif change.change_type == "new_feature":
            return (
                f"UPDATE EXISTING ENTRY: Apply the 'updates' fields to the "
                f"existing entry for '{change.repo_name}' in constants.ts. "
                f"See 'rationale' for why each field was changed."
            )
        elif change.change_type == "status_update":
            return (
                f"STATUS UPDATE: Update the 'status' and 'completion_percentage' "
                f"fields for '{change.repo_name}' in constants.ts if "
                f"'should_update' is true."
            )
        elif change.change_type == "new_tech":
            return (
                "NEW TECHNOLOGY DEEP DIVE: Add this key-value pair to the "
                "TECHNOLOGY_DEEP_DIVES object in constants.ts."
            )
        return "Review and manually merge into constants.ts."


def _normalize_ts_to_json(ts_str: str) -> str:
    """Normalize TypeScript-specific syntax to valid JSON.

    Handles: trailing commas, single quotes, unquoted keys, 'as const',
    single-line comments, and template literals (basic).
    """
    import re
    s = ts_str

    # Remove 'as const' suffixes
    s = re.sub(r'\bas\s+const\b', '', s)

    # Remove single-line comments (// ...) but not inside strings
    # Simple heuristic: remove lines that are only comments or trailing comments
    s = re.sub(r'(?m)^\s*//.*$', '', s)
    s = re.sub(r'(?<=[,\]\}\"\d])\s*//[^\n]*', '', s)

    # Replace single-quoted strings with double-quoted strings
    # This is a simple heuristic that handles most common cases
    result = []
    i = 0
    length = len(s)
    while i < length:
        ch = s[i]
        if ch == '"':
            # Skip double-quoted string
            result.append(ch)
            i += 1
            while i < length and s[i] != '"':
                if s[i] == '\\':
                    result.append(s[i])
                    i += 1
                    if i < length:
                        result.append(s[i])
                        i += 1
                    continue
                result.append(s[i])
                i += 1
            if i < length:
                result.append(s[i])
                i += 1
        elif ch == "'":
            # Convert single-quoted string to double-quoted
            result.append('"')
            i += 1
            while i < length and s[i] != "'":
                if s[i] == '\\':
                    result.append(s[i])
                    i += 1
                    if i < length:
                        result.append(s[i])
                        i += 1
                    continue
                # Escape any unescaped double quotes inside
                if s[i] == '"':
                    result.append('\\')
                result.append(s[i])
                i += 1
            if i < length:
                result.append('"')
                i += 1
        elif ch == '`':
            # Convert template literal to double-quoted (strip interpolation)
            result.append('"')
            i += 1
            while i < length and s[i] != '`':
                if s[i] == '\\':
                    result.append(s[i])
                    i += 1
                    if i < length:
                        result.append(s[i])
                        i += 1
                    continue
                if s[i] == '"':
                    result.append('\\')
                result.append(s[i])
                i += 1
            if i < length:
                result.append('"')
                i += 1
        else:
            result.append(ch)
            i += 1

    s = ''.join(result)

    # Quote unquoted keys: word characters before a colon (object keys)
    s = re.sub(r'(?<=[\{,\n])\s*([a-zA-Z_]\w*)\s*:', r' "\1":', s)

    # Remove trailing commas before } or ]
    s = re.sub(r',\s*([}\]])', r'\1', s)

    return s


def _find_bracket_block(content: str, var_name: str, open_bracket: str, close_bracket: str) -> str:
    """Extract a bracketed block from a TypeScript const declaration.

    Locates 'export const {var_name}', finds the opening bracket, then
    scans character-by-character tracking nesting depth while skipping
    string literals and escape sequences until the matching closing bracket.
    """
    import re
    # Find the declaration
    pattern = rf'export\s+const\s+{re.escape(var_name)}\s*(?::\s*[^=]+)?\s*='
    match = re.search(pattern, content)
    if not match:
        return ""

    # Find the opening bracket after '='
    start_search = match.end()
    open_idx = content.find(open_bracket, start_search)
    if open_idx == -1:
        return ""

    # Scan character-by-character tracking nesting and string literals
    depth = 0
    i = open_idx
    in_string = None  # None, '"', "'"  or '`'
    length = len(content)

    while i < length:
        ch = content[i]

        # Handle escape sequences inside strings
        if in_string and ch == '\\':
            i += 2  # skip escaped character
            continue

        # Handle string boundaries
        if ch in ('"', "'", '`'):
            if in_string is None:
                in_string = ch
            elif in_string == ch:
                in_string = None
            i += 1
            continue

        # Only track brackets outside strings
        if in_string is None:
            if ch == open_bracket:
                depth += 1
            elif ch == close_bracket:
                depth -= 1
                if depth == 0:
                    result = content[open_idx:i + 1]
                    # Strip trailing semicolon and 'as const'
                    return result
        i += 1

    return ""


def _extract_ts_array(content: str, var_name: str) -> str:
    """Extract a JSON array from a TypeScript const declaration."""
    return _find_bracket_block(content, var_name, '[', ']')


def _extract_ts_object(content: str, var_name: str) -> str:
    """Extract a JSON object from a TypeScript const declaration."""
    return _find_bracket_block(content, var_name, '{', '}')


def _validate_learning_resource_urls(resources: list) -> list[str]:
    """Validate URLs in learning resources by sending HEAD requests.

    Extracts URLs from markdown links like [text](url) and checks each.
    Returns a list of warning messages for invalid URLs.
    """
    import re
    import urllib.request
    import urllib.error

    warnings = []
    url_pattern = re.compile(r'\[([^\]]*)\]\((https?://[^)]+)\)')

    for resource in resources:
        if not isinstance(resource, str):
            continue
        matches = url_pattern.findall(resource)
        if not matches:
            # Try treating the whole string as a URL
            if resource.startswith("http"):
                matches = [("", resource)]
        for link_text, url in matches:
            try:
                req = urllib.request.Request(url, method="HEAD")
                req.add_header("User-Agent", "wiki-generator-url-validator")
                with urllib.request.urlopen(req, timeout=10) as resp:
                    if resp.status >= 400:
                        warnings.append(
                            f"URL returned {resp.status}: {url}"
                        )
            except urllib.error.HTTPError as e:
                warnings.append(f"URL returned HTTP {e.code}: {url}")
            except Exception as e:
                warnings.append(f"URL unreachable ({e}): {url}")

    return warnings


def _sanitize_filename(name: str) -> str:
    """Make a string safe for use as a filename."""
    import re
    return re.sub(r'[^a-zA-Z0-9._-]', '_', name)


def main():
    parser = argparse.ArgumentParser(
        description="Wiki Generator Pipeline - Auto-generate wiki entries from GitHub repos"
    )
    parser.add_argument("--config", help="Path to config.yaml",
                        default=None)
    parser.add_argument("--scan-only", action="store_true",
                        help="Only scan for changes, don't generate content")
    parser.add_argument("--skip-review", action="store_true",
                        help="Skip the Claude Opus review step")
    parser.add_argument("--repo", help="Process only this specific repository")
    parser.add_argument("--dry-run", action="store_true",
                        help="Don't write any files")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Enable debug logging")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    pipeline = WikiPipeline(config_path=args.config)
    results = pipeline.run(
        scan_only=args.scan_only,
        skip_review=args.skip_review,
        target_repo=args.repo,
        dry_run=args.dry_run,
    )

    # Write results summary
    results_path = (Path(__file__).parent / ".output" / "last_run.json")
    results_path.parent.mkdir(parents=True, exist_ok=True)
    results_path.write_text(json.dumps(results, indent=2))

    # Exit with error code if there were failures
    if results["errors"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
