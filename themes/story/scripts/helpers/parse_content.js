'use strict';

const { findSectionContent } = require('./section_utils');

/**
 * Parses a Content section (normal markdown content not in a special section).
 * 
 * @param {Cheerio} $ - Cheerio instance
 * @param {Array} elements - Array of Cheerio elements
 * @returns {Object} Section data
 */
function parseContent($, elements) {
    const contentHtml = elements.map(el => $.html(el)).join('\n');
    
    return {
        type: 'content',
        content: contentHtml
    };
}

module.exports = {
    parseContent
};
