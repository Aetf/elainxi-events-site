# Agent Mistakes & Lessons Learned

This document tracks mistakes made during development by AI agents to prevent them from being repeated in the future. 

## CLI Execution (npm / npx)
- **Mistake:** Attempted to use `npx` directly in GitHub Actions and local commands.
- **Lesson:** `AGENTS.md` strictly bans `npx` and mandates `mise`. All tooling commands must run through `mise exec --`.
- **Mistake:** Used `mise exec -- npm exec http-server public -p 4000` which caused `npm` to swallow the `-p 4000` flag, leading the server to boot on the default `8080/8082` port instead.
- **Lesson:** When passing arguments through `npm exec` to a binary, the `--` delimiter is strictly required: `mise exec -- npm exec -- http-server public -p 4000`.

## GitHub Pages & Repository Settings
- **Mistake:** Attempted to configure strict branch protection rules (`require status checks before merging`) on a Private GitHub repository under the GitHub Free tier limit.
- **Lesson:** GitHub Free restricts branch protection rules to Public repositories only. We had to migrate the repository from Private to Public (and add an All Rights Reserved LICENSE) to enable the required Auto-Merge and DNS-gating functionality.

## Continuous Integration
- **Mistake:** Attempted to directly embed GitHub Action visual diff artifacts into PR comments using internal `githubusercontent` upload URLs.
- **Lesson:** The GitHub API and `gh cli` do not support natively uploading images into Markdown comments for security reasons. Artifacts must be linked via Actions Run URLs, or pushed to an orphan branch if direct Markdown `![img](url)` embedding is rigidly required.

## Documentation Sync
- **Mistake:** Implemented complex Visual Regression CI workflows without immediately logging them in `docs/changelog.md` and `docs/architecture.md`.
- **Lesson:** Agents must continually document architecture and system modifications. All changes must be explicitly appended to the `changelog.md` *in the same working step* they are created.
