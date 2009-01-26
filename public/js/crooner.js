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
	
	// ONLY if we're in teh app root
	// click scrolls to slide 
	$('a[href*=#]').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	
	    var $target = $(this.hash);	
	    $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
	
	    if($target.length) {
	      var targetOffset = $target.offset().top;
		  $('html,body').animate({scrollTop: targetOffset}, 900);
	
	      return false;
	    }
	  }
	});
	
	
///	
});