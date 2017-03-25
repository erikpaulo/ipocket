define(['./module'
        , '../../shared/services/utils-service'
        , '../services/budget-resources'],

        function (app) {

            app.controller('BudgetFollowUpController', ['$scope', '$location', 'BudgetResource',
                function($scope, $location, Budget) {
                    $scope.appContext.contextPage = 'Orçamento';
                    $scope.appContext.contextMenu.setActions([

                    ]);

                    Budget.getBudgetFollowUp(function(data){
                        $scope.budget = data;

                        angular.forEach($scope.budget.data, function(group){
                            summarize(group);

                            angular.forEach(group.data, function(category){
                                summarize(category);

                                angular.forEach(category.data, function(subCategory){
                                    summarize(subCategory);
                                });
                            });
                        });
                    });

                    $scope.edit = function(){
                        $location.path('/budget/new');
                    }

                    $scope.billProjectionChartConfig = {
                        options:{
                            chart:{
                                type:"areaspline"
                            },
                            plotOptions:{
                                series:{
                                    stacking:""
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
                        ],
                        title:{text:""},
                        credits:{enabled:false},
                        loading:false,
                        size:{
                            height:300,
                            width:800
                        },
                        xAxis: {
                            labels: {
                                enabled: true
                            },
                            categories: [],
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

                    function summarize (node){
                        calcLastMonthsData(node);
                        calcLastMonthData(node);
                        calcThisMonthData(node);
                        calcNextMonthData(node);
                        calcNextMonthsData(node);
                    }

                    function calcLastMonthsData(node){
                        node.lastMonthsPlanned = calcLastMonths(node.perMonthPlanned);
                        node.lastMonthsSpent = calcLastMonths(node.perMonthSpent);
                        if (node.isPositive){
                            node.lastMonthsDeviation = node.lastMonthsSpent - node.lastMonthsPlanned;
                        } else {
                            node.lastMonthsDeviation = node.lastMonthsPlanned - node.lastMonthsSpent;
                        }
                    }

                    function calcLastMonths (yearData){
                        var index = getThisMonthIndex();
                        var total = 0;

                        var i = 0;
                        while(i < index ){
                            total += yearData[i];
                            i++;
                        }

                        return total;
                    }

                    function calcLastMonthData (node){
                        node.lastMonthPlanned = calcLastMonth(node.perMonthPlanned);
                        node.lastMonthSpent = calcLastMonth(node.perMonthSpent);
                        if (node.isPositive){
                            node.lastMonthDeviation = node.lastMonthSpent - node.lastMonthPlanned;
                        } else {
                            node.lastMonthDeviation = node.lastMonthPlanned - node.lastMonthSpent;
                        }
                    }

                    function calcLastMonth (yearData){
                        var index = getThisMonthIndex();
                        return (index > 0 ? yearData[index-1] : 0);
                    }

                    function calcThisMonthData (node){
                        node.thisMonthPlanned = calcThisMonth(node.perMonthPlanned);
                        node.thisMonthSpent = calcThisMonth(node.perMonthSpent);
                        if (node.isPositive){
                            node.thisMonthDeviation = node.thisMonthSpent - node.thisMonthPlanned;
                        } else {
                            node.thisMonthDeviation = node.thisMonthPlanned - node.thisMonthSpent;
                        }
                    }

                    function calcThisMonth (yearData){
                        var index = getThisMonthIndex();
                        return yearData[index];
                    }

                    function calcNextMonthData (node){
                        node.nextMonthPlanned = calcNextMonth(node.perMonthPlanned);
                        node.nextMonthSpent = calcNextMonth(node.perMonthSpent);
                        if (node.isPositive){
                            node.nextMonthDeviation = node.nextMonthSpent - node.nextMonthPlanned;
                        } else {
                            node.nextMonthDeviation = node.nextMonthPlanned - node.nextMonthSpent;
                        }
                    }

                    function calcNextMonth (yearData){
                        var index = getThisMonthIndex();

                        return (index < 12 ? yearData[index+1] : 0);
                    }

                    function calcNextMonthsData (node){
                        node.nextMonthsPlanned = calcNextMonths(node.perMonthPlanned);
                        node.nextMonthsSpent = calcNextMonths(node.perMonthSpent);
                        if (node.isPositive){
                            node.nextMonthsDeviation = node.nextMonthsSpent - node.nextMonthsPlanned;
                        } else {
                            node.nextMonthsDeviation = node.nextMonthsPlanned - node.nextMonthsSpent;
                        }
                    }

                    function calcNextMonths (yearData){
                        var index = getThisMonthIndex();
                        var total = 0;

                        var i = index+1;
                        while(i < 12 ){
                            total += yearData[i];
                            i++;
                        }

                        return total;
                    }

                    function getThisMonthIndex(){
                        var today = new Date();
                        var index = today.getMonth();

                        return index;
                    }
                }
            ]);
        }
);