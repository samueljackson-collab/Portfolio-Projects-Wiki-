# FamilyBridge-Photos Public

**Status:** Advanced | **Completion:** 75%

## Description
A self-hosted photo sharing application designed with a focus on accessibility and ease-of-use for elderly family members.

## Key Features
- High-contrast, large-font UI (WCAG AA compliant)
- One-click photo uploads via web and email
- Facial recognition for automatic tagging
- Shared albums with email notifications
- Simple, passwordless login via magic links

## Technologies
React, TypeScript, Next.js, Tailwind CSS, SQLite

## README

## FamilyBridge-Photos

A self-hosted photo sharing web application designed from the ground up with elder users in mind. It prioritizes simplicity, accessibility, and privacy over complex features.

### Architecture
- **Frontend:** A highly accessible React/Next.js application using Tailwind CSS for a responsive, high-contrast UI.
- **Backend:** A simple Next.js API route system.
- **Database:** A single-file SQLite database for zero-configuration setup and easy backups.

### Key Features
- **Accessibility First:** Adheres to WCAG AA guidelines with large fonts, high contrast, and simple navigation.
- **Multiple Upload Methods:** Users can upload photos via the web interface or by simply sending an email to a designated address.
- **Passwordless Login:** Authentication is handled via magic links sent to a user's email, removing the need to remember passwords.

### Setup & Usage
1.  **Prerequisites:** Docker must be installed.
2.  **Run Application:** `docker run -p 3000:3000 -v ./data:/app/data familybridge-photos:latest`
3.  **Access:** Open a web browser to `http://localhost:3000`.
4.  The `data` volume will store the SQLite database and all uploaded photos.

## Architecture Decisions

### ADR-001: Choice of Database

**Status:** Accepted

**Context:** The application needs a database to store user information, album metadata, and photo details. It must be simple to manage for non-technical users in a self-hosted environment.

**Decision:** We will use **SQLite** with the database file stored on the local filesystem. The application will connect to it directly.

**Consequences:**
*   **Pros:** Zero-configuration setup, making the application extremely easy to deploy (often just a single binary). Backups are as simple as copying a file. Excellent performance for a single-node, low-concurrency application like this.
*   **Cons:** Does not scale horizontally. Concurrent write performance can be a bottleneck, though this is not a primary concern for this application's expected usage pattern.

## Threat Model

### STRIDE Threat Model

*   **Spoofing:** An unauthorized user gains access by guessing a user's email. **Mitigation:** Implement rate limiting on magic link generation. Links must be short-lived and single-use.
*   **Tampering:** An attacker modifies photos after they have been uploaded. **Mitigation:** Store checksums (hashes) of all uploaded photos and verify them periodically. Use strict file permissions on the storage directory.
*   **Repudiation:** A user denies uploading a specific photo. **Mitigation:** Log all upload events, associating them with the user, IP address, and timestamp.
*   **Information Disclosure:** A user gains access to an album they are not a member of. **Mitigation:** Implement strict, clear authorization logic. All database queries for photos and albums must be scoped to the currently authenticated user's permissions.
*   **Denial of Service:** A user uploads a massive number of large photos, filling the server's disk space. **Mitigation:** Enforce user-level storage quotas. Use a background job queue to process image thumbnails to prevent blocking the main application thread during uploads.
*   **Elevation of Privilege:** A vulnerability in an image processing library (e.g., ImageMagick) allows for remote code execution. **Mitigation:** Run the image processing tasks in a separate, sandboxed container with minimal privileges. Keep all dependencies up-to-date with automated security scanners like Dependabot.

