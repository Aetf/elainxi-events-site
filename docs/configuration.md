# Configuration Setup

The site settings are cascaded across multiple layers:

## 1. Hexo Site Config (`/_config.yml`)
- Tracks the main environment values like `title: Elainxi Events`, URL (`https://elainxi.events`), syntax highlighting tools, deployment integrations, and basic metadata.

## 2. Story Site Overrides (`/_config.story.yml`)
- Provides users the ability to perform high-level theme configuration *without* touching the internal theme source code.
- Includes settings for root navigational menus (`menu:`), primary social links, and footer logic including brand attribution toggles.

## 3. Story Internal Theme Defaults (`/themes/story/_config.yml`)
- Low-level settings for the theme's core operational logic.
- Defines standard interaction actions for sections (e.g. the default 'Get Started' button configuration linking to specific auto-generated anchors).
- Specifies Sass compilation contexts (e.g. expanding modules from `node_modules`).

*Note for Agents:* Always favor placing user-focused changes inside `_config.story.yml` or `_config.yml` at the site root. Only alter the internal `themes/story/_config.yml` if the goal is changing the deep architecture of the `story` package itself.
