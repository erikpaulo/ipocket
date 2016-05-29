define(['app',
        '../../bill/services/bill-resources.js'
        ], function(app) {
	app.controller('ReportBudgetSyntheticController', ['$scope', 'Constants', 'BillResource',
        function($scope, Constants, Bill) {

            Bill.budget(function(data){
                $scope.budget = data;

                $scope.totalNotPlanned = 0.0;
                angular.forEach($scope.budget.data, function(group){
                    if (group.name == "Entradas"){
                        $scope.totalNotPlanned += group.totalPlanned;
                    } else {
                        $scope.totalNotPlanned -= group.totalPlanned;
                    }
                })
            });

            $scope.setSemester = function(number){
              $scope.semester = number;
              $scope.months = [];
              for(var i=(number-1)*6;i<(number*6);i++){
                  $scope.months.push(Constants.MONTHS[i]);
              }
            }
            $scope.setSemester(1);

        }
    ]);
});