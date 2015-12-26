define([ 'app' ], function(app) {
	app.controller('IndexControl', [ '$scope', function($scope) {
		console.log("IndexControl")
		// atualiza o modulo corrente
		var moduleId = "system";
		app.context.changeCurrentContext(moduleId);

		console.log('IndexControl: '+ moduleId);
		
		$scope.page = {
			heading : 'Index'
		};
	} ]);
});