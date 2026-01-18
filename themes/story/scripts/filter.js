var cheerio = require('cheerio');

hexo.extend.filter.register('after_post_render', function(data){
  // Only apply to front page or pages using front layout
  if (data.layout !== 'front' && data.path !== 'index.html') {
    return;
  }

  var $ = cheerio.load(data.content, { 
    decodeEntities: false 
  });
  
  var markers = $('.crs-section-marker[data-type="banner"]');

  if (markers.length > 0) {
    markers.each(function() {
      var marker = $(this);
      var boundaryTag = marker.attr('data-boundary');
      var image = marker.attr('data-image');
      var options = JSON.parse(marker.attr('data-options') || '{}');
      
      // Find boundary element and collect content between marker and boundary
      // 1. prevUntil(tag): all siblings between marker and tag.
      // 2. prev(tag): filters the 'prev' of the set for the tag. (Only the one right after tag will match).
      // 3. addBack(): adds the [content + marker] back to the [tag].
      var selection = marker.prevUntil(boundaryTag).prev(boundaryTag).addBack();
      
      // Check if we actually found the boundary (the selection must contain boundaryTag)
      // Since 'selection' is a Cheerio object, we can filter it.
      var boundaryEl = selection.filter(boundaryTag);
      
      // If found, selection is [boundary, ...content]. 
      // If not found, selection is [...content].
      // We only proceed if boundary is present.
      if (boundaryEl.length > 0) {
        // To be directly included in the partial, including the boundary tag
        var contentHtml = selection.map(function(i, el) { return $.html(el); }).get().join('\n');
        
        // Render Partial
        var view = hexo.theme.getView('_partial/sections/banner.njk');
        var actions = hexo.theme.config.sections && hexo.theme.config.sections.banner ? hexo.theme.config.sections.banner.actions : [];
        
        // Render
        var renderedHtml = view.renderSync({
            content: contentHtml,
            image: image,
            actions: actions,
            options: options
        });
        
        // Replace in DOM
        // Insert new HTML after the marker
        marker.after(renderedHtml);
        // Remove all original elements (boundary + content)
        selection.remove();
        // Remove the marker itself
        marker.remove();
      }
    });

    // Cheerio.load() wraps content in html/body. We need to extract the processed content back.
    // .html() on the body element gets the inner HTML, which corresponds to the original fragment structure.
    data.content = $('body').html();
  }
});
