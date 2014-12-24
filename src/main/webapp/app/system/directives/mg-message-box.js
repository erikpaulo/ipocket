define(['./module'], function(directives)
{
	directives.directive('messageBox', function() {
	    return {
	      restrict: 'A',
	      transclude: true,
	      scope: {
	      	handler: '=',
	      	enableRemove: '='
	      },
	      templateUrl: 'system/directives/template/mg-message-box.html'
	    };
	});

});