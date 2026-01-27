'use strict';

const cheerio = require('cheerio');
const { findNearestHeader, findSectionContent } = require('./helpers/section_utils');
const { parseBanner } = require('./helpers/parse_banner');
const { parseSpotlight } = require('./helpers/parse_spotlight');
const { parseGallery } = require('./helpers/parse_gallery');
const { parseItems } = require('./helpers/parse_items');

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
    
    // Phase 2: Iterate over section headers and parse
    $('.crs-section-header').each(function() {
        const $header = $(this);
        const type = $header.attr('data-section-type');
        
        let sectionData = null;

        if (type === 'banner') {
            sectionData = parseBanner($, $header);
        } else if (type === 'spotlight') {
            sectionData = parseSpotlight($, $header);
        } else if (type === 'gallery') {
            sectionData = parseGallery(hexo, $, $header);
        } else if (type === 'items') {
            sectionData = parseItems($, $header);
        }
        
        if (sectionData) {
            // Get cleanup references before deleting from sectionData
            const $headerToRemove = sectionData.$header;
            const $contentToRemove = sectionData.$content;
            
            delete sectionData.$header;
            delete sectionData.$content;
            
            sections.push(sectionData);
            
            // Remove processed elements from DOM
            if ($headerToRemove) $headerToRemove.remove();
            if ($contentToRemove) $contentToRemove.remove();
        }
    });
    
    // Phase 3: Cleanup any remaining section header markers
    // This ensures no crs-section-header class or data-section-* attrs leak into output
    $('.crs-section-header').each(function() {
        cleanSectionHeader($(this));
    });

    data.sections = sections;
    // Use $('body').html() to avoid extra <html><head><body> wrapper tags
    data.content = $('body').html();
    
}, priority);
