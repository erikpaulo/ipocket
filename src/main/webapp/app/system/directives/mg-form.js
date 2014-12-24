define(['./module',
        'jquery-validation',
        'jquery-validation-add-methods'], function(directives)
{
  directives.directive('mgForm', function () {
      return {
          restrict: 'A',
          link: function (scope, elem, attrs) {
            console.log("Recognized the form-validation directive usage");

            var options = {    
          	  debug: true,
          	  
                // the errorPlacement has to take the table layout into account
                errorPlacement: function(error, element) {
  					$('<span class="error"></span>').insertAfter(element).append(error);
                      var parent = $(element).parent('.input-with-icon');
                      parent.removeClass('success-control').addClass('error-control');  
                },
                // set this class to error-labels to indicate valid fields
                success: function (label, element) {
  					var parent = $(element).parent('.input-with-icon');
  					parent.removeClass('error-control').addClass('success-control');
                },
                highlight: function(element, errorClass) {
                  $(element).parent().next().find("." + errorClass).removeClass("checked");
                }
              };

            // add rules
            if (attrs.rulesDef.length > 0) {
                  options["rules"] = scope.$eval(attrs.rulesDef);
            } else {
              // TODO: tenta montar rules a partir dos inputs
            }

            if (attrs.messagesDef.length > 0) {
          	  options["messages"] = scope.$eval(attrs.messagesDef);
            } 
            
            // config form validation
            elem.validate(options);
          }
      };
  });
});