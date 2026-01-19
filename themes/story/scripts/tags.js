/* global hexo */
'use strict';

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
 * Syntax: {% asbanner h1 images/banner.jpg [options] %}
 */
hexo.extend.tag.register('asbanner', function (args) {
    var boundary = args[0]; // e.g., 'h1'
    var image = args[1];    // e.g., 'images/banner.jpg'
    
    // Parse options: key:value|key:value
    var options = {};
    for (var i = 2; i < args.length; i++) {
        var parts = args[i].split(':');
        if (parts.length === 2) {
            options[parts[0]] = parts[1];
        }
    }

    // Output hidden marker with data
    return '<div class="crs-section-marker" ' + 
           'data-type="banner" ' +
           'data-boundary="' + boundary + '" ' +
           'data-image="' + image + '" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * AsSpotlight tag
 * Transform preceding content into a spotlight section
 * Syntax: {% asspotlight h2 images/pic01.jpg [options] %}
 */
hexo.extend.tag.register('asspotlight', function (args) {
    var boundary = args[0]; // e.g., 'h2'
    var image = args[1];    // e.g., 'images/pic01.jpg'
    
    // Parse options: key:value|key:value
    var options = {};
    for (var i = 2; i < args.length; i++) {
        var parts = args[i].split(':');
        if (parts.length === 2) {
            options[parts[0]] = parts[1];
        }
    }

    // Output hidden marker with data
    return '<div class="crs-section-marker" ' + 
           'data-type="spotlight" ' +
           'data-boundary="' + boundary + '" ' +
           'data-image="' + image + '" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * Actions tag
 * Render a list of actions (buttons)
 * Syntax: {% actions [options] %} ... {% endactions %}
 */
hexo.extend.tag.register('actions', function (args, content) {
    var options = {};
    args.forEach(function (arg) {
        var parts = arg.split(':');
        if (parts.length === 2) {
            options[parts[0]] = parts[1];
        }
    });

    // Render markdown content (the list)
    var text = hexo.render.renderSync({ text: content, engine: 'markdown' });
    
    // Use cheerio to transform the list
    var cheerio = require('cheerio');
    var $ = cheerio.load(text, { decodeEntities: false });
    
    var ul = $('ul');
    if (ul.length > 0) {
        ul.addClass('actions');
        // Default to stacked if not specified? Or usage should specify.
        // Let's add 'stacked' by default if no width/layout is specified for consistency with previous usage, 
        // OR rely on user to pass `type:stacked` or similar. 
        // Current usage in banner: <ul class="actions stacked">.
        // Let's look at options.
        
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
    var options = {};
    args.forEach(function(arg) {
        var parts = arg.split(':');
        if (parts.length === 2) {
            options[parts[0]] = parts[1];
        } else {
             // Handle boolean flags like onscroll-fade-in
             options[arg] = true;
        }
    });
    
    return '<div class="crs-section-marker" ' +
           'data-type="items" ' +
           "data-options='" + JSON.stringify(options) + "'></div>";
});

/**
 * Item tag
 * Sets metadata for an item
 * Syntax: {% item icon:gem %}
 */
hexo.extend.tag.register('item', function(args) {
    var icon = '';
    args.forEach(function(arg) {
        if (arg.startsWith('icon:')) {
            icon = arg.substring(5);
        }
    });
    
    return '<div class="crs-item-marker" data-icon="' + icon + '"></div>';
});


/**
 * Gallery Tag
 * Usage: {% gallery class:style2|medium lightbox:true %} ... {% endgallery %}
 */
hexo.extend.tag.register('gallery', function (args, content) {
    var className = '';
    var lightbox = false;

    args.forEach(function (arg) {
        if (arg.startsWith('class:')) {
            className += ' ' + arg.substring(6).replace(/\|/g, ' ');
        } else if (arg === 'lightbox:true') {
            lightbox = true;
        }
    });

    // Content is already HTML from gallery_item tags, do not re-render as markdown
    var view = hexo.theme.getView('_partial/sections/gallery.njk');

    return view.renderSync({
        content: content,
        class: className,
        lightbox: lightbox
    });
}, { ends: true });

hexo.extend.tag.register('gallery_item', function (args, content) {
    // {% gallery_item src:full.jpg thumb:thumb.jpg title:"My Title" %} Caption {% endgallery_item %}
    var src = '';
    var thumb = '';
    var title = '';

    args.forEach(function (arg) {
        if (arg.startsWith('src:')) src = arg.substring(4);
        if (arg.startsWith('thumb:')) thumb = arg.substring(6);
        if (arg.startsWith('title:')) title = arg.substring(6).replace(/_/g, ' '); // simple hack for spaces
    });

    // If thumb is missing, use src
    if (!thumb) thumb = src;
    if (title.startsWith('"') && title.endsWith('"')) title = title.substring(1, title.length - 1);

    var text = hexo.render.renderSync({ text: content, engine: 'markdown' });
    var view = hexo.theme.getView('_partial/sections/gallery_item.njk');

    return view.renderSync({
        content: text,
        src: src,
        thumb: thumb,
        title: title
    });
}, { ends: true });


/**
 * Wrapper/Items Tag
 * Usage: {% wrapper class:style1|align-center %} ... {% endwrapper %}
 */
hexo.extend.tag.register('wrapper', function (args, content) {
    var className = 'wrapper';
    var id = '';
    
    args.forEach(function (arg) {
        if (arg.startsWith('class:')) {
            className += ' ' + arg.substring(6).replace(/\|/g, ' ');
        } else if (arg.startsWith('id:')) {
            id = arg.substring(3);
        }
    });
    
    var text = hexo.render.renderSync({ text: content, engine: 'markdown' });
    var view = hexo.theme.getView('_partial/sections/wrapper.njk');

    return view.renderSync({
        content: text,
        class: className,
        id: id
    });
}, { ends: true });




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
