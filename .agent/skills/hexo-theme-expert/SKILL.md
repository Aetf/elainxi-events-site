---
name: hexo-expert
description: Expert instructions for developing Hexo themes and plugins. Covers the rendering lifecycle, layout hierarchy, partials, i18n, and best practices for static site generation architecture.
---

# Hexo Framework Expert

This skill provides deep knowledge of the Hexo architecture. It specializes in constructing modular themes using the Layout/Partial pattern and extending functionality via the API.

## When to use this skill
- When creating **Theme Layouts** (`layout.ejs`, `post.ejs`, `archive.ejs`).
- When structuring **Theme Assets** (CSS, JS, Third-party libs).
- When writing **Plugins** (Generators, Filters, Helpers, Tags).
- When debugging the `hexo generate` lifecycle or variable scope issues.

## Core Concepts & Constraints

1.  **Lifecycle Awareness**: Code must respect the `init` -> `load` -> `generate` -> `deploy` cycle.
2.  **Plugin Location**:
    - **Local Plugin**: `scripts/` folder (No `package.json` needed, immediate load). Use for quick, site-specific logic.
    - **NPM Plugin**: `node_modules/` (Requires `package.json`, listed in `_config.yml`). Use for redistributable extensions.
3.  **Context**: Internal scripts must often use `const hexo = this;` or access `hexo.locals`.

## 1. Theme Development (Deep Dive)

### Standard Directory Structure
Enforce this structure for any new theme creation:
```text
themes/my-theme/
├── languages/          # i18n files (en.yml, ja.yml)
├── layout/             # Template files (EJS, Pug, etc.)
│   ├── _partial/       # Reusable components (header, footer)
│   ├── layout.ejs      # The master "shell" (html/head/body)
│   ├── index.ejs       # Homepage layout
│   ├── post.ejs        # Single post layout
│   └── archive.ejs     # Archive list layout
├── source/             # Static assets
│   ├── css/            # Stylus/SCSS/CSS files
│   └── js/             # Client-side JavaScript
└── _config.yml         # Theme-specific configuration
```

### Layout Hierarchy & Wrappers

Hexo templates render "inside-out". The specific layout (`post`) is rendered
first, and its result is passed to the main layout (`layout`) as the `body`
variable.

**Pattern: The Master Shell (`layout.ejs`)**
*This file contains the global HTML structure.*

```ejs
<!DOCTYPE html>
<html>
<head>
  <%- partial('_partial/head') %>
</head>
<body>
  <%- partial('_partial/header') %>
  
  <main class="content">
    <%- body %>
  </main>

  <%- partial('_partial/footer') %>
  <%- js('js/script') %>
</body>
</html>
```

**Pattern: The Content Layout (`post.ejs`)**
*This file defines how a single article looks.*

```ejs
<article class="post">
  <header>
    <h1><%= page.title %></h1>
    <div class="meta">
      <time datetime="<%= date_xml(page.date) %>">
        <%= date(page.date) %>
      </time>
    </div>
  </header>
  
  <div class="entry-content">
    <%- page.content %>
  </div>
</article>
```

### Theme Best Practices
1. **Strict Variable Scoping**:
* Use `theme.config_name` for variables in `themes/my-theme/_config.yml`.
* Use `config.title` for variables in the root `_config.yml`.
* Use `page.title` for the current page context.

2. **Asset Injection**:
* Never hardcode `<link>` or `<script>` tags.
* Use the helpers: `<%- css('css/style') %>` and `<%- js('js/main') %>`. This allows plugins to hook into the asset pipeline.

3. **Internationalization (i18n)**:
* Avoid hardcoding text like "Read More".
* Use `<%= __('read_more') %>`.
* Create `languages/en.yml` with keys: `read_more: "Read More"`.

4. **Handling "Excerpts"**:
* Always check `if (page.excerpt)` before rendering full content on index pages to improve build speed and UX.

## 2. Plugin Development (API)

Choose the correct extension point based on the goal:
- **Console**: CLI commands (e.g., `hexo my-command`).
- **Generator**: creating NEW routes/pages (e.g., sitemaps, JSON feeds).
- **Filter**: modifying data BEFORE/AFTER rendering (e.g., SEO injection, minification).
- **Helper**: functions used INSIDE templates (e.g., `calculate_reading_time()`).
- **Tag**: custom markdown syntax (e.g., `{% youtube id %}`).

### Critical Distinction: Local vs. NPM

* **Local Plugin**: Create in `scripts/filename.js`. Use for quick hacks or site-specific logic. Loaded immediately.
* **NPM Plugin**: Create in `node_modules/hexo-plugin-name`. Requires `package.json` and `index.js`.

### Common Extension Points

**1. Filter (The "Middleman")**
*Best for: modifying HTML, CSS, or JS right before it is saved to disk.*

```javascript
// scripts/minify-html.js
hexo.extend.filter.register('after_render:html', function(str, data){
  // 'str' is the HTML content
  return str.replace(//g, ""); // Remove comments
});
```

**2. Helper (The "Tool")**
*Best for: functions you need to call inside your EJS templates.*

```javascript
// scripts/helpers.js
hexo.extend.helper.register('social_link', function(username){
  return `https://twitter.com/${username}`;
});
// Usage: <a href="<%= social_link(theme.twitter) %>">Twitter</a>
```

**3. Generator (The "Creator")**
*Best for: creating completely new pages (like a /search.xml or /portfolio).*

```javascript
// scripts/json-feed.js
hexo.extend.generator.register('json_feed', function(locals){
  return {
    path: 'feed.json',
    data: JSON.stringify(locals.posts.map(p => p.title))
  };
});
```

## 3. Verification

You can use the usual `hexo generate` and `hexo serve` combo to start a server
and use browser tools to view the generate site.

Remember to stop the running `hexo serve` process after you are done, so the
next time the command can run on the same port.
