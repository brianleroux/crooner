$(function(){
	
	// in ur slides highlighin ur syntaxes
	dp.SyntaxHighlighter.ClipboardSwf = '/flash/clipboard.swf';
	dp.SyntaxHighlighter.HighlightAll('code');	
	
	// hide all the editing controls 
	$('div#nav ul li a.control').hide();
	
	// unless the presentor is mousing around
	$('div#nav ul li').hover(
		function(){ $(this).children('.control').show(); },
		function(){ $(this).children('.control').hide(); }
	);
	
	// make the slides drag'n'drop sortable
	$('div#nav ul').sortable({
		containment:'parent',
		// tell the server about our new sort
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
	
	// click scrolls to slide 
	$('a[href*=#]').click(function() {
		if( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

			var $target = $(this.hash);	
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');

			if($target.length) 
			{
				var targetOffset = $target.offset().top;
				$('html,body').animate({scrollTop: targetOffset}, 900);
				$('div#nav ul li').removeClass('highlight');
				$(this).parent().addClass('highlight');
				return false;
			} 			
		}
	});
	
	
	
	// keyboard shortcuts
	/*
	var index = 0;
	$(window).keypress(function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		var up = 38;
		var down = 40;
		var slides = $('a[href*=#]');
		
		index = (code == up ? index-- : index++);
		if( index < 0 ) index = 0;
		if( index > slides.length) index = slides.length - 1;
		
				
		var currentSlide = slides[index];

		// var $target = $(this.hash);	
		// $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
		alert(currentSlide.href);


	});
	*/
	
///	
});