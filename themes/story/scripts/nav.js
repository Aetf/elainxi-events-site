var cheerio = require('cheerio');

var priority = hexo.theme.config.filters && hexo.theme.config.filters.nav ? hexo.theme.config.filters.nav.priority : 20;

hexo.extend.filter.register('after_post_render', function(data){
  // Only apply to front page or pages using front layout
  if (data.layout !== 'front' && data.path !== 'index.html') {
    return;
  }

  var $ = cheerio.load(data.content, { 
    decodeEntities: false 
  });

  // Inject Navigation
  var navView = hexo.theme.getView('_partial/nav.njk');
  var navHtml = navView.renderSync({
      theme: hexo.theme.config
  });
  
  var banner = $('section.banner');
  if (banner.length > 0) {
      banner.after(navHtml);
  } else {
      // Fallback: If no banner found, prepend to main wrapper content
      // This ensures nav is present even without a banner
      $('#wrapper').prepend(navHtml);
  }

  data.content = $('body').html();
}, priority);
