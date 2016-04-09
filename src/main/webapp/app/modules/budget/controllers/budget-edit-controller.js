define(['./module',
        '../services/budget-resources',
        '../../account/services/account-resources',
        '../../categorization/services/category-group-resources',
        '../services/budget-service'], function (app) {

	app.controller('BudgetEditController', ['$scope', '$location', '$routeParams', 'BudgetService', 'BudgetResource', 'CategoryGroupResource',
        function($scope, $location, $routeParams, BudgetService, Budget, CategoryGroup) {
            var today = new Date();

            // init a new object of Budget to be filled by the user.
//            BudgetService.initNewBudget(today.getFullYear()).then(function(budget){
//                $scope.budget = budget;
//            });
            if ($routeParams.budgetId){
                new Budget({id: $routeParams.budgetId}).$get(function(budget){
                    $scope.budget = budget;
                    $scope.update();
                });
            } else {
                Budget.new(function(budget){
                    $scope.budget = budget;
                    $scope.update();
                });
            }

            $scope.update = function(){
                BudgetService.updateCalculatedFields($scope.budget);
            }

            $scope.save = function(){


                new Budget($scope.budget).$save(function(){
                    $location.path('budget/');
                });
            }
        }
	]);

});