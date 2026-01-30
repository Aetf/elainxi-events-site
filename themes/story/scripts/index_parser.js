'use strict';

const cheerio = require('cheerio');
const { findNearestHeader, findSectionContent, cleanSectionHeader } = require('./helpers/section_utils');
const { parseBanner } = require('./helpers/parse_banner');
const { parseSpotlight } = require('./helpers/parse_spotlight');
const { parseGallery } = require('./helpers/parse_gallery');
const { parseItems } = require('./helpers/parse_items');
const { parseContent } = require('./helpers/parse_content');

var priority = hexo.theme.config.filters && hexo.theme.config.filters.after_post_render ? hexo.theme.config.filters.after_post_render.priority : 10;

hexo.extend.filter.register('after_post_render', function(data) {
    if (data.layout !== 'index' && data.layout !== 'front') {
        return;
    }

    const $ = cheerio.load(data.content, { decodeEntities: false });
    const sections = [];
    
    // Phase 1: Transfer marker data to parent headers, then delete markers
    $('.crs-section-marker').each(function() {
        const $marker = $(this);
        const $header = findNearestHeader($, $marker);
        
        if ($header.length) {
            // Transfer data attributes from marker to header
            $header.addClass('crs-section-header');
            $header.attr('data-section-type', $marker.attr('data-type'));
            if ($marker.attr('data-image')) {
                $header.attr('data-section-image', $marker.attr('data-image'));
            }
            if ($marker.attr('data-options')) {
                $header.attr('data-section-options', $marker.attr('data-options'));
            }
        }
        
        // Remove marker after transfer
        $marker.remove();
    });
    
    // Phase 2: Build a set of elements that belong to special sections
    const specialSectionElements = new Set();
    
    $('.crs-section-header').each(function() {
        const $header = $(this);
        const { header, content } = findSectionContent($, $header);
        
        // Mark header element
        specialSectionElements.add($header[0]);
        
        // Mark all content elements
        content.each(function() {
            specialSectionElements.add(this);
        });
    });
    
    // Phase 3: Walk DOM children in document order
    const $body = $('body');
    const $children = $body.children();
    let contentBuffer = [];
    
    $children.each(function() {
        const el = this;
        const $el = $(el);
        
        if (specialSectionElements.has(el)) {
            // This element is part of a special section
            if ($el.hasClass('crs-section-header')) {
                // Flush any buffered content first
                if (contentBuffer.length > 0) {
                    sections.push(parseContent($, contentBuffer));
                    contentBuffer = [];
                }
                
                // Parse the special section
                const type = $el.attr('data-section-type');
                let sectionData = null;
                
                if (type === 'banner') {
                    sectionData = parseBanner($, $el);
                } else if (type === 'spotlight') {
                    sectionData = parseSpotlight($, $el);
                } else if (type === 'gallery') {
                    sectionData = parseGallery(hexo, $, $el);
                } else if (type === 'items') {
                    sectionData = parseItems($, $el);
                }
                
                if (sectionData) {
                    delete sectionData.$header;
                    delete sectionData.$content;
                    sections.push(sectionData);
                }
            }
            // If it's a content element of a special section (not the header), skip it
            // (it's already included in the special section's content)
        } else {
            // Normal content - buffer it
            contentBuffer.push($el);
        }
    });
    
    // Flush any remaining buffered content
    if (contentBuffer.length > 0) {
        sections.push(parseContent($, contentBuffer));
    }

    data.sections = sections;
    data.targets = {};

    // Logic to dynamically link the Banner's "Get Started" button to the next section
    // This avoids overwriting the next section's ID with "first", and instead points the button to the correct ID.
    let bannerIndex = -1;

    // Find banner and the next content section
    for (let i = 0; i < data.sections.length; i++) {
        if (data.sections[i].type === 'banner') {
            bannerIndex = i;
            break;
        }
    }
    if (bannerIndex !== -1 && bannerIndex + 1 < data.sections.length) {
        let nextSection = data.sections[bannerIndex + 1];
        if (!nextSection.id) {
            nextSection.id = 'start';
        }
        data.targets['next'] = `#${nextSection.id}`;
    }

    data.content = '';
    
}, priority);
