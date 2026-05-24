#!/usr/bin/env python3
"""
Generate images/manifest.json for the B737 Maintenance Aid Editor.
Run this from the repo root (the folder that contains index.html).
It scans every images/<chapter>/ folder, finds the numbered image files
matching the naming convention (e.g. 21_5.png, 22_18.png), and writes
the result to images/manifest.json.
The page loads this manifest on startup instead of probing ~1,950
image URLs to discover which ones exist. Re-run this script any time
you add or remove images, then commit the updated manifest.json.
Usage:
    cd /path/to/your/B737/repo
    python3 generate_manifest.py
"""
import json
import re
import sys
from pathlib import Path
# Must match CHAPTER_FOLDER_CONFIG in index.html
CHAPTER_FOLDER_CONFIG = {
    "21": {"count": 17, "prefix": "21"},
    "22": {"count": 80, "prefix": "22"},
    "23": {"count": 80, "prefix": "23"},
    "24": {"count": 80, "prefix": "24"},
    "25": {"count": 80, "prefix": "25"},
    "26": {"count": 80, "prefix": "26"},
    "27": {"count": 80, "prefix": "27"},
    "28": {"count": 80, "prefix": "28"},
    "29": {"count": 80, "prefix": "29"},
    "30": {"count": 80, "prefix": "30"},
    "31": {"count": 80, "prefix": "31"},
    "32": {"count": 80, "prefix": "32"},
    "33": {"count": 80, "prefix": "33"},
    "34": {"count": 80, "prefix": "34"},
    "35": {"count": 80, "prefix": "35"},
    "36": {"count": 80, "prefix": "36"},
    "38": {"count": 80, "prefix": "38"},
    "44": {"count": 80, "prefix": "44"},
    "45": {"count": 80, "prefix": "45"},
    "46": {"count": 80, "prefix": "46"},
    "49": {"count": 80, "prefix": "49"},
    "52": {"count": 80, "prefix": "52"},
    "57": {"count": 80, "prefix": "57"},
    "72": {"count": 80, "prefix": "72"},
    "80": {"count": 80, "prefix": "80"},
}
# Accept common web image extensions
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
def scan_chapter(folder: Path, prefix: str, max_count: int) -> list[int]:
    """Return sorted list of image numbers actually present in the folder."""
    if not folder.is_dir():
        return []
    pattern = re.compile(rf"^{re.escape(prefix)}_(\d+)$")
    found = set()
    for entry in folder.iterdir():
        if not entry.is_file():
            continue
        if entry.suffix.lower() not in IMAGE_EXTS:
            continue
        m = pattern.match(entry.stem)
        if not m:
            continue
        n = int(m.group(1))
        if 1 <= n <= max_count:
            found.add(n)
    return sorted(found)
def main() -> int:
    repo_root = Path.cwd()
    images_dir = repo_root / "images"
    if not images_dir.is_dir():
        print(
            f"Error: no 'images' folder found in {repo_root}. "
            "Run this script from the repo root.",
            file=sys.stderr,
        )
        return 1
    manifest: dict[str, list[int]] = {}
    total_files = 0
    for chapter, cfg in CHAPTER_FOLDER_CONFIG.items():
        folder = images_dir / chapter
        nums = scan_chapter(folder, cfg["prefix"], cfg["count"])
        manifest[chapter] = nums
        total_files += len(nums)
        print(f"  Chapter {chapter}: {len(nums):3d} images")
    output = images_dir / "manifest.json"
    with output.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, separators=(",", ":"))
    print()
    print(f"Wrote {output} ({total_files} images across {len(manifest)} chapters)")
    print("Commit and push manifest.json to make load faster for everyone.")
    return 0
if __name__ == "__main__":
    sys.exit(main())
