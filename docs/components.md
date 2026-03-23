# Layout Components

The `story` theme utilizes a specialized tag system. The site content is broken into **Sections**, primarily mapped from standard Markdown headers (`#`, `##`) mixed with block tags. 

## Supported Block Components

### Banner (`{% asbanner %}`)
- **Purpose:** Full width introductory/hero component. Highly customizable background modifiers (`fullscreen`, orientations, alignment).
- **Usage:** Typically placed at the very top of a given layout page under an H1 tag.

### Spotlight (`{% asspotlight %}`)
- **Purpose:** Used to highlight a particular subject with a distinct image + text side-by-side format.
- **Modifiers:** Supports reversing orientations (`orient:left` vs `right`) and chaining multiple instance tags to alternating directions automatically.

### Gallery (`{% asgallery %}`)
- **Purpose:** For rendering Hexo posts visually on the front page.
- **Workflow:** Adding posts with a `cover` frontmatter property automatically populates this component with visually striking thumbnails. Supports `lightbox` to create popups without leaving the primary single-page scroll sequence.

### Items / Grid (`{% asitems %}`)
- **Purpose:** An organized grid of icon + feature text pairs.
- **Workflow:** Defined by iterating inner `{% item icon:iconname %}` sub-tags. Useful for "Why Choose Us" or "Service Pricing" matrices.

### Action Buttons (`{% actions %}`)
- **Purpose:** Unopinionated wrapper for Markdown links to create standardized buttons (Primary vs Default, stacked alignments).

## Core Interaction Concept
A section starts at a header that defines a component tag (or just standard markdown). The block is terminated at the *next* equivalent level header, creating an isolated semantic section. Standard Markdown content falling outside tags falls back to a clean text-container layout seamlessly.
