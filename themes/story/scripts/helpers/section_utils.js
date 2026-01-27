'use strict';

/**
 * Finds nearest header from the given element.
 * 
 * @param {Cheerio} $ - The Cheerio loaded instance.
 * @param {CheerioElement} $el - The element to find a header for.
 * @returns {Cheerio} The nearest header or empty Cheerio object.
 */
function findNearestHeader($, $el) {
    // Try siblings first
    let $h = $el.prevAll('h1, h2, h3, h4, h5, h6').first();
    if ($h.length) return $h;
    
    // Try parent's siblings (if wrapped in p or div)
    const $parent = $el.parent();
    if ($parent.length && ($parent.is('p') || $parent.is('div'))) {
        $h = $parent.prevAll('h1, h2, h3, h4, h5, h6').first();
        if ($h.length) return $h;
    }
    return $();
}

/**
 * Finds the content associated with a section header.
 * The section scope extends from the header until:
 * 1. The next header of the same or higher level (standard markdown structure).
 * 2. OR the next header that is explicitly marked as a section start.
 * 
 * @param {Cheerio} $ - The Cheerio loaded instance.
 * @param {CheerioElement} $header - The section header element.
 * @returns {Object} { header: Cheerio, content: Cheerio }
 */
function findSectionContent($, $header) {
    if (!$header || !$header.length) {
        return { header: null, content: null };
    }
    
    const headerTag = $header.prop('tagName').toLowerCase();
    const headerLevel = parseInt(headerTag.substring(1));
    
    // Generate stop selector for same or higher level headers
    const stopSelectors = ['.crs-section-header'];
    for (let i = 1; i <= headerLevel; i++) {
        stopSelectors.push('h' + i);
    }
    const stopSelector = stopSelectors.join(', ');

    // Get content until stop selector
    const $content = $header.nextUntil(stopSelector);
    
    return {
        header: $header,
        content: $content
    };
}

module.exports = {
    findNearestHeader,
    findSectionContent
};
