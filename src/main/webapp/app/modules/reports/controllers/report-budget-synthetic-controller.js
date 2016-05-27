define(['app',
        '../../bill/services/bill-resources.js'
        ], function(app) {
	app.controller('ReportBudgetSyntheticController', ['$scope', 'Constants', 'BillResource',
        function($scope, Constants, Bill) {

            Bill.budget(function(data){
                $scope.budget = data;
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