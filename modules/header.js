$(document).ready(function(){
	$('nav.navbar>div.tab').mouseenter(function(){
			$(this).animate({
				top: '0px',
				left: '5px'
			},600);
		
	});

	$('nav.navbar>div.tab').mouseleave(function(){
			$(this).animate({
				top: '-26px',
				left: '0px'
			},200);
	});

	$('#atab').click(function(){
			
			if($(this).attr('clicked') !== 'yes') {
				$(this).attr('clicked','yes');
				$('.aNav').animate({
					top: '20px'
				},600);
			} else {
				$(this).attr('clicked','no');
				$('.aNav').animate({
					top: '-55px'
				},200);
			}
	});


})

