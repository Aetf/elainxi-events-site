'use strict';

const { findSectionContent } = require('./section_utils');

/**
 * Parses a Gallery section.
 * 
 * @param {Object} hexo - Hexo instance
 * @param {Cheerio} $ - Cheerio instance
 * @param {CheerioElement} $header - The section header element
 * @returns {Object|null} Section data or null if invalid
 */
function parseGallery(hexo, $, $header) {
    const { header, content } = findSectionContent($, $header);
    
    if (!header || !header.length) {
        return null;
    }

    const options = JSON.parse($header.attr('data-section-options') || '{}');
    
    // Get Posts
    let posts = [];
    try {
        const postsLocal = hexo.locals.get('posts');
        if (postsLocal) {
            let query = postsLocal.filter(post => post.cover);
            query = query.filter(post => post.hidden !== true);
            const orderBy = (hexo.config.index_generator && hexo.config.index_generator.order_by) || '-date';
            query = query.sort('sticky', -1).sort(orderBy);
            
            posts = query.map(post => ({
                src: hexo.config.root + post.path,
                thumb: post.cover,
                title: post.title,
                content: post.excerpt || ''
            }));
        }
    } catch (e) {
        console.error('[Index Parser] Gallery Error:', e);
    }

    // Defaults
    options.gallery_style = options.style || 'style2';
    options.wrapper_style = options.wrapper_style || 'style1';
    options.size = options.size || 'medium';
    options.lightbox = options.lightbox !== false;

    const introHtml = $.html(header) + '\n' + content.map((i, el) => $.html(el)).get().join('\n');

    return {
        type: 'gallery',
        intro: introHtml,
        items: posts,
        options: options,
        $header: header,
        $content: content
    };
}

module.exports = {
    parseGallery
};
