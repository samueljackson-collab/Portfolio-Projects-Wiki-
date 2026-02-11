"""
Prompt Builder
==============
Builds prompts from YAML templates by filling in variables from scanner data.
"""

import json
import logging
from dataclasses import asdict
from pathlib import Path

import yaml

logger = logging.getLogger(__name__)


def load_template(template_path: str) -> dict:
    """Load a YAML template file."""
    path = Path(template_path)
    if not path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")
    return yaml.safe_load(path.read_text())


def build_new_repo_prompt(template: dict, repo_info, example_entries: list[dict]) -> tuple[str, str]:
    """Build system + user prompts for a new repository entry."""
    system_prompt = template["system_prompt"]

    # Format config files
    config_content = ""
    for fname, content in repo_info.config_files.items():
        config_content += f"\n### {fname}\n```\n{content[:2000]}\n```\n"
    if not config_content:
        config_content = "No configuration files detected."

    # Format CI/CD
    cicd_content = ""
    for wf_name, content in repo_info.cicd_workflows.items():
        cicd_content += f"\n### {wf_name}\n```yaml\n{content[:2000]}\n```\n"
    if not cicd_content:
        cicd_content = "No CI/CD workflows detected."

    # Pick 2 example entries for style reference (pick varied statuses)
    examples = json.dumps(example_entries[:2], indent=2)[:4000]

    user_prompt = template["user_prompt"]
    replacements = {
        "{{repo_name}}": repo_info.name,
        "{{repo_description}}": repo_info.description or "No description provided",
        "{{primary_language}}": repo_info.primary_language,
        "{{languages}}": ", ".join(repo_info.languages.keys()) if repo_info.languages else repo_info.primary_language,
        "{{topics}}": ", ".join(repo_info.topics) if repo_info.topics else "None",
        "{{default_branch}}": repo_info.default_branch,
        "{{created_at}}": repo_info.created_at,
        "{{updated_at}}": repo_info.updated_at,
        "{{stars}}": str(repo_info.stars),
        "{{has_wiki}}": str(repo_info.has_wiki),
        "{{open_issues}}": str(repo_info.open_issues),
        "{{readme_content}}": repo_info.readme_content[:5000] or "No README found",
        "{{file_tree}}": "\n".join(repo_info.file_tree) if repo_info.file_tree else "Could not retrieve",
        "{{config_files_content}}": config_content,
        "{{cicd_content}}": cicd_content,
        "{{example_entries}}": examples,
    }

    for placeholder, value in replacements.items():
        user_prompt = user_prompt.replace(placeholder, value)

    return system_prompt, user_prompt


def build_feature_update_prompt(template: dict, repo_info,
                                existing_entry: dict,
                                commit_messages: list[str],
                                new_deps: list[str]) -> tuple[str, str]:
    """Build prompts for updating an existing entry with new features."""
    system_prompt = template["system_prompt"]
    user_prompt = template["user_prompt"]

    replacements = {
        "{{current_entry}}": json.dumps(existing_entry, indent=2)[:4000],
        "{{change_type}}": "New features and significant changes detected",
        "{{changed_files}}": "See commit messages for details",
        "{{commit_messages}}": "\n".join(f"- {m}" for m in commit_messages[:20]),
        "{{diff_summary}}": f"{len(commit_messages)} commits with feature additions",
        "{{readme_content}}": repo_info.readme_content[:5000] if repo_info else "Not changed",
        "{{cicd_content}}": _format_cicd(repo_info) if repo_info else "Not changed",
        "{{new_dependencies}}": ", ".join(new_deps[:20]) if new_deps else "None detected",
    }

    for placeholder, value in replacements.items():
        user_prompt = user_prompt.replace(placeholder, value)

    return system_prompt, user_prompt


def build_status_update_prompt(template: dict,
                               existing_entry: dict,
                               commit_messages: list[str],
                               lookback_days: int) -> tuple[str, str]:
    """Build prompts for a status/completion update assessment."""
    system_prompt = template["system_prompt"]
    user_prompt = template["user_prompt"]

    # Detect signals from commits
    signals = []
    all_msgs = " ".join(commit_messages).lower()
    if "test" in all_msgs:
        signals.append("Tests added or updated")
    if "ci" in all_msgs or "workflow" in all_msgs:
        signals.append("CI/CD changes")
    if "doc" in all_msgs or "readme" in all_msgs:
        signals.append("Documentation updates")
    if "docker" in all_msgs:
        signals.append("Containerization work")
    if "fix" in all_msgs:
        signals.append("Bug fixes (maturity signal)")
    if "security" in all_msgs or "scan" in all_msgs:
        signals.append("Security improvements")
    if not signals:
        signals.append("General development activity")

    replacements = {
        "{{project_name}}": existing_entry.get("name", "Unknown"),
        "{{current_status}}": existing_entry.get("status", "Unknown"),
        "{{current_completion}}": str(existing_entry.get("completion_percentage", 0)),
        "{{lookback_days}}": str(lookback_days),
        "{{commit_count}}": str(len(commit_messages)),
        "{{commit_messages}}": "\n".join(f"- {m}" for m in commit_messages[:20]),
        "{{changed_files_summary}}": "See commit messages for file change details",
        "{{signals}}": "\n".join(f"- {s}" for s in signals),
    }

    for placeholder, value in replacements.items():
        user_prompt = user_prompt.replace(placeholder, value)

    return system_prompt, user_prompt


def build_tech_deep_dive_prompt(template: dict, tech_name: str,
                                projects_using: list[str],
                                example_dives: dict) -> tuple[str, str]:
    """Build prompts for a new technology deep dive."""
    system_prompt = template["system_prompt"]
    user_prompt = template["user_prompt"]

    tech_key = tech_name.lower().replace(" ", "_").replace(".", "")

    # Pick 1-2 example deep dives for style
    example_keys = list(example_dives.keys())[:2]
    examples = {k: example_dives[k] for k in example_keys}

    replacements = {
        "{{technology_name}}": tech_name,
        "{{technology_key}}": tech_key,
        "{{projects_using}}": ", ".join(projects_using),
        "{{usage_context}}": f"Used across {len(projects_using)} portfolio project(s)",
        "{{example_deep_dives}}": json.dumps(examples, indent=2)[:6000],
    }

    for placeholder, value in replacements.items():
        user_prompt = user_prompt.replace(placeholder, value)

    return system_prompt, user_prompt


def _format_cicd(repo_info) -> str:
    """Format CI/CD workflows for prompt inclusion."""
    if not repo_info or not repo_info.cicd_workflows:
        return "No CI/CD workflows detected."
    parts = []
    for name, content in repo_info.cicd_workflows.items():
        parts.append(f"### {name}\n```yaml\n{content[:2000]}\n```")
    return "\n".join(parts)
