define(['./module'], function (app) {

	app.controller('DashboardController', ['$scope', '$http',
	function($scope, $http) {
	 	
		$scope.appContext.changeCurrentContext($scope.modules[0].id);
		
		$scope.items = [];
	
	}]);

});