define([ 'app' ], function(app) {
	app.controller('IndexControl', [ '$scope', function($scope) {
		
		// atualiza o modulo corrente
		var moduleId = "system";
		app.context.changeCurrentContext(moduleId);

		console.log('IndexControl')
		
		$scope.page = {
			heading : 'Index'
		};
	} ]);
});