define(['app',
        '../../categorization/services/subcategory-resources',
        '../../account/services/account-resources',
        '../service/report-account-entries-resources.js'
        ], function(app) {
	app.controller('ReportAccountEntriesController', ['$scope', '$timeout', '$http', '$filter', 'SubCategoryResource', 'AccountResource', 'ReportAEResource',
	function($scope, $timeout, $http, $filter, SubCategory, Account, Report) {
        $scope.appContext.contextPage = 'Relatórios: Lançamentos Realizados';
        $scope.appContext.contextMenu.actions = [];

        var today = new Date()
        start = new Date(today.getFullYear() +'/'+ (today.getMonth()+1) +'/01');

        $scope.filter = {
            start: start,
            end: new Date,
            accounts:[]
        };

        $scope.entries = [];
        $scope.ctrl = {}
        $scope.categoryTypes = [
            {id: 'EXP', name: 'Despesas'},
            {id: 'INC', name: 'Entradas'},
            {id: 'INV', name: 'Investimentos'}
        ]

        SubCategory.listAll(function(data){
            $scope.subCategories = data;
        });

        // Gets all user baking accounts.
        Account.listAll(function(accounts){
            $scope.accounts = accounts;
        })

        $scope.clear = function(){
            $scope.filter = {}
        }

        // Gets filtered entries
        $scope.search = function(){
            if (!$scope.filter.start || !$scope.filter.end){
                addError($scope, 'O período é obrigatório.')
            } else {
                new Report($scope.filter).$list(function(result){
                    $scope.report = result;

                    // Update chart
                    $scope.entriesDistributionChartConfig.series[0].data = [];
                    angular.forEach($scope.report.groupedEntries, function(groupValue, groupName){
                        $scope.entriesDistributionChartConfig.series[0].data.push({name: groupName, y:groupValue});
                    });
                });
            }

        }
        $scope.search();

        $scope.querySearch = function(query, list){
            if (list == 'SubCategories'){
                return $filter('filter')($scope.subCategories, query);
            } else {
                return $filter('filter')($scope.accounts, query);
            }
        }

        $scope.entriesDistributionChartConfig = {
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
                name: 'Categoria',
                colorByPoint: true,
                data: [
                ],
            }],
            credits: {enabled: false},
            loading: false,
            size: {
               height: 320
            }
        }

	}]);
});