# AstraDup-Cross-Storage-Video-Files-duplication-tracker

**Status:** Substantial | **Completion:** 60%

## Description
A high-performance utility for identifying and tracking duplicate video files across disparate storage systems using perceptual hashing.

## Key Features
- Cross-storage scanning (S3, GCS, Local)
- Perceptual hashing for visual duplicates
- Audio fingerprinting for audio duplicates
- Interactive duplicate management CLI
- Configurable hash strength and thresholds

## Technologies
Python, FFmpeg, ImageHash, SQLite, AWS S3 SDK

## README

## AstraDup - Video Duplication Tracker

A command-line utility for finding and managing duplicate video files across local and cloud storage. It goes beyond simple filename or checksum matching by using perceptual hashing to find visually identical videos, even if they have different resolutions, formats, or encodings.

### Architecture
- **Core Engine:** A Python application using the Typer CLI framework.
- **Video Processing:** Leverages FFmpeg to extract keyframes from video files.
- **Hashing:** Uses the ImageHash library to generate perceptual hashes for each keyframe.
- **Indexing:** Caches file paths, metadata, and hashes in a local SQLite database to speed up subsequent scans.

### Key Features
- **Perceptual Hashing:** Finds duplicates that have been re-encoded or slightly altered.
- **Cross-Storage:** Scans local directories, AWS S3 buckets, and GCS buckets.
- **Interactive CLI:** Provides tools to review duplicates and take action (e.g., generate a deletion script).

### Usage
1.  **Scan a directory:** `astradup scan --path /path/to/videos`
2.  **Scan an S3 bucket:** `astradup scan --s3-bucket my-video-bucket`
3.  **Generate a report:** `astradup report --format csv > duplicates.csv`
4.  **Manage duplicates interactively:** `astradup manage`

## Architecture Decisions

### ADR-001: Choice of Hashing Strategy

**Status:** Accepted

**Context:** We need an effective way to identify duplicate videos. Simple file hashes fail if the encoding or metadata is different. We considered several perceptual hashing libraries.

**Decision:** We will use the **ImageHash library with a difference hash (dhash)** algorithm. We will extract keyframes from the video using FFmpeg and generate a composite hash from the hashes of several frames.

**Consequences:**
*   **Pros:** The ImageHash library is lightweight, well-maintained, and fast. dhash is resilient to minor changes in resolution, compression, and watermarking. This approach is significantly faster than more complex methods like SIFT.
*   **Cons:** This method is not effective for identifying videos that are edited (e.g., scenes reordered). For that, more advanced video fingerprinting would be required, which adds significant complexity.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** A user runs the tool against a malicious S3 bucket they do not own. **Mitigation:** The tool operates with the credentials configured in the user's environment. The responsibility for credential security lies with the user, as is standard for CLI tools.
*   **Tampering:** The local SQLite database is corrupted, leading to incorrect duplicate reports. **Mitigation:** The database is treated as a cache. It can be rebuilt from scratch by re-scanning the source directories. Implement transactional writes to reduce the chance of corruption.
*   **Repudiation:** Not applicable for a local utility.
*   **Information Disclosure:** Cloud storage credentials are exposed. **Mitigation:** The application never stores credentials itself; it relies on standard SDK environment variables or IAM roles. Documentation will strongly recommend using IAM roles where possible.
*   **Denial of Service:** The tool consumes all available CPU and memory when scanning a very large number of files. **Mitigation:** Implement options to limit the number of parallel worker processes. Use streaming to process large files instead of loading them into memory.
*   **Elevation of Privilege:** A vulnerability in FFmpeg could be exploited by a malicious video file. **Mitigation:** Run FFmpeg commands in a sandboxed environment if possible. Keep the FFmpeg binary up-to-date. Advise users to only scan trusted sources.

