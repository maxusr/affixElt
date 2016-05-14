(function($){
	$.fn.affixElt = function(options) {

		var defauts = {
			'top': 20,
			'bottom': 20,
			'zIndex': 999,
			'resize': true,
			'affixOnSmScreen': false,
			'affixOnMdScreen': true,
			'affixOnLgScreen': true,
			'widthSmScreen': 765,
			'widthMdScreen': 968,
			'widthLgScreen': 1186,
			'aboveAffix': null,
			'callback': null
		};

		var params = $.extend(defauts,options);

		return this.each(function(i){
			var docTop = $(this).offset().top - params.top,
				didScroll = false,
				windowWidth = parseInt($('body').css('width')),
				aboveAffixStyle = {
					'position': null,
					'zIndex': null
				},
				aboveAffixStyles = [],
				styles = {
					'position': $(this).css('position'),
					'top': $(this).css('top'),
					'width': $(this).css('width'),
					'bottom': $(this).css('bottom'),
					'height': $(this).css('height'),
					'overflow': $(this).css('overflow'),
					'z-index': $(this).css('z-index')
				};

			function init(elt) {
				initAboveAffix();
				window.addEventListener('scroll', function(event) {
					if( !didScroll ) {
						didScroll = true;
						setTimeout( scrollPage($(elt)), 250 );
					}
				}, false );
			}

			function initAboveAffix() {
				$(params.aboveAffix).each(function(i){
					aboveAffixStyle.zIndex = $(this).css('z-index');
					aboveAffixStyle.position = $(this).css('position');

					aboveAffixStyles.push(aboveAffixStyle);
				});
			}

			function affixable() {
				
				if(windowWidth < params.widthSmScreen){
					return params.affixOnSmScreen;
				}

				if(windowWidth < params.widthMdScreen){
					alert("Medium screen");
					return params.affixOnMdScreen;
				}

				if(windowWidth < params.widthLgScreen){
					return params.affixOnLgScreen;
				}

				return true;
			}

			function scrollPage(elt) {
				var sy = scrollY(),
					width = $(elt).css('width'),
					eltAffix;
				if(affixable()){
					if(sy >= docTop){
						aboveAffix();
						$(elt).addClass('affix-elt');
						eltAffix = $('.affix-elt').get();
						$(elt).css({
							'position': 'fixed',
							'top': params.top,
							'width': width,
							'height': resizeY($(elt)),
							'overflow': 'auto',
							'z-index': params.zIndex
						});
					}else{
						aboveNoAffix();
						$(elt).removeClass('affix-elt').css(styles);
					}
				}
				didScroll = false;
			}

			function aboveAffix() {
				$(params.aboveAffix).each(function(i){
					$(this).css({
						'position': (aboveAffixStyles[i].position == 'static') ? 'relative' :  aboveAffixStyles[i].position,
						'z-index': params.zIndex+1
					});
				});
			}

			function aboveNoAffix() {
				$(params.aboveAffix).each(function(i){
					$(this).css({
						'position': aboveAffixStyles[i].position,
						'z-index': aboveAffixStyles[i].zIndex
					});
				});
			}

			function resizeY(elt) {
				var maxHeight = $(window).height() - params.bottom - params.top,
					eltY = parseInt($(elt).css('height'));

				if(eltY > maxHeight && params.resize)
					return maxHeight;

				return eltY;
			}

			function scrollY(){
				return window.pageYOffset || document.documentElement.scrollTop;
			}

			init($(this));
		});
	}
})(jQuery);