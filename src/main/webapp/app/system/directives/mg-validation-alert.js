define(['./module'], function(directives)
{
	directives.directive('mgValidationAlert', ['$compile',  function($compile) {
	    return {
	    	scope: {
				mgValidationAlert: '='
	    	},
	        restrict: 'A',
	        compile: function compile(element, tAttrs, transclude) {
	        	tAttrs['ngClass'] = "{true: \'validation-border-alert\'}["+ element[0].form.name +"[\'"+ tAttrs.ngModel +"\'].$invalid \&\& !"+ element[0].form.name +"[\'"+ tAttrs.ngModel +"\'].$pristine]";
	        	
	        	// Verifica se o elemento é um datepicker para aplicar css específico.
	        	var isDatepicker = element.parent().hasClass('date');
	        	
	        	$('<span class="hint--bottom hint--error '+ (isDatepicker? 'validation-alert-datepicker' : 'validation-alert') +'" data-hint="'+ (tAttrs.mgValidationMessage == undefined ? 'Campo inválido e/ou obrigatório!' : tAttrs.mgValidationMessage) +'">'+
	        	  '<i ng-class="{true: \'glyphicon glyphicon-exclamation-sign\'}['+ element[0].form.name +'[\''+ tAttrs.ngModel +'\'].$invalid \&\& !'+ element[0].form.name +'[\''+ tAttrs.ngModel +'\'].$pristine]"></i>'+
				  '</span> ').insertAfter(element);
	        }
	    };
	}]);
});