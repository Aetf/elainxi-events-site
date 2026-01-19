var cheerio = require('cheerio');

var priority = hexo.theme.config.filters && hexo.theme.config.filters.spotlight ? hexo.theme.config.filters.spotlight.priority : 30;

hexo.extend.filter.register('after_post_render', function(data){
  // Only apply to front page or pages using front layout
  if (data.layout !== 'front' && data.path !== 'index.html') {
    return;
  }

  var $ = cheerio.load(data.content, { 
    decodeEntities: false 
  });
  
  var markers = $('.crs-section-marker[data-type="spotlight"]');

  if (markers.length > 0) {
    markers.each(function() {
      var marker = $(this);
      var boundaryTag = marker.attr('data-boundary');
      var image = marker.attr('data-image');
      var options = JSON.parse(marker.attr('data-options') || '{}');
      
      // Find boundary element and collect content between marker and boundary
      var selection = marker.prevUntil(boundaryTag).prev(boundaryTag).addBack();
      var boundaryEl = selection.filter(boundaryTag);
      
      if (boundaryEl.length > 0) {
        // Collect HTML content
        var contentHtml = selection.map(function(i, el) { return $.html(el); }).get().join('\n');
        
        // Render Partial
        var view = hexo.theme.getView('_partial/sections/spotlight.njk');
        
        // Render
        var renderedHtml = view.renderSync({
            content: contentHtml,
            image: image,
            id: options.id,
            position: options.position
        });
        
        // Replace in DOM
        marker.after(renderedHtml);
        selection.remove();
        marker.remove();
      }
    });

    data.content = $('body').html();
  }
}, priority);
