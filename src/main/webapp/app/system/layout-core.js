define(['angular'], function(angular) {
//	$(document).ready(function() {
	angular.element(document).ready(function () {
		
		calculateHeight();
		
		$(".inside").children('input').blur(function(){
			$(this).parent().children('.add-on').removeClass('input-focus');		
		});
		
		$(".inside").children('input').focus(function(){
			$(this).parent().children('.add-on').addClass('input-focus');		
		});
		
		
		//**********************************Grid Tools Functions ********************************	
		$('.grid .tools a.remove').on('click', function () {
	            var removable = jQuery(this).parents(".grid");
	            if (removable.next().hasClass('grid') || removable.prev().hasClass('grid')) {
	                jQuery(this).parents(".grid").remove();
	            } else {
	                jQuery(this).parents(".grid").parent().remove();
	            }
	        });

		$('.grid .tools a.reload').on('click', function () {
	            var el =  jQuery(this).parents(".grid");
	            blockUI(el);
				window.setTimeout(function () {
	               unblockUI(el);
	            }, 1000);
	        });
			
		$('.grid .tools .collapse, .grid .tools .expand').on('click', function () {
	            var el = jQuery(this).parents(".grid").children(".grid-body");
	            if (jQuery(this).hasClass("collapse")) {
	                jQuery(this).removeClass("collapse").addClass("expand");
	                el.slideUp(200);
	            } else {
	                jQuery(this).removeClass("expand").addClass("collapse");
	                el.slideDown(200);
	            }
	        });		
			
		$('.user-info .collapse').on('click', function () {
	            jQuery(this).parents(".user-info ").slideToggle();
			});   
			
			var handleSidenarAndContentHeight = function () {
	        var content = $('.page-content');
	        var sidebar = $('.page-sidebar');

	        if (!content.attr("data-height")) {
	            content.attr("data-height", content.height());
	        }

	        if (sidebar.height() > content.height()) {
	            content.css("min-height", sidebar.height() + 120);
	        } else {
	            content.css("min-height", content.attr("data-height"));
	        }
	    }
		$('.panel-group').on('hidden.bs.collapse', function (e) {
		  $(this).find('.panel-heading').not($(e.target)).addClass('collapsed');
		})
		
		$('.panel-group').on('shown.bs.collapse', function (e) {
		 // $(e.target).prev('.accordion-heading').find('.accordion-toggle').removeClass('collapsed');
		})

		
		//**** BEGIN Layout Readjust  ****//
		//Break points for each exits and entering
		$(window).setBreakpoints({
			distinct: true, 
			breakpoints: [
				320,
				480,
				768,
				1024
			] 
		});   
		
		//Break point entry 
		$(window).bind('enterBreakpoint320',function() {	
			$('#main-menu-toggle-wrapper').show();		
			$('#portrait-chat-toggler').show();	
			$('#header_inbox_bar').hide();	
			$('#main-menu').removeClass('mini');		   
			$('.page-content').removeClass('condensed');
			rebuildSider();
		});	
		
		$(window).bind('enterBreakpoint480',function() {
			$('#main-menu-toggle-wrapper').show();		
			$('.header-seperation').show();		
			$('#portrait-chat-toggler').show();				
			$('#header_inbox_bar').hide();	
			//Incase if condensed layout is applied
			$('#main-menu').removeClass('mini');		   
			$('.page-content').removeClass('condensed');			
			rebuildSider();
		});
		
		$(window).bind('enterBreakpoint768',function() {		
			$('#main-menu-toggle-wrapper').show();		
			$('#portrait-chat-toggler').show();	
			
			$('#header_inbox_bar').hide();	
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {			
				$('#main-menu').removeClass('mini');	
				$('.page-content').removeClass('condensed');	
				rebuildSider();
			}	
		});

		$(window).bind('exitBreakpoint320',function() {	
			$('#main-menu-toggle-wrapper').hide();		
			$('#portrait-chat-toggler').hide();	
			$('#header_inbox_bar').show();			
			closeAndRestSider();		
		});	
		
		$(window).bind('exitBreakpoint480',function() {
			$('#main-menu-toggle-wrapper').hide();		
			$('#portrait-chat-toggler').hide();	
			$('#header_inbox_bar').show();			
			closeAndRestSider();	
		});
		
		$(window).bind('exitBreakpoint768',function() {
			$('#main-menu-toggle-wrapper').hide();		
			$('#portrait-chat-toggler').hide();	
			$('#header_inbox_bar').show();			
			closeAndRestSider();
		});

		//Common Function calls
		function closeAndRestSider(){
		  if($('#main-menu').attr('data-inner-menu')=='1'){
			$('#main-menu').addClass("mini");	
			$.sidr('close', 'main-menu');
			$.sidr('close', 'sidr');		
			$('#main-menu').removeClass("sidr");	
			$('#main-menu').removeClass("left");	
		  }
		  else{
			$.sidr('close', 'main-menu');
			$.sidr('close', 'sidr');		
			$('#main-menu').removeClass("sidr");	
			$('#main-menu').removeClass("left");	
		}
		
		}
		function rebuildSider(){
			$('#main-menu-toggle').sidr({		
					name : 'main-menu',
					side: 'left'
			});
		}
		
		$('#layout-condensed-toggle').click(function(){
			 if($('#main-menu').attr('data-inner-menu')=='1'){
				//Do nothing
				console.log("Menu is already condensed");
			 }
			 else{
			  if($('#main-menu').hasClass('mini')){
				$('#main-menu').removeClass('mini');
				$('.page-content').removeClass('condensed');		
				$('.scrollup').removeClass('to-edge');	
				$('.header-seperation').show();
				//Bug fix - In high resolution screen it leaves a white margin
				$('.header-seperation').css('height','61px');
				$('.footer-widget').show();
			  }	
			  else{
				$('#main-menu').addClass('mini');
				$('.page-content').addClass('condensed');		
				$('.scrollup').addClass('to-edge');	
				$('.header-seperation').hide();
				$('.footer-widget').hide();	  
			  }
			 }
		});
		//**** END Layout Readjust  ****//
		
		$('.scroller').each(function () {
	        $(this).slimScroll({
	                size: '7px',
	                color: '#a1b2bd',
	                height: $(this).attr("data-height"),
	                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
	                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
	                disableFadeOut: true
	        });
	    });
		
		$('.dropdown-toggle').click(function () {
			$("img").trigger("unveil");
		});
	   
		if ($.fn.sparkline) {
			$('.sparklines').sparkline('html', { enableTagOptions: true });
		}

		 $('table th .checkall').on('click', function () {
				if($(this).is(':checked')){
					$(this).closest('table').find(':checkbox').attr('checked', true);
					$(this).closest('table').find('tr').addClass('row_selected');
					//$(this).parent().parent().parent().toggleClass('row_selected');	
				}
				else{
					$(this).closest('table').find(':checkbox').attr('checked', false);
					$(this).closest('table').find('tr').removeClass('row_selected');
				}
	    });

		$('.animate-number').each(function(){
			 $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-animation-duration")));	
		})
		$('.animate-progress-bar').each(function(){
			 $(this).css('width', $(this).attr("data-percentage"));
			
		})
		
		
		$('.controller .reload').click(function () { 
			var el =$(this).parent().parent().parent();
			blockUI(el);
			  window.setTimeout(function () {
	               unblockUI(el);
	            }, 1000);
		});
		$('.controller .remove').click(function () {
			$(this).parent().parent().parent().parent().addClass('animated fadeOut');
			$(this).parent().parent().parent().parent().attr('id', 'id_remove_temp_id');
			 setTimeout( function(){			
				$('#id_remove_temp_id').remove();	
			 },400);
		});
	        if (!jQuery().sortable) {
	            return;
	        }
	        $(".sortable").sortable({
	            connectWith: '.sortable',
	            iframeFix: false,
	            items: 'div.grid',
	            opacity: 0.8,
	            helper: 'original',
	            revert: true,
	            forceHelperSize: true,
	            placeholder: 'sortable-box-placeholder round-all',
	            forcePlaceholderSize: true,
	            tolerance: 'pointer'
	        });

		// wrapper function to  block element(indicate loading)
	    function blockUI(el) {		
	            $(el).block({
	                message: '<div class="loading-animator"></div>',
	                css: {
	                    border: 'none',
	                    padding: '2px',
	                    backgroundColor: 'none'
	                },
	                overlayCSS: {
	                    backgroundColor: '#fff',
	                    opacity: 0.3,
	                    cursor: 'wait'
	                }
	            });
	     }
		 
	     // wrapper function to  un-block element(finish loading)
	     function unblockUI(el) {
	            $(el).unblock();
	    }
		
		$(window).resize(function() {
				calculateHeight();
		});
		
		$(window).scroll(function(){
	        if ($(this).scrollTop() > 100) {
	            $('.scrollup').fadeIn();
	        } else {
	            $('.scrollup').fadeOut();
	        }
	    });
		
		$('.scrollup').click(function(){
			$("html, body").animate({ scrollTop: 0 }, 700);
			return false;
	    });
		
		 $("img").unveil();
	});

	function calculateHeight(){
			var contentHeight=parseInt($('.page-content').height());
			if(911 > contentHeight){	
				console.log("Small");
			}	
	}	
});
