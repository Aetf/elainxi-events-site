'use strict';

const { findSectionContent, cleanSectionHeader } = require('./section_utils');

/**
 * Parses an Items section.
 * 
 * @param {Cheerio} $ - Cheerio instance
 * @param {CheerioElement} $header - The section header element
 * @returns {Object|null} Section data or null if invalid
 */
function parseItems($, $header) {
    const { header, content } = findSectionContent($, $header);
    
    if (!header || !header.length) {
        return null;
    }
    
    const $parentHeader = header;
    const $sectionContent = content;
    
    const options = JSON.parse($header.attr('data-section-options') || '{}');

    const headerTag = $parentHeader.prop('tagName').toLowerCase();
    const headerLevel = parseInt(headerTag.substring(1));
    const itemHeaderTag = 'h' + (headerLevel + 1);
    
    // Parse items from $sectionContent
    const items = [];
    let currentItem = null;
    const introElements = [];
    
    $sectionContent.each(function() {
        const el = $(this);
        
        if (el.is(itemHeaderTag)) {
            if (currentItem) items.push(currentItem);
            currentItem = {
                title: el.text(),
                id: el.attr('id'),
                contentEls: []
            };
        } else {
            if (currentItem) {
                currentItem.contentEls.push(el);
            } else {
                introElements.push(el);
            }
        }
    });
    if (currentItem) items.push(currentItem);
    
    // Process items
    const processedItems = items.map(item => {
        const $wrapper = $('<div></div>');
        item.contentEls.forEach(el => $wrapper.append(el.clone()));
        
        const $itemMarker = $wrapper.find('.crs-item-marker');
        let icon = '';
        if ($itemMarker.length > 0) {
            icon = $itemMarker.attr('data-icon');
            $itemMarker.remove();
        }
        
        return {
            title: item.title,
            content: $wrapper.html(),
            icon: icon,
            itemHeaderTag: itemHeaderTag
        };
    });
    
    const $introWrapper = $('<div></div>');
    introElements.forEach(el => $introWrapper.append(el.clone()));
    const introHtml = $introWrapper.html();

    // Clean header before capturing HTML
    cleanSectionHeader($parentHeader);
    
    return {
        type: 'items',
        header: $.html($parentHeader),
        intro: introHtml,
        items: processedItems,
        options: options,
        $header: header,
        $content: content
    };
}

module.exports = {
    parseItems
};
