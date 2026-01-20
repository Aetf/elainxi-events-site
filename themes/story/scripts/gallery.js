/* global hexo */
'use strict';

const cheerio = require('cheerio');

const SECTION_MARKER_CLASS = 'crs-section-marker';

/**
 * Filter to process 'asgallery' sections.
 * Transforms content between a header and the marker into a gallery section.
 */
hexo.extend.filter.register('after_post_render', function(data) {
    if (!data.content || !data.content.includes(SECTION_MARKER_CLASS)) {
        return data;
    }

    const $ = cheerio.load(data.content, { decodeEntities: false });
    const markers = $(`.${SECTION_MARKER_CLASS}[data-type="gallery"]`);
    
    if (markers.length === 0) {
        return data;
    }

    // Prepare posts data
    let posts = [];
    try {
        const postsQuery = hexo.locals.get('posts');
        if (postsQuery) {
            posts = postsQuery.filter(post => post.cover)
                .sort('date', -1)
                .map(post => ({
                    src: hexo.config.root + post.path,
                    thumb: post.cover,
                    title: post.title,
                    content: post.excerpt || ''
                }));
        }
    } catch (e) {
        console.error('[Gallery Filter] Error retrieving posts:', e);
    }

    markers.each(function() {
        const $marker = $(this);
        const options = JSON.parse($marker.attr('data-options') || '{}');

        // Defaults
        // 'style' option primarily targets the gallery items look (e.g. style2)
        // 'wrapper_style' targets the section container (default style1 for full width/no padding)
        options.gallery_style = options.style || 'style2'; 
        options.wrapper_style = options.wrapper_style || 'style1';
        
        options.size = options.size || 'medium';
        options.align_center = true; 
        options.lightbox = options.lightbox !== false;

        // Find preceding header (Boundary)
        const $boundary = $marker.prevAll('h1, h2, h3, h4, h5, h6').first();
        
        if ($boundary.length === 0) {
            console.warn(`[Gallery Filter] No header found preceding the marker in ${data.source}`);
            return;
        }

        const headerContent = $boundary.html();
        
        // Collect content between Boundary and Marker
        // nextUntil collects siblings between boundary and marker
        const $content = $boundary.nextUntil($marker);
        
        const introContent = $content.map((i, el) => $.html(el)).get().join('\n');

        try {
            const content = hexo.theme.getView('_partial/sections/gallery.njk').renderSync({
                header: headerContent,
                intro: introContent,
                items: posts || [],
                options: options
            });

            // Replace the block [Boundary ... Content ... Marker] with rendered gallery
            // We insert output after marker, then remove the pieces.
            // Or simpler: replace Marker with content, remove Boundary and Intermediate Content.
            
            $marker.replaceWith(content);
            $boundary.remove();
            $content.remove();

        } catch (err) {
            console.error('[Gallery Filter] Render failed:', err);
        }
    });

    data.content = $.html();
    return data;
}, hexo.theme.config.filter_priorities && hexo.theme.config.filter_priorities.gallery ? hexo.theme.config.filter_priorities.gallery : 50);
