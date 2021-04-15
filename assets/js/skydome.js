!function(a,b,c,d){a.fn.doubleTapToGo=function(d){return!!("ontouchstart"in b||navigator.msMaxTouchPoints||navigator.userAgent.toLowerCase().match(/windows phone os 7/i))&&(this.each(function(){var b=!1;a(this).on("click",function(c){var d=a(this);d[0]!=b[0]&&(c.preventDefault(),b=d)}),a(c).on("click touchstart MSPointerDown",function(c){for(var d=!0,e=a(c.target).parents(),f=0;f<e.length;f++)e[f]==b[0]&&(d=!1);d&&(b=!1)})}),this)}}(jQuery,window,document);

(function(){

    $(document).on('submit', 'form.registration-form' , function(e) {
        e.preventDefault();
        var data = JSON.stringify({
            "channel":"SKYDOME", 
            "email": $('#email-newsletter').val(), 
            "language":"en-US"
        });
        var xhr = new XMLHttpRequest();
        var url = "https://newsletter.trionworlds.com/api/subscribe";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    /*GmgSession.sendClickedRegisterEvent('', 'Landing Page');*/
                    $('#modal').toggleClass('open');
                    $('#modal-overlay').toggleClass('open');
                    $('#modal-text').text("Thank you for your interest in Skydome Beta! Check your inbox for a confirmation email.");
                    document.getElementById("newsletter-form").reset();
                    document.getElementById("confirmation").checked = false;
                } else {
                    $('#modal').toggleClass('open');
                    $('#modal-overlay').toggleClass('open');
                    $('#modal-text').text("Error, please try again later.");
                }  
            }
        }
    xhr.send(data);
    });

}());

$(document).ready(function(){
	
	$('.dropdown').doubleTapToGo();
	/*if($('.sidebar').length>0){
		$(".sidebar").sidebar("attach events",".toc"),$(".sidebar a.item").on("click",function(){$(".sidebar").sidebar("hide")});
	};*/

	$("#close-button").click(function() {
		$('#modal').toggleClass('open');
		$('#modal-overlay').toggleClass('open');
	});
	
	$(function() {
		var Accordion = function(el, multiple) {
			this.el = el || {};
			this.multiple = multiple || false;
	
			// Variables privadas
			var links = this.el.find('.link');
			// Evento
			links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
		}
	
		Accordion.prototype.dropdown = function(e) {
			var $el = e.data.el;
				$this = $(this),
				$next = $this.next();
	
			$next.slideToggle();
			$this.parent().toggleClass('open');
	
			if (!e.data.multiple) {
				$el.find('.desc').not($next).slideUp().parent().removeClass('open');
			};
		}	
	
		var accordion = new Accordion($('#accordion'), false);
	});
	
	window.lazySizesConfig = window.lazySizesConfig || {};
	window.lazySizesConfig.lazyClass = 'lazyload';
		
	$('.n_about').on("click", function(){
		$('html, body').animate({scrollTop: $('#game').offset().top-50}, 1000);
	});

	$('.n_features').on("click", function(){
		$('html, body').animate({scrollTop: $('#features').offset().top-75}, 1000); 
	});
	
	$('.n_media').on("click", function(){
		$('html, body').animate({scrollTop: $('#media').offset().top-85}, 1000);
	});	 
	
	$('.signup, .signup-now').on("click", function(){
		$('html, body').animate({scrollTop: $('#signup').offset().top+320}, 1000);
	})

	$('#totop').click(function(event){
		$('html,body').animate({scrollTop:0},1000);
	});
	
	/*if($(document).width() > "768") {
	$('.screenshots').slick({  
		centerMode: true,
		centerPadding: '500px',
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		dots: true,
		arrows: false,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: 1600,
				settings: {
				centerMode: true,
				centerPadding: '500px',
				slidesToShow: 1
				}
			},
			{
				breakpoint: 1200,
				settings: {
				centerMode: true,
				centerPadding: '300px',
				slidesToShow: 1
				}
			},
			{
			breakpoint: 768,
			settings: {
				centerMode: true,
				centerPadding: '100px',
				slidesToShow: 1
				}
			 },
		]
	});
	}*/

	splide = new Splide( '#splide', {
		type: 'loop',
		arrows: false,
		autoWidth: true,
		pagination: true,
		lazyLoad: 'nearby',
		focus    : 'center',
		breakpoints: {
			480: {
				destroy: true, 
			},
		}
	  } ).mount();

	var params = new URLSearchParams(window.location.search);
	var token = params.get("token");
	if(token) {
		var data = JSON.stringify({
            "token": token
        });
        var xhr = new XMLHttpRequest();
        var url = "https://newsletter.trionworlds.com/api/subscribeDoubleOptIn";
	
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
				if(xhr.status === 200) {
                    /*GmgSession.sendRegistrationEvent('', 'Landing Page');*/
					/*var urlConfirmation = new URL(window.location.origin)+ 'confirmation.html';
					window.open(urlConfirmation);*/
					window.location.href = "https://playskydome.com/confirmation.html";
				} 
            } 
        }
    	xhr.send(data);		
	}	
});	