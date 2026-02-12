#!/usr/bin/env python3
"""
Merge Entries Tool
==================
Takes reviewed wiki entries from the .output directory and provides
an interactive way to merge them into constants.ts.

Usage:
    # List all pending entries
    python merge_entries.py --list

    # Preview a specific entry
    python merge_entries.py --preview <filename>

    # Apply all entries (generates updated constants.ts snippet)
    python merge_entries.py --apply

    # Apply a specific entry
    python merge_entries.py --apply --entry <filename>
"""

import argparse
import json
import sys
from pathlib import Path


def list_pending():
    """List all pending entries in .output directory."""
    output_dir = Path(__file__).parent / ".output"
    if not output_dir.exists():
        print("No .output directory found. Run the pipeline first.")
        return

    entries = sorted(output_dir.glob("*.json"))
    entries = [e for e in entries if e.name != "last_run.json"]

    if not entries:
        print("No pending entries found.")
        return

    print(f"\n{'='*60}")
    print(f"  Pending Wiki Entries ({len(entries)} total)")
    print(f"{'='*60}\n")

    for entry_file in entries:
        try:
            data = json.loads(entry_file.read_text())
        except json.JSONDecodeError as e:
            print(f"  WARNING: Skipping malformed JSON in {entry_file.name}: {e}")
            continue
        change_type = data.get("change_type", "unknown")
        repo_name = data.get("repo_name", "unknown")
        generated_at = data.get("generated_at", "unknown")
        instructions = data.get("instructions", "")

        print(f"  [{change_type.upper()}] {repo_name}")
        print(f"    File: {entry_file.name}")
        print(f"    Generated: {generated_at}")
        print(f"    Action: {instructions[:80]}...")
        print()


def preview_entry(filename: str):
    """Show the full content of a pending entry."""
    output_dir = Path(__file__).parent / ".output"
    filepath = output_dir / filename

    if not filepath.exists():
        print(f"Entry not found: {filename}")
        return

    data = json.loads(filepath.read_text())
    print(f"\n{'='*60}")
    print(f"  Entry: {data.get('repo_name', 'unknown')}")
    print(f"  Type: {data.get('change_type', 'unknown')}")
    print(f"{'='*60}\n")
    print(f"Instructions: {data.get('instructions', '')}\n")
    print("Entry content:")
    print(json.dumps(data.get("entry", {}), indent=2))


def generate_ts_snippet(filename: str = None):
    """Generate TypeScript code snippets ready to paste into constants.ts."""
    output_dir = Path(__file__).parent / ".output"

    if filename:
        target = output_dir / filename
        if not target.exists():
            print(f"Error: Entry file not found: {filename}", file=sys.stderr)
            sys.exit(1)
        files = [target]
    else:
        files = sorted(output_dir.glob("*.json"))
        files = [f for f in files if f.name != "last_run.json"]

    if not files:
        print("No entries to apply.")
        return

    new_projects = []
    project_updates = []
    new_tech_dives = []
    status_updates = []

    for filepath in files:
        if not filepath.exists():
            continue
        try:
            data = json.loads(filepath.read_text())
        except json.JSONDecodeError as e:
            print(f"WARNING: Skipping malformed JSON in {filepath.name}: {e}",
                  file=sys.stderr)
            continue
        change_type = data.get("change_type", "")
        entry = data.get("entry", {})

        if change_type == "new_repo":
            new_projects.append(entry)
        elif change_type == "new_feature":
            project_updates.append({
                "repo_name": data.get("repo_name", ""),
                "updates": entry.get("updates", entry),
                "rationale": entry.get("rationale", ""),
            })
        elif change_type == "status_update":
            status_updates.append({
                "repo_name": data.get("repo_name", ""),
                "update": entry,
            })
        elif change_type == "new_tech":
            new_tech_dives.append(entry)

    # Generate output
    print(f"\n{'='*60}")
    print("  Generated TypeScript Snippets")
    print(f"{'='*60}\n")

    if new_projects:
        print("// ===== NEW PROJECT ENTRIES =====")
        print("// Add these to the PROJECTS_DATA array in constants.ts\n")
        for proj in new_projects:
            print(f"    {json.dumps(proj, indent=4)},\n")

    if project_updates:
        print("\n// ===== PROJECT UPDATES =====")
        print("// Apply these field updates to existing entries\n")
        for update in project_updates:
            print(f"// Update for: {update['repo_name']}")
            print(f"// Rationale: {update['rationale']}")
            print(f"// Fields to update: {json.dumps(update['updates'], indent=4)}\n")

    if status_updates:
        print("\n// ===== STATUS UPDATES =====")
        for update in status_updates:
            print(f"// Update for: {update['repo_name']}")
            print(f"// {json.dumps(update['update'], indent=4)}\n")

    if new_tech_dives:
        print("\n// ===== NEW TECHNOLOGY DEEP DIVES =====")
        print("// Add these to TECHNOLOGY_DEEP_DIVES in constants.ts\n")
        for tech in new_tech_dives:
            key = tech.get("key", "unknown")
            value = tech.get("value", tech)
            print(f'    "{key}": {json.dumps(value, indent=4)},\n')


def main():
    parser = argparse.ArgumentParser(description="Merge wiki entries into constants.ts")
    parser.add_argument("--list", action="store_true", help="List pending entries")
    parser.add_argument("--preview", metavar="FILE", help="Preview a specific entry")
    parser.add_argument("--apply", action="store_true",
                        help="Generate TS snippets for merging")
    parser.add_argument("--entry", metavar="FILE",
                        help="Apply only this specific entry file")

    args = parser.parse_args()

    if args.list:
        list_pending()
    elif args.preview:
        preview_entry(args.preview)
    elif args.apply:
        generate_ts_snippet(args.entry)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
