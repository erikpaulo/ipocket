define([], function () {


    var ErrorModule = angular.module('ErrorModule', []);

	ErrorModule.factory('ErrorHandler',
	    function(){
	        var errors = [];
	        var warnings = [];

            function getAndFlush(arr){
                    var copy = [];
                    angular.copy(arr, copy);
                    arr = [];
                    return copy;
            }

	        return {
	            $errors: errors,
	            $warnings: warnings,
	            addError: function(err){
	                errors.push(err);
	            },
	            addWarning: function(warning){
	                warnings.push(warning);
	            },
	            getAndFlushErrors: function(){
	                return getAndFlush($errors);
                },
	            getAndFlushErrors: function(){
	                return getAndFlush($warnings);
	            }
	        }
	    }
	);
	
    ErrorModule.controller('ErrorHandlerControler', ['$scope', 'ErrorHandler',
        function($scope, ErrorHandler){
        $scope.errorHandler = ErrorHandler;

            $scope.watch('errorHandler.$errors', function(newValue, oldValue){
                console.log('Error: '+ newValue.length);
            })
            $scope.watch('errorHandler.$warnings', function(newValue, oldValue){
                console.log('Warnings: '+ newValue.length);
            })

//            $scope.showActionToast = function() {
//                var toast = $mdToast.simple()
//                    .textContent('Action Toast!')
//                    .action('OK')
//                    .highlightAction(false)
//                    .position($scope.getToastPosition());
//
//                $mdToast.show(toast).then(function(response) {
//                    if ( response == 'ok' ) {
//                        alert('You clicked \'OK\'.');
//                    }
//                });
//            }
        }
    ]);

	return ErrorModule;
});