define(['./module',
        '../services/budget-resources',
        '../../account/services/account-resources',
        '../../categorization/services/category-group-resources',
        '../services/budget-service'], function (app) {

	app.controller('BudgetViewController', ['$scope', '$location', '$timeout', 'BudgetService', 'BudgetResource', 'CategoryGroupResource',
        function($scope, $location, $timeout, BudgetService, Budget, CategoryGroup) {

            // gets all budgets
            $scope.budgets = [];
            $scope.budget = {}
            Budget.listAll(function(budgets){
                $scope.budgets = budgets;
                angular.forEach(budgets, function(b){
                    if (b.active){
                        $scope.budget = b;
                    }
                });

                // checks if the active budget is for this year, if not, create new
                var thisYear = new Date().getFullYear();
                if (!$scope.budget || $scope.budget.year != thisYear){
                    $location.path('/budget/new');
                } else {
                    init();
                }
            });

            function init() {
                // gets the budget dashboard info.
                $scope.details = {}
                new Budget({id: $scope.budget.id}).$getDashboard(function(dashboard){
                    $scope.dashboard = dashboard;

                    $scope.details.nodeSelected = dashboard.data.data;
                    $scope.details.trail = [{id: dashboard.data.id, name: dashboard.data.year, node: dashboard.data}]

                    updateChart();
                });

                $scope.goDown = function(node){
                    if (node.data){
                        $scope.details.nodeSelected = node.data;
                        $scope.details.trail.push({id: node.id, name: node.name, node: node});
                    }
                }

                $scope.goBack = function(node){
                    $scope.details.trail.splice($scope.details.trail.length-1, 1);
                    $scope.details.nodeSelected = $scope.details.trail[$scope.details.trail.length-1].node.data
                }

                $scope.edit = function(id){
                    $location.path('/budget/edit' +'/'+ id );
                }

                function updateChart(){
                    $scope.budgetTrackReport.series[0].data = [];
                    $scope.budgetTrackReport.series[1].data = [];

                    var accPlanned = 0.0, accExecuted = 0.0;
                    for(var i=0;i<12;i++){
                        accPlanned += $scope.dashboard.data.perMonthPlanned[i];
                        accExecuted += $scope.dashboard.data.perMonthSpent[i];

                        $scope.budgetTrackReport.series[0].data.push(accPlanned);
                        $scope.budgetTrackReport.series[1].data.push(accExecuted);
                    }
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
                        {name:"Planejado", data:[],id:"series-0"},
                        {name:"Executado",data:[],id:"series-1"}
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

        }
    ]);

});