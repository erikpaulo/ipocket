define(['./module',
        '../../shared/services/utils-service'], function (app) {

	app.controller('InvestmentFRDController', ['$scope', '$routeParams', '$timeout', '$mdDialog', 'Constants', 'Utils', 'InvestmentResource', 'InvestmentEntryResource',
        function($scope, $routeParams, $timeout, $mdDialog, Constants, Utils, Investment, InvestmentEntry) {
            $scope.appContext.contextMenu.setActions([
                {icon: 'cached', tooltip: 'Atualizar Índice', onClick: function() {
                    openIndexDialog($scope, $mdDialog, Utils, Constants);
               }},
                {icon: 'add_circle', tooltip: 'Novo Lançamento', onClick: function() {
                    openEntryDialog($scope, $mdDialog, Utils, Constants);
               }}
            ]);

            $scope.load = function(){
                new Investment({id: $routeParams.investmentID}).$statement(function(data){
                    $scope.investment = data;

                    $scope.appContext.contextPage = 'Investimentos: Fundo Referenciado: '+ $scope.investment.name;

                    $scope.updateChart();
                });
            }

            $scope.updateChart = function(){
                $scope.investIncomeCfg.series[0].data = [];
                angular.forEach($scope.investment.amountCurrentUpdates, function(amount){
                    $scope.investIncomeCfg.series[0].data.push(amount);
                });

                $scope.indexIncomeCfg.series[0].data = [];
                angular.forEach($scope.investment.indexIncome, function(index){
                    $scope.indexIncomeCfg.series[0].data.push(index);
                });
            }

            function openIndexDialog($scope, $mdDialog){
                $mdDialog.show({
                    controller: IndexDialogController,
                    templateUrl: 'modules/investment/views/update-index-template.html',
                    parent: angular.element(document.body),
                    locals: {
                        indexes: $scope.investment.indexUpdates
                    },
                    clickOutsideToClose:true
                }).then(function(newIndex){
                    newIndex.id = $routeParams.investmentID;
                    new Investment(newIndex).$updateIndex(function(data){
                        $scope.load();
                        addWarning($scope, 'Índice atualizado com sucesso!');
                    }, function(err){
                    });
                });
            }

            function openEntryDialog($scope, $mdDialog, Utils){
                $mdDialog.show({
                    controller: EntryDialogController,
                    templateUrl: 'modules/investment/views/new-investment-entry-template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true
                }).then(function(newEntry){
                    newEntry.investmentId = $routeParams.investmentID;
                    new InvestmentEntry(newEntry).$save(function(data){
                        $scope.load();
                        addWarning($scope, 'Lançamento registrado com sucesso!');
                    }, function(err){
                    });
                });
            }

            $scope.investIncomeCfg = {
                options:{
                    chart:{
                        type:"spline"
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
                    }, 50);
                },
                series:[
                    {name: "Saldo Total (R$)",data: [],id: "series-0"}
                ],
                title:{text:""},
                credits:{enabled:false},
                loading:false,
                size:{
                    height:230
                },
                xAxis: {
                    labels: {
                        enabled: false
                    },
                    categories: [],
                    lineWidth: 1
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 1
                }
            }

            $scope.indexIncomeCfg = {
                options:{
                    chart:{
                        type:"line"
                    },
                    plotOptions:{
                        series:{
                            stacking:""
                        },
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    tooltip: {
                        shared: true,
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y: ,.2f}%</b><br/>',
                        headerFormat: ''
                    }
                },
                func: function(chart) {
                    $timeout(function() {
                        chart.reflow();
                    }, 50);
                },
                series:[
                    {name: "Performance (%)",data: [],id: "series-0"}
                ],
                title:{text:""},
                credits:{enabled:false},
                loading:false,
                size:{
                    height:230
                },
                xAxis: {
                    labels: {
                        enabled: false
                    },
                    categories: [],
                    lineWidth: 1
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 1
                }
            }

            $scope.load();
        }
	]);

    function IndexDialogController($scope, $mdDialog, indexes) {
        $scope.indexes = indexes;

        $scope.indexUpdate = {};

        $scope.hide = function() {
            $mdDialog.cancel();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.submit = function() {
            $mdDialog.hide($scope.indexUpdate);
        };
    }

    function EntryDialogController($scope, $mdDialog, Utils) {


        $scope.entry = {type: 'B'}
        $scope.entryTypes = [
            {id: 'B', name: "Compra"},
            {id: 'S', name: "Venda"}
        ]

        $scope.hide = function() {
            $mdDialog.cancel();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.submit = function() {
            $scope.entry.amount = Utils.currencyToNumber($scope.entry.amount)
            $scope.entry.incomeTax = Utils.currencyToNumber($scope.entry.incomeTax)
            $scope.entry.iof = Utils.currencyToNumber($scope.entry.iof)
            $mdDialog.hide($scope.entry);
        };
    }
});

