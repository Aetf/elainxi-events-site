var cheerio = require('cheerio');

var priority = hexo.theme.config.filters && hexo.theme.config.filters.items ? hexo.theme.config.filters.items.priority : 40;

hexo.extend.filter.register('after_post_render', function(data){
  // Only apply to front page or pages using front layout
  if (data.layout !== 'front' && data.path !== 'index.html') {
    return;
  }

  var $ = cheerio.load(data.content, { 
    decodeEntities: false 
  });
  
  var markers = $('.crs-section-marker[data-type="items"]');

  if (markers.length > 0) {
    markers.each(function() {
      // The marker is inside the section content.
      // We need to find the "Parent Header" (start of this section)
      // and the "End of Section" (next same-level header or end of content).
      
      var marker = $(this);
      
      // Look back for the nearest Header (h1, h2, h3...).
      
      var parentHeader = marker.prev('h1, h2, h3, h4, h5, h6');
      if (parentHeader.length === 0) {
          // If not found directly, tries to find previous all siblings and filter
          var allPrev = marker.prevAll('h1, h2, h3, h4, h5, h6');
          if (allPrev.length > 0) {
             parentHeader = allPrev.first(); // .prevAll() returns in reverse order (nearest first)
          } else {
             // Try going up to parent (if marker is wrapped in p)
             var parent = marker.parent();
             if (parent.length > 0) {
                 var parentPrev = parent.prev('h1, h2, h3, h4, h5, h6');
                 if (parentPrev.length > 0) parentHeader = parentPrev;
                 else {
                     var parentAllPrev = parent.prevAll('h1, h2, h3, h4, h5, h6');
                     if (parentAllPrev.length > 0) parentHeader = parentAllPrev.first();
                 }
             }
          }
      }

      if (parentHeader.length === 0) {
        console.log("Items Filter: No parent header found for marker");
        return; 
      }

      var headerTag = parentHeader.prop('tagName').toLowerCase(); // e.g. 'h2'
      console.log("Items Filter: Found parent header <" + headerTag + ">: " + parentHeader.text());

      var itemHeaderTag = 'h' + (parseInt(headerTag.substring(1)) + 1); // e.g. 'h3'

      var contentSiblings = parentHeader.nextUntil(headerTag);
      
      // Now parse items from contentSiblings
      var items = [];
      var currentItem = null;
      var introContent = $(); // Content before the first item header
      
      contentSiblings.each(function() {
          var el = $(this);
          
          if (el.is(itemHeaderTag)) {
              // New Item Started
              if (currentItem) {
                  items.push(currentItem);
              }
              currentItem = {
                  title: el.text(), 
                  id: el.attr('id'),
                  content: $()
              };
          } else {
              // Content
              if (currentItem) {
                  currentItem.content = currentItem.content.add(el);
              } else {
                  introContent = introContent.add(el);
              }
          }
      });
      
      if (currentItem) {
          items.push(currentItem);
      }
      
      // Prepare data for Partial
      var options = JSON.parse(marker.attr('data-options') || '{}');
      var style = options.style === 'one' ? 'style1' : (options.style || 'style1');

      var itemsView = hexo.theme.getView('_partial/sections/items.njk');
      var renderedHtml = itemsView.renderSync({
          // Data
          header: $.html(parentHeader),
          intro: introContent.map(function(i, el) { return $.html(el); }).get().join('\n'),
          items: items.map(function(item) {
              var itemBody = item.content;
              var itemMarker = itemBody.find('.crs-item-marker');
              var icon = '';
              if (itemMarker.length > 0) {
                  icon = itemMarker.attr('data-icon');
                  itemMarker.remove();
              }
              
              // Extract full HTML of content elements
              var contentHtml = itemBody.map(function(i, el) { return $.html(el); }).get().join('\n');
              
              return {
                  title: item.title,
                  content: contentHtml,
                  icon: icon,
                  itemHeaderTag: itemHeaderTag
              };
          }),
          
          // Semantic wrapper options
          id: parentHeader.attr('id') || '',
          style: style,
          size: options.size || 'medium',
          fade: options.fade || options['onscroll-fade-in']
      });
      
      // Replace in DOM
      // Replace parentHeader, and strip the siblings
      parentHeader.replaceWith(renderedHtml);
      contentSiblings.remove();
    });

    data.content = $('body').html();
  }
}, priority);
