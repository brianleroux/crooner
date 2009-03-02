$(function(){
	
	/**
	 * mostly good enough presentation software
	 * 
	 */
	var Crooner = function() {

		/**
		 * highlights pre tags with a name="code" clas="ruby|javascript|xml|css"
		 * 
		 */		
		var syntaxHighlight = function() {
			dp.SyntaxHighlighter.ClipboardSwf = '/flash/clipboard.swf';
			dp.SyntaxHighlighter.HighlightAll('code');
		};
		
		
		/**
		 * hide all the editing controls unless the presentor is mousing over that slide in the nav
		 * 
		 */
		var toggleSlideControls = function() {
			$('div#nav ul li a.control').hide();
			$('div#nav ul li').hover(
				function(){ $(this).children('.control').show(); },
				function(){ $(this).children('.control').hide(); }
			);
		};
		
		
		/**
		 * slides can be sorted via drag and drop
		 * 
		 */
		var sortable = function() {
			$('div#nav ul').sortable({
				containment:'parent',
				stop:function(){
					var sort = [];
					$(this).children().each(function(index, element){
						sort.push(element.attributes.id.value.replace('slide_control_', ''));
					});
					// updates the sort in the db and on the page
					$.post('/', {_method:'put', ids:sort.join(',')}, function(){
						window.location.reload(false);
					});
				}
			});
		};
		
		
		/**
		 * current slide is highlighted
		 * 
		 */
		var highlightDefaultSlide = function() {
			var url = location.hash.replace('#slide_', '#slide_control_');
			$(url).addClass('highlight');
		};
		
		
		/**
		 * clicking the navigation scrolls the window to that slide
		 * 
		 */
		var clickToSlide = function() {
			$('a[href*=#]').click(function() {
			    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			        var element = $(this.hash).length && $(this.hash) || $('[name=' + this.hash.slice(1) +']');
					var offset = element.offset().top; 
			        $('html,body').animate({scrollTop: offset}, 900);
					$('div#nav ul li').removeClass('highlight');
					$(this).parent().addClass('highlight');
			    }
			});	
		};
		

		/**
		 * deletes a new slide if the user clicks cancel
		 * 
		 */
		var cancelDeletesNewSlide = function() {
			$('a.delete_new_slide').click(function(e){
				$.post( this.href, {_method:'delete'}, function(){
					window.location = '/';
				});
				return false;
			});
		};
		
		
		/**
		 * keyboard navigation
		 * 
		 * - up, left, right and down keys
		 * - c create, d delete, e edit
		 * 
		 */
		var keyboardNavigation = function() {
			var index = 0;
			var offset = 0;

			$(document).keydown(function(e) {
				var go = function(direction) {

					var slides = $('.slide');
					var max = slides.length;
					var min = 0;

					this.up = function() {
						if (index > min) index--;
						return index;
					};

					this.down = function() {
						if (index < max) index++;
						if (index == max) index = min;
						return index;		
					};

					index = this[direction]();
					offset = $(slides[index]).offset().top;

					$('html,body').animate({scrollTop: offset}, 900);

					$('div#nav ul li').removeClass('highlight');
					var nav = slides[index].id.replace('slide_', '#slide_control_');
					$(nav).addClass('highlight');
				};

				var editSlide = function() {
					window.location = $('li.highlight')[0].id.replace('slide_control_','') + '/edit'
				};
				var deleteSlide = function() {
					window.location = $('li.highlight')[0].id.replace('slide_control_','') + '/destroy'
				};
				var createSlide = function() {
					$('form#slide_new').submit();
				};

				var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

				var keys = {
					0:function(){}, 
					37:function(){go('up')}, // left
					38:function(){go('up')},
					39:function(){go('down')}, // right
					40:function(){go('down')},
					69:function(){editSlide()},
					68:function(){deleteSlide()},
					67:function(){createSlide()}
				};

				try {
					keys[key]();
				} catch( e ) {
					// ignore other keys
				};
			});
		};
		
		/**
		 * toggles help text in global navigation
		 * 
		 */
		var toggleHelp = function() {
			$("a#toggle-help").click(function(e){ $("#help").toggle('slow') });	
		};
		
		return {
			init:function() {
				syntaxHighlight();
				toggleSlideControls();
				sortable();
				highlightDefaultSlide();
				clickToSlide();
				cancelDeletesNewSlide();
				keyboardNavigation();
				toggleHelp();
			}
		}
	}();
	
	Crooner.init();
	
/// ---	
});