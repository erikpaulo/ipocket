define(['./module',
        '../services/budget-resources',
        '../../account/services/account-resources',
        '../../categorization/services/category-group-resources',
        '../../shared/services/constants',
        '../services/budget-service'], function (app) {

	app.controller('Budget2EditController', ['$scope', '$location', '$routeParams', 'BudgetService', 'BudgetResource', 'CategoryGroupResource', 'Constants',
        function($scope, $location, $routeParams, BudgetService, Budget, CategoryGroup, Constants) {
            var today = new Date();

            $scope.months = Constants.MONTHS;

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