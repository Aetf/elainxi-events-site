/* global hexo */
'use strict';

/**
 * Parse options from tag args
 * Handles both key:value pairs and boolean flags
 * @param {Array} args - Arguments array from tag (positional args should be shifted before calling)
 * @returns {Object} Parsed options object
 */
function parseOptions(args) {
    var options = {};
    args.forEach(function(arg) {
        var parts = arg.split(':');
        if (parts.length === 2) {
            options[parts[0]] = parts[1];
        } else if (parts.length === 1 && parts[0]) {
            // Boolean flag (e.g., fullscreen, invert, stacked)
            options[parts[0]] = true;
        }
    });
    return options;
}

/**
 * Major tag
 * Used for major text in intro
 * Syntax: {% major %} text {% endmajor %}
 */
hexo.extend.tag.register('major', function (args, content) {
    var text = hexo.render.renderSync({ text: content, engine: 'markdown' });
    // Strip the outer paragraph tag which Hexo's markdown engine adds
    text = text.trim().replace(/^<p>/, '').replace(/<\/p>$/, '');
    return '<p class="major">' + text + '</p>';
}, { ends: true });

/**
 * AsBanner tag
 * Transform preceding content into a banner section
 * Syntax: {% asbanner images/banner.jpg [options] %}
 */
hexo.extend.tag.register('asbanner', function (args) {
    var image = args.shift();
    var options = parseOptions(args);

    return '<div class="crs-section-marker" ' + 
           'data-type="banner" ' +
           'data-image="' + image + '" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * AsSpotlight tag
 * Transform preceding content into a spotlight section
 * Syntax: {% asspotlight images/pic01.jpg [options] %}
 */
hexo.extend.tag.register('asspotlight', function (args) {
    var image = args.shift();
    var options = parseOptions(args);

    return '<div class="crs-section-marker" ' + 
           'data-type="spotlight" ' +
           'data-image="' + image + '" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * Actions tag
 * Render a list of actions (buttons)
 * Syntax: {% actions [options] %} ... {% endactions %}
 */
hexo.extend.tag.register('actions', function (args, content) {
    var options = parseOptions(args);

    // Render markdown content (the list)
    var text = hexo.render.renderSync({ text: content, engine: 'markdown' });
    
    // Use cheerio to transform the list
    var cheerio = require('cheerio');
    var $ = cheerio.load(text, { decodeEntities: false });
    
    var ul = $('ul');
    if (ul.length > 0) {
        ul.addClass('actions');
        
        // Add stacked class if specified
        if (options.stacked) {
            ul.addClass('stacked');
        }
        
        // Build button classes based on options
        var btnClasses = ['button'];
        if (options.type === 'primary') btnClasses.push('primary');
        if (options.size === 'small') btnClasses.push('small');
        if (options.size === 'large') btnClasses.push('large');
        if (options.width === 'wide') btnClasses.push('wide');
        if (options.width === 'fit') btnClasses.push('fit');
        if (options.scroll_to) btnClasses.push('smooth-scroll-middle');
        if (options.icon) btnClasses.push('icon ' + options.icon);
        
        // Apply classes to all links
        $('a').addClass(btnClasses.join(' '));
        
        // Return the outer HTML of the ul
        return $.html('ul');
    }
    
    return text;
}, { ends: true });

/**
 * AsItems tag
 * Marks the containing section as an Items section
 * Syntax: {% asitems [options] %}
 */
hexo.extend.tag.register('asitems', function(args) {
    var options = parseOptions(args);
    
    return '<div class="crs-section-marker" ' +
           'data-type="items" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * Item tag
 * Sets metadata for an item
 * Syntax: {% item icon:gem %} or {% item icon:save icon_style:solid %}
 */
hexo.extend.tag.register('item', function(args) {
    var options = parseOptions(args);
    var icon = options.icon || '';
    var iconStyle = options.icon_style || '';
    
    return '<div class="crs-item-marker" data-icon="' + icon + '" data-icon-style="' + iconStyle + '"></div>';
});

/**
 * AsGallery tag
 * Marks the containing section as a Gallery section
 * Syntax: {% asgallery [options] %}
 */
hexo.extend.tag.register('asgallery', function(args) {
    var options = parseOptions(args);
    
    return '<div class="crs-section-marker" ' +
           'data-type="gallery" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * Dummy tags for compatibility
 */
hexo.extend.tag.register('centerquote', function (args, content) {
    return '<blockquote class="centerquote">' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</blockquote>';
}, { ends: true });

hexo.extend.tag.register('note', function (args, content) {
    return '<div class="note ' + args.join(' ') + '">' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</div>';
}, { ends: true });

hexo.extend.tag.register('tabs', function (args, content) {
    return '<div class="tabs">' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</div>';
}, { ends: true });

hexo.extend.tag.register('tab', function (args, content) {
    return '<div class="tab">' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</div>';
}, { ends: true });

hexo.extend.tag.register('label', function (args) {
    return '<span class="label ' + args.join(' ') + '">' + args.join(' ') + '</span>';
});

hexo.extend.tag.register('includecode', function (args) {
    return '<pre><code>' + args.join(' ') + '</code></pre>';
});

