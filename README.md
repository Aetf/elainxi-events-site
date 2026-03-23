# Elainxi Events Site

This repository contains the source code and content for the Elainxi Events website, a static site built with Hexo and the customized `story` theme.

## ✍️ Day-to-Day Workflow for Content Creators

As a content creator managing the website's text, images, and layout blocks, your workflow is very simple:

1. **Edit Content & Images:** All website content lives in the `source/` directory. 
   - Edit `source/index.md` to update the frontpage.
   - Add new images to `source/images/`.
2. **Preview Changes (Optional):** If you want to see your changes locally before publishing, run:
   ```bash
   mise exec -- hexo server
   ```
   Then open `http://localhost:4000` in your browser.
3. **Save and Create a Pull Request (PR):** Because the `main` branch is protected, you cannot push directly to it. Create a new branch, commit your work, push the branch, and open a PR against `main` on GitHub.
4. **Automated Deployment:** 
   - **Auto-Merge:** When you open your PR, click **Enable auto-merge**. As long as you aren't modifying DNS configurations, GitHub will automatically merge your PR once all background checks pass!
   - **Deployment:** Once merged, GitHub Actions will automatically rebuild and deploy your updated site live to `https://elainxi.events`.

## 📚 Detailed Documentation

For deep-dives into the architecture, component usage, and infrastructure setup, refer to the `docs/` folder:

- [**Theme Components Guide**](docs/components.md) - Learn how to use custom layout tags (like `{% asbanner %}` or `{% asgallery %}`) in your markdown files.
- [**Configuration Map**](docs/configuration.md) - Understand how `_config.yml` and `_config.story.yml` control the site's behavior.
- [**Architecture Overview**](docs/architecture.md) - A high-level look at the deployment and CI/CD setup.
- [**Infrastructure Manual Setup**](docs/manual-setup.md) - From-scratch instructions for configuring GitHub Pages, Cloudflare, and DNSControl.
- [**Agent Guidelines**](AGENTS.md) - Detailed instructions and role definitions for AI agents working on this project.
- [**Changelog**](docs/changelog.md) - An ongoing log of structural changes made to the project.