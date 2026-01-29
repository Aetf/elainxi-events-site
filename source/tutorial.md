---
layout: index
title: Theme Tutorial
---

# Theme Tutorial

{% asbanner images/banner.jpg style:1 orient:left content_align:left image_position:right fullscreen onload_image:fade-in onload_content:fade-right %}

{% major %}
Welcome to the Story Theme Tutorial.
{% endmajor %}

This layout features a modular section architecture, allowing you to build rich, long-form pages using simple Markdown headers.

# Documentation

## How it Works

The theme parses your Markdown file and breaks it into **Sections**.

**Rule for Section Boundaries**:
A section starts at a **Header** (e.g., `#` or `##`) that contains a special tag (like `{% raw %}{% asbanner %}{% endraw %}`), or simply the next header if no tag is present.
It continues until:

1.  The next **Header of the same level** (e.g., H2 to H2).
2.  Any **Header that contains another special tag**.

This allows you to group content logically. Standard content (paragraphs, lists, code) inside a section is purely content for that section.

---

## 1. Banner Section

This tutorial page starts with a **Banner** section (the big image above). It is defined by the first `# Theme Tutorial` header and the `{% raw %}{% asbanner %}{% endraw %}` tag.

### Syntax

{% raw %}

```markdown
# My Page Title

{% asbanner images/banner.jpg [options] %}

Introductory text...
```

{% endraw %}

Because the banner is usually an H1, you should start your next section with another H1 (like `# Documentation` above) to close the banner section.

### Options

| Option                             | Description                              |
| :--------------------------------- | :--------------------------------------- |
| `style:N`                          | `style:1` (Split) or `style:2` (Overlay) |
| `orient:left/right`                | content on left or right (Style 1)       |
| `fullscreen`                       | Make banner fill viewport height         |
| `content_align:left/center/right`  | Align text content                       |
| `image_position:left/center/right` | Align background image                   |

---

## 2. Spotlight Section

**Spotlights** are used to feature specific content alongside an image. They are great for "Feature" lists.

### Syntax

{% raw %}

```markdown
## Section Title

{% asspotlight image_path [options] %}

Your content here...
```

{% endraw %}

### Options

| Option              | Description                                |
| :------------------ | :----------------------------------------- |
| `style:N`           | `style:1` (Classic) or `style:2` (Reverse) |
| `orient:left/right` | Image on left or right                     |
| `id:my-id`          | Set a custom ID for linking                |
| `invert`            | Invert colors (dark mode)                  |

### Live Example

## Feature 1

{% asspotlight images/spotlight01.jpg style:1 orient:right %}

This is the first spotlight. Note `orient:right` puts the image on the right.

## Feature 2

{% asspotlight images/spotlight02.jpg style:1 orient:left %}

This is the second spotlight with `orient:left`. The theme handles the alternating layout automatically if you use `style:1`.

---

## 3. Gallery Section

The **Gallery** displays your latest posts that have a cover image. To add images to the gallery, you simply create new posts.

### Syntax

{% raw %}

```markdown
## Gallery Title

{% asgallery [options] %}

Your intro text...
```

{% endraw %}

### creating-posts

To add an item to the gallery, create a new post with a `cover` image in the frontmatter.

```bash
hexo new post "My New Event"
```

Then edit the post file `source/_posts/My-New-Event.md`:

```yaml
---
title: My New Event
date: 2026-01-01 12:00:00
cover: /images/gallery/thumbs/01.jpg
---
This text will be the excerpt shown in the gallery lightbox.
```

### Options

| Option                  | Description                              |
| :---------------------- | :--------------------------------------- |
| `style:N`               | `style:1` (Grid) or `style:2` (Carousel) |
| `size:small/medium/big` | Thumbnail size                           |
| `lightbox`              | Enable lightbox (click to zoom)          |
| `fade:onload/onscroll`  | Animation trigger                        |

### Live Example

## My Gallery

{% asgallery style:2 size:medium lightbox %}

This creates a scrollable carousel of posts with cover images.

---

## 4. Items Section

**Items** grids are perfect for feature lists, services, or team members. They use icons and text.

### Syntax

{% raw %}

```markdown
## Items Title

{% asitems [options] %}

Intro text...

### Item Title

{% item icon:icon-name %}
Item description...
```

{% endraw %}

### Options

| Option             | Description                                 |
| :----------------- | :------------------------------------------ |
| `style:N`          | `1` (Boxed), `2` (Outlined), `3` (Clean)    |
| `icon:name`        | FontAwesome icon name (e.g. `gem`, `heart`) |
| `icon_style:solid` | Use solid icon variant (optional)           |

### Live Example

## Our Features

{% asitems style:1 %}

Here are some cool features.

### Fast

{% item icon:bolt icon_style:solid %}
Lightning fast performance.

### Secure

{% item icon:lock icon_style:solid %}
Enterprise grade security.

### Mobile

{% item icon:mobile-alt icon_style:solid %}
Fully responsive design.

---

## 5. Standard Content

Any section NOT marked with a special tag will be rendered as a **Standard Content** section (centered text container).

## Just Content

This includes standard Markdown formatting:

- Lists
- **Bold** and _Italic_ text
- [Links](https://example.com)
- Code blocks

> Blockquotes allow you to highlight important text.

---

## 6. Global Modifiers

These options work on almost ALL sections to customize appearance.

| Category      | Options                                                  |
| :------------ | :------------------------------------------------------- |
| **Colors**    | `color1` through `color7`, `invert`                      |
| **Animation** | `onload_content:fade-in`, `onscroll_image:fade-up`, etc. |
| **Spacing**   | `fullscreen`, `halfscreen` (Spotlight only)              |

### Example using standard divs

(Standard content sections currently use the default theme style. To apply specific styles to text areas, you can wrap them in HTML `divs` with standard classes if needed.)

---

## 7. Action Buttons

Use the `{% raw %}{% actions %}{% endraw %}` tag to create button groups anywhere.

{% raw %}

```markdown
{% actions %}

- [Primary Button](#)
- [Default Button](#)
  {% endactions %}
```

{% endraw %}

### Options

| Option         | Description                    |
| :------------- | :----------------------------- |
| `stacked`      | Stack buttons vertically       |
| `fit`          | Make buttons fill width        |
| `align:center` | Center buttons (via container) |

### Examples

{% actions %}

- [Primary](#)
- [Default](#)
- [Icon Button](#)
  {% endactions %}

{% actions stacked %}

- [Stacked Primary](#)
- [Stacked Default](#)
  {% endactions %}
