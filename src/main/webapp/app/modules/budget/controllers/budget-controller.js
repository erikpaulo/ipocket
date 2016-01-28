define(['./module',
        '../services/budget-resources',
        '../../account/services/account-resources',
        '../../configuration/services/category-group-resources',
        '../services/budget-service'], function (app) {

	app.controller('BudgetController', ['$scope', '$location', '$timeout', 'BudgetService', 'BudgetResource', 'CategoryGroupResource',
        function($scope, $location, $timeout, BudgetService, Budget, CategoryGroup) {

            // gets all budgets
            $scope.budgets = [];
            $scope.budget = {}
            Budget.listAll(function(budgets){
                $scope.budgets = budgets;
                angular.forEach(budgets, function(b){
                    if (b.status == 'active'){
                        $scope.budget = b;
                    }
                });

                // checks if the active budget is for this year, if not, create new
                var thisYear = new Date().getFullYear();
                if (!$scope.budget || $scope.budget.year != thisYear){
                    $location.path('/budget/new');
                }

            });

            // gets the budget dashboard info.
            $scope.details = {}
            Budget.getDashboard(function(dashboard){
                $scope.dashboard = dashboard;

                $scope.details.nodeSelected = dashboard.track.track;
                $scope.details.trail = [{id: dashboard.track.entry.id, name: dashboard.track.entry.year, node: dashboard.track}]
            });

            $scope.goDown = function(node){
                if (node.track){
                    $scope.details.nodeSelected = node.track;
                    $scope.details.trail.push({id: node.entry.id, name: node.entry.name, node: node});
                }
            }

            $scope.goBack = function(node){
                $scope.details.trail.splice($scope.details.trail.length-1, 1);
                $scope.details.nodeSelected = $scope.details.trail[$scope.details.trail.length-1].node.track
            }

            $scope.budgetTrackReport = {
                options:{
                    chart:{
                        type:"area"
                    },
                    plotOptions:{
                        series:{
                            stacking:""
                        },
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        shared: true,
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>R$ {point.y: ,.2f}</b><br/>',
                        headerFormat: ''
                    }
                },
                func: function(chart) {
                    $timeout(function() {
                        chart.reflow();
                    }, 0);
                },
                series:[
                    {name:"Planejado", data:[411.33,822.66,1233.99,1645.32,2056.65,2467.98,2879.31,3290.64,3701.97,4113.3,4524.63,4935.96],id:"series-0"},
                    {name:"Executado",data:[224.78,449.56,674.34,899.12,1123.9,1348.68],id:"series-1"}
                ],
                title:{text:""},
                credits:{enabled:false},
                loading:false,
                size:{
                    height:230
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    labels: {
                        enabled: true
                    },
                    lineWidth: 1
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        enabled: true
                    },
                    gridLineWidth: 1
                }
            }

        }
    ]);

	app.controller('BudgetEditController', ['$scope', '$location', 'BudgetService', 'BudgetResource', 'CategoryGroupResource',
        function($scope, $location, BudgetService, Budget, CategoryGroup) {

            // init a new object of Budget to be filled by the user.
            BudgetService.initNewBudget(thisYear).then(function(budget){
                $scope.budget = budget;
            });

            $scope.update = function(){
                BudgetService.updateCalculatedFields($scope.budget);
            }
        }
	]);

});