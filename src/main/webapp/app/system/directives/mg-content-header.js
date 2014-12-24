define(['./module'], function(directives)
{
	directives.directive('mgContentHeader', function() {
	      return {
	        restrict: 'E',
	        transclude: true,
	        scope: {
	        	bcomponent: '@businessComponent',
	        	pageTitle: '@pageTitle',
	        	storyName: '@storyName'
	        },
	        templateUrl: 'system/directives/template/mg-content-header.html'
	      };
	});
	
});