define(['./module',
        '../services/account-resources',
        '../../shared/services/utils-service'], function (app) {

	app.controller('AccountController', ['$rootScope', '$scope', '$location', '$filter', '$timeout', '$mdDialog', 'AccountResource', 'Utils', 'Constants',
        function($rootScope, $scope, $location, $filter, $timeout, $mdDialog, Account, Utils, Constants) {
            $scope.appContext.contextPage = 'Contas';
            $scope.appContext.contextMenu.setActions([
                {icon: 'add_circle', tooltip: 'Nova Conta', onClick: function() {
                    openDialog($scope, $mdDialog, Utils, Constants);
               }}
            ]);

            // Open this account details, showing its entries.
            $scope.detail = function(account){
                $location.path('/account/'+ account.id +'/entries');
            }

            Account.summary(function(summary){
                $scope.summary = summary;
                updateChart();
            });

            $scope.delete = function(account){
                new Account(account).$delete(function(){
                    for (var g in $scope.summary.groups){
                        for (var a in $scope.summary.groups[g].accounts){
                            if ($scope.summary.groups[g].accounts[a].id == account.id){
                                $scope.summary.groups[g].balance -= $scope.summary.groups[g].accounts[a].balance;
                                $scope.summary.balance -= $scope.summary.groups[g].accounts[a].balance;
                                $scope.summary.groups[g].accounts.splice(a,1);
                            }
                        }
                    }
                    updateChart();
                    addWarning($scope, 'Conta removida com sucesso!');
                }, function(err){
                    addError($scope, 'Não foi possível remover conta.', err);
                });
            }

            $scope.detail = function(account){
                $location.path('/account/'+ account.id +'/entries');
            }

            $scope.moneyDistributionChartConfig = {
                options: {
                    chart: {
                        type: 'pie'
                    },
                    tooltip: {
                        enabled: true,
                        pointFormatter: function(){
                            return $filter('currency')(this.y)
                        }
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                distance: -30,
                                formatter: function(){
                                    return $filter('number')(this.percentage, 0) + '%';
                                }
                            }
                        },
                         pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    }
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                func: function(chart) {
                    $timeout(function() {
                        chart.reflow();
                    }, 0);
                },
                series: [{
                    name: 'Tipo de Conta',
                    colorByPoint: true,
                    data: [
                    ],
                }],
                credits: {enabled: false},
                loading: false,
                size: {
                   height: 260
                }
            }

            function updateChart(){
                $scope.moneyDistributionChartConfig.series[0].data = [];
                angular.forEach($scope.summary.groups, function(group){
                    if (group.id != Constants.ACCOUNT.TYPE.CHECKING_ACCOUNT && group.balance >= 0)
                        $scope.moneyDistributionChartConfig.series[0].data.push({name: group.name, y:group.balance});
                });

            }


            function openDialog($scope, $mdDialog, Constants){
               $mdDialog.show({
                   controller: DialogController,
                   templateUrl: 'modules/account/views/new-account-template.html',
                   parent: angular.element(document.body),
                   clickOutsideToClose:true
               }).then(function(newAccount){

                    new Account(newAccount).$save(function(account){
                        angular.forEach($scope.summary.groups, function(group){
                            if (group.id == account.type){
                                group.accounts.push(account);
                                group.balance += account.startBalance;
                                updateChart();
                            }
                        });
                        $scope.summary.balance += account.startBalance;
                        addWarning($scope, 'Conta cadastrada com sucesso!');
                    }, function(err){
                        addError($scope, 'Não foi possível cadastrar conta.', err);
                    });
               });
            }
        }

	]);

    function DialogController($scope, $mdDialog, Utils, Constants) {
        $scope.accountTypes = Constants.ACCOUNT.TYPE;

        $scope.newAccount = {};

        $scope.hide = function() {
            $mdDialog.cancel();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.submit = function() {
            $scope.newAccount.startBalance = Utils.currencyToNumber($scope.newAccount.startBalance);
            $mdDialog.hide($scope.newAccount);
        };
    }
});

