define(['./module', '../services/account-resources'], function (app) {

    app.filter('accountTypeName', function () {
        var typeNameHash = {
            CA:  'Conta Corrente',
            SA:  'Conta Poupança',
            IA:  'Conta Investimento',
            CCA: 'Cartão de Crédito'
        }
        return function (input) {
            return (typeNameHash[input] ? typeNameHash[input] : 'Not Found');
        };
    });

	app.controller('AccountController', ['$rootScope', '$scope', '$location', '$filter', '$timeout', 'AccountResource',
        function($rootScope, $scope, $location, $filter, $timeout, Account) {
            $rootScope.appContext.contextPage = 'Contas';

            $scope.appContext.contextMenu.actions = [
                {icon: 'playlist_add', tooltip: 'Nova Conta', onClick: 'newAccount()'}
            ];

            //TODO: Recuperar contas do usuário.
            $scope.summary = {
                balance: 77543.89,
                types:[
                    {
                        type: 'CA', // Checking Account
                        balance: 15435.87,
                        accounts:[
                            {
                                id: 1,
                                name: 'CC: Itaú Personalitè',
                                balance: 3456.8
                            },
                            {
                                id: 2,
                                name: 'CC: HSBC Premier',
                                balance: 56.0
                            }
                        ]
                    },
                    {
                        type: 'SA', // Saving Account
                        balance: 61986.02,
                        accounts:[
                            {
                                id: 3,
                                name: 'CC: Itaú Personalitè',
                                balance: 61986.02
                            }
                        ]
                    },
                    {
                        type: 'IA', // Investiment Account
                        balance: 61986.02,
                        accounts:[
                            {
                                id: 3,
                                name: 'CC: Itaú Personalitè',
                                balance: 61986.02
                            }
                        ]
                    },
                    {
                        type: 'CCA', // Credit Card Account
                        balance: -12986.02,
                        accounts:[
                            {
                                id: 4,
                                name: 'Itaú Personalitè - Visa Carol',
                                balance: -10000.02
                            },
                            {
                                id: 5,
                                name: 'Itaú Personalitè - Visa Erik',
                                balance: -2986.02
                            }
                        ]
                    }
                ]
            }


            $scope.moneyDistributionChartConfig = {
                options: {
                    chart: {
                        type: 'pie'
                    },
                    tooltip: {
                        enabled: true,
//                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormatter: function(){
                            return $filter('currency')(this.y)
                            //'<b>{point.y:.2f}</b> '
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
                        {
                            name: 'Corrente',
                            y: 15435.87
                        },
                        {
                            name: 'Poupança',
                            y: 61986.02/*,
                            sliced: true,
                            selected: true*/
                        },
                        {
                            name: 'Investimento',
                            y: 61986.02
                        }
                    ],
                }],
                credits: {enabled: false},
                loading: false,
                size: {
//                   width: 400,
                   height: 260
                }
            }
        }

	]);
});