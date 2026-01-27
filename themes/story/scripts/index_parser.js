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
    data.content = '';
    
}, priority);
