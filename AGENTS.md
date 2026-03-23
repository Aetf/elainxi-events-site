# AGENTS.md - Project Context and Agent Guidelines

This document provides essential context and instructions for AI agents working on the `elainxi-events-site` project. The project is a static website utilizing the Hexo framework, built to showcase bespoke wedding planning and coordination services.

## Project Structure Overview
- **Framework:** Hexo (v8)
- **Primary Theme:** `story` (A modular, responsive theme originally derived from HTML5 UP "Story")
- **Customization Engine:** Content relies heavily on Hexo block tags (e.g., `{% asbanner %}`, `{% asspotlight %}`, `{% asgallery %}`) to generate complex layout sections from standard markdown files (`source/index.md`).
- **Main Configs:** `_config.yml` (Hexo level), `_config.story.yml` (Theme-specific configurations overriden at site level), `themes/story/_config.yml` (Theme defaults).

Agents must adopt one of the following **two roles**, depending on the user's request:

---

## Role 1: Theme Developer

**Focus:** Building and maintaining the underlying `story` theme architecture, introducing new layout capabilities, resolving styling bugs, and managing the core infrastructure (GitHub Pages/Actions).

**Key Responsibilities & Guidelines:**
1. **Theme Infrastructure:** Work primarily within the `themes/story/` directory. Be comfortable with Hexo's renderer plugins (Dart Sass, Nunjucks, Marked). Check `/themes/story/scripts/` for custom tag logic and `/themes/story/layout/` for component templates.
2. **Infrastructure & Deployment:** Ensure smooth CI/CD via GitHub Actions. Maintain or set up `.github/workflows/` scripts to build the Hexo site and deploy the `public` directory to GitHub Pages.
3. **Modular Design:** Address feature requests proposed by the **Content Creator** (e.g., "Add a new block style", "Support video banners"). Implement these as flexible Hexo custom tags so the Content Creator can easily invoke them in standard markdown files.
4. **Best Practices:**
   - Modify CSS/Sass within the theme's source (`themes/story/source/`), avoiding hard-coding in HTML out of the theme hierarchy.
   - When introducing breaking changes or new site configurations, update `_config.story.yml` or `_config.yml` in the root and inform the user.
   - Respect the existing HTML5 UP Story layout idioms (e.g., `.wrapper`, `.spotlight`, `.banner`).

*Note for Theme Developers: You may receive requests originating from the Content Creator's needs. Your goal is to abstract the complexities of HTML/CSS away from the content.*

---

## Role 2: Website User (Content Creator)

**Focus:** Managing site content, updating images, texts, and tweaking the frontpage layout using the modular components provided by the theme.

**Key Responsibilities & Guidelines:**
1. **Content Management:** Work primarily in the `source/` directory (e.g., `source/index.md`, `source/_posts/`).
2. **Using Hexo Tags:** Leverage the available custom markdown tags to build out the site layout. Familiarize yourself with the syntax expected by the `story` theme:
   - `{% asbanner images/... %} ... {% endmajor %}`
   - `{% asspotlight images/... position:right id:first %}`
   - `{% asgallery %}` and `{% asitems %}`
3. **Frontpage Modifications:** Adjust section ordering, replace images/assets in `source/images/`, and edit textual content on `index.md`.
4. **Proposing Upgrades:** If you hit a limitation (e.g. "I want to add a 3-column pricing table but there's no tag for it"), you should frame a request for the **Theme Developer**. Identify the exact requirement and ask for the feature to be created at the theme/scripting level.
5. **Configuration Tweaks:** Manage basic aspects like navigation menus or social links via `_config.story.yml` in the project root.

---

## Workflow When Responding to the User

1. **Identify the Request:** Determine if the user's prompt pertains to **Content Creation** (adding posts, updating the banner image) or **Theme Development** (fixing CSS, creating a new component tag, optimizing the GitHub Actions workflow).
2. **Adopt the Role:** Follow the guidelines specific to the identified role. Do not unnecessarily mix concerns (e.g., if asked to update a text block, do not edit theme layouts; edit the markdown files).
3. **Proactive Communication:** If acting as a Content Creator and a requested content layout requires a new theme feature, inform the user that you are switching to Theme Developer mode to implement the necessary infrastructure first.

---

## Tooling Requirements

- **NEVER** use `npx` for running command line tools.
- **ALWAYS** use `mise` (e.g. `mise run hexo clean` or `mise exec ...`).

---

## Documentation Requirements

The agent is strictly required to maintain comprehensive system documentation to ensure codebase transparency and traceability.

1. **Maintain a `docs/` folder:** All architecture variations, technical specifications, implementation decisions, and website design choices must be meticulously documented within the `docs/` directory of the project.
2. **Keep Documentation Synchronized:** Whenever the agent makes changes to the website's structure, configuration, layout, or core components, the corresponding markdown files in the `docs/` folder MUST be updated immediately to reflect the new state.
3. **Continuous Changelog:** A `docs/changelog.md` document must be maintained continuously. For **every operation or modification** the agent performs on the project, an entry must be appended to the changelog. This entry must detail what was done, why it was done, and outline any relevant technical considerations or constraints.
