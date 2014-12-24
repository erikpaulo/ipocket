define([ 'app' ], function(app) {
	app.controller('HomeViewController', [ '$scope',
	function($scope) {
		// atualiza o modulo corrente
		var moduleId = "system";
		app.context.changeCurrentContext(moduleId);

		
		$scope.page = {
			heading : 'Welcome'
		};
	} ]);
});