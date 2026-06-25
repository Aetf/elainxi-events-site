/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Browser fixes.

		// IE: Flexbox min-height bug.
			if (browser.name == 'ie')
				(function() {

					var flexboxFixTimeoutId;

					$window.on('resize.flexbox-fix', function() {

						var $x = $('.fullscreen');

						clearTimeout(flexboxFixTimeoutId);

						flexboxFixTimeoutId = setTimeout(function() {

							if ($x.prop('scrollHeight') > $window.height())
								$x.css('height', 'auto');
							else
								$x.css('height', '100vh');

						}, 250);

					}).triggerHandler('resize.flexbox-fix');

				})();

		// Object fit workaround.
			if (!browser.canUse('object-fit'))
				(function() {

					$('.banner .image, .spotlight .image').each(function() {

						var $this = $(this),
							$img = $this.children('img'),
							positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

						// Set image.
							$this
								.css('background-image', 'url("' + $img.attr('src') + '")')
								.css('background-repeat', 'no-repeat')
								.css('background-size', 'cover');

						// Set position.
							switch (positionClass.length > 1 ? positionClass[1] : '') {

								case 'left':
									$this.css('background-position', 'left');
									break;

								case 'right':
									$this.css('background-position', 'right');
									break;

								default:
								case 'center':
									$this.css('background-position', 'center');
									break;

							}

						// Hide original.
							$img.css('opacity', '0');

					});

				})();

	// Smooth scroll.
		$('.smooth-scroll').scrolly();
		$('.smooth-scroll-middle').scrolly({ anchor: 'middle' });

	// Wrapper.
		$wrapper.children()
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});
// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
				if (!$nav.hasClass('locked')) {
					var navOffsetTop = $nav.offset().top;

					$window.on('scroll', function() {
						if ($window.scrollTop() > navOffsetTop) {
							$nav.addClass('alt fixed');
						} else {
							$nav.removeClass('alt fixed');
						}
					}).trigger('scroll');
				}
			// Links.
				var $nav_a = $nav.find('a');

				function getAnchorTarget(href) {
					if (!href) return null;
					if (href.charAt(0) == '#') return href;
					if (href.indexOf('/#') === 0) return href.substring(1);
					return null;
				}

				$nav_a
					.each(function() {

						var	$this = $(this),
							href = $this.attr('href'),
							anchor = getAnchorTarget(href);

						// No anchor target? Bail.
							if (!anchor)
								return;

						var $section = $(anchor);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('is-inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('is-inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					})
					.on('click', function(event) {

						var $this = $(this),
							href = $this.attr('href'),
							anchor = getAnchorTarget(href);

						// No anchor target? (e.g. external link or just '/'). Let browser handle.
							if (!anchor)
								return;

						// Check if we are on the homepage
						var isHomepage = (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/'));

						if (isHomepage) {
							event.preventDefault();

							var $target = $(anchor);

							if ($target.length > 0) {
								// Deactivate all links.
									$nav_a
										.removeClass('active')
										.removeClass('active-locked');

								// Activate link *and* lock it.
									$this
										.addClass('active')
										.addClass('active-locked');

								// Smooth scroll.
									$('html, body').animate({
										scrollTop: $target.offset().top - $nav.height()
									}, 1000);

								// Update hash in address bar without reload
									if (history.pushState) {
										history.pushState(null, null, anchor);
									}
							}
						}
					});

		}

	// Items.
		$('.items')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
				.wrapInner('<div class="inner"></div>');

	// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner"></div>')
			.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
				//.css('overflow', 'hidden')
				.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
				.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
				.scrollLeft(0);

		// Style #1.
			// ...

		// Style #2.
			$('.gallery')
				.on('wheel', '.inner', function(event) {

					var	$this = $(this),
						delta = (event.originalEvent.deltaX * 10);

					// Cap delta.
						if (delta > 0)
							delta = Math.min(25, delta);
						else if (delta < 0)
							delta = Math.max(-25, delta);

					// Scroll.
						$this.scrollLeft( $this.scrollLeft() + delta );

				})
				.on('mouseenter', '.forward, .backward', function(event) {

					var $this = $(this),
						$inner = $this.siblings('.inner'),
						direction = ($this.hasClass('forward') ? 1 : -1);

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

					// Start interval.
						this._gallery_moveIntervalId = setInterval(function() {
							$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
						}, 10);

				})
				.on('mouseleave', '.forward, .backward', function(event) {

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

				});

		// Lightbox.
			$('.gallery.lightbox')
				.on('click', 'a', function(event) {

					var $a = $(this),
						$gallery = $a.parents('.gallery'),
						$modal = $gallery.children('.modal'),
						$modalImg = $modal.find('img'),
						href = $a.attr('href');

					// Not an image? Bail.
						if (!href.match(/\.(jpg|gif|png|mp4)$/))
							return;

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Lock.
						$modal[0]._locked = true;

					// Set src.
						$modalImg.attr('src', href);

					// Set visible.
						$modal.addClass('visible');

					// Focus.
						$modal.focus();

					// Delay.
						setTimeout(function() {

							// Unlock.
								$modal[0]._locked = false;

						}, 600);

				})
				.on('click', '.modal', function(event) {

					var $modal = $(this),
						$modalImg = $modal.find('img');

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Already hidden? Bail.
						if (!$modal.hasClass('visible'))
							return;

					// Lock.
						$modal[0]._locked = true;

					// Clear visible, loaded.
						$modal
							.removeClass('loaded')

					// Delay.
						setTimeout(function() {

							$modal
								.removeClass('visible')

							setTimeout(function() {

								// Clear src.
									$modalImg.attr('src', '');

								// Unlock.
									$modal[0]._locked = false;

								// Focus.
									$body.focus();

							}, 475);

						}, 125);

				})
				.on('keypress', '.modal', function(event) {

					var $modal = $(this);

					// Escape? Hide modal.
						if (event.keyCode == 27)
							$modal.trigger('click');

				})
				.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
					.find('img')
						.on('load', function(event) {

							var $modalImg = $(this),
								$modal = $modalImg.parents('.modal');

							setTimeout(function() {

								// No longer visible? Bail.
									if (!$modal.hasClass('visible'))
										return;

								// Set loaded.
									$modal.addClass('loaded');

							}, 275);

						});

		// WeChat Link Copy-to-Clipboard.
			$('.wechat-link').on('click', function(event) {
				event.preventDefault();
				var $this = $(this);
				var wechatId = $this.data('wechat');
				
				if (wechatId) {
					if (navigator.clipboard && navigator.clipboard.writeText) {
						navigator.clipboard.writeText(wechatId).then(function() {
							showWechatToast(wechatId);
						}, function() {
							fallbackCopy(wechatId);
						});
					} else {
						fallbackCopy(wechatId);
					}
				}
			});

		// Email Link Copy-to-Clipboard.
			$('.email-link').on('click', function(event) {
				event.preventDefault();
				var $this = $(this);
				var email = $this.data('email');
				
				if (email) {
					if (navigator.clipboard && navigator.clipboard.writeText) {
						navigator.clipboard.writeText(email).then(function() {
							showEmailToast(email);
						}, function() {
							fallbackCopyEmail(email);
						});
					} else {
						fallbackCopyEmail(email);
					}
				}
			});

			function fallbackCopyEmail(text) {
				var $temp = $('<input>');
				$('body').append($temp);
				$temp.val(text).select();
				try {
					document.execCommand('copy');
					showEmailToast(text);
				} catch (err) {
					alert('邮箱: ' + text);
				}
				$temp.remove();
			}

			function showEmailToast(text) {
				var $toast = $('<div class="email-toast">邮箱已复制: <strong>' + text + '</strong></div>');
				$toast.css({
					'position': 'fixed',
					'bottom': '2rem',
					'left': '50%',
					'transform': 'translateX(-50%) translateY(1rem)',
					'background': 'rgba(40, 40, 40, 0.95)',
					'color': '#fff',
					'padding': '0.75rem 1.5rem',
					'border-radius': '2rem',
					'box-shadow': '0 10px 30px rgba(0,0,0,0.25)',
					'z-index': 100000,
					'opacity': 0,
					'transition': 'all 0.3s ease',
					'font-size': '0.9rem',
					'pointer-events': 'none',
					'letter-spacing': '0.5px'
				});
				$('body').append($toast);
				
				// Force reflow
				$toast.get(0).offsetHeight;
				
				$toast.css({
					'opacity': 1,
					'transform': 'translateX(-50%) translateY(0)'
				});
				
				setTimeout(function() {
					$toast.css({
						'opacity': 0,
						'transform': 'translateX(-50%) translateY(-1rem)'
					});
					setTimeout(function() {
						$toast.remove();
					}, 300);
				}, 2500);
			}

			function fallbackCopy(text) {
				var $temp = $('<input>');
				$('body').append($temp);
				$temp.val(text).select();
				try {
					document.execCommand('copy');
					showWechatToast(text);
				} catch (err) {
					alert('微信 ID: ' + text);
				}
				$temp.remove();
			}

			function showWechatToast(text) {
				var $toast = $('<div class="wechat-toast">微信 ID 已复制: <strong>' + text + '</strong></div>');
				$toast.css({
					'position': 'fixed',
					'bottom': '2rem',
					'left': '50%',
					'transform': 'translateX(-50%) translateY(1rem)',
					'background': 'rgba(40, 40, 40, 0.95)',
					'color': '#fff',
					'padding': '0.75rem 1.5rem',
					'border-radius': '2rem',
					'box-shadow': '0 10px 30px rgba(0,0,0,0.25)',
					'z-index': 100000,
					'opacity': 0,
					'transition': 'all 0.3s ease',
					'font-size': '0.9rem',
					'pointer-events': 'none',
					'letter-spacing': '0.5px'
				});
				$('body').append($toast);
				
				// Force reflow
				$toast.get(0).offsetHeight;
				
				$toast.css({
					'opacity': 1,
					'transform': 'translateX(-50%) translateY(0)'
				});
				
				setTimeout(function() {
					$toast.css({
						'opacity': 0,
						'transform': 'translateX(-50%) translateY(-1rem)'
					});
					setTimeout(function() {
						$toast.remove();
					}, 300);
				}, 2500);
			}

})(jQuery);
