define(['app'
        ], function(app) {
	app.controller('ReportsController', ['$scope', '$location', function($scope, $location) {
        $scope.appContext.contextPage = 'Relatórios';
        $scope.appContext.contextMenu.actions = [];

        $scope.open = function(reportName){
            $location.path('reports/'+ reportName);
        }
	}]);
});