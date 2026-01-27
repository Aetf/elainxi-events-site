'use strict';

const { findSectionContent } = require('./section_utils');

/**
 * Parses a Spotlight section.
 * 
 * @param {Cheerio} $ - Cheerio instance
 * @param {CheerioElement} $header - The section header element
 * @returns {Object|null} Section data or null if invalid
 */
function parseSpotlight($, $header) {
    const { header, content } = findSectionContent($, $header);
    
    if (!header || !header.length) {
        return null;
    }

    const image = $header.attr('data-section-image');
    const options = JSON.parse($header.attr('data-section-options') || '{}');
    const contentHtml = $.html(header) + '\n' + content.map((i, el) => $.html(el)).get().join('\n');

    return {
        type: 'spotlight',
        content: contentHtml,
        image: image,
        id: options.id,
        position: options.position,
        $header: header,
        $content: content
    };
}

module.exports = {
    parseSpotlight
};
