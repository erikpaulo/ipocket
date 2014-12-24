define(['app', './logs-resource'], function (module) {
	/**
	 * Recupera todos os contextos de log da aplicacao
	 * 
	 * @param $scope
	 * @param ManageUser
	 */

	module.controller('LogsController', ['$scope', 'LogsService',
    function ($scope, LogsService) {
//        $scope.loggers = resolvedLogs;
		$scope.loggers = LogsService.findAll();

        $scope.changeLevel = function (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                $scope.loggers = LogsService.findAll();
            });
        }
    }]);
	
});	