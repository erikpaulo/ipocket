define(['./module'
        , '../../shared/services/utils-service',
        , '../services/budget-entry-resources',
        , '../services/budget-resources'],

        function (app) {

            app.controller('BudgetNewController', ['$scope', '$filter', '$mdDialog', 'BudgetResource', 'BudgetEntryResource',
                function($scope, $filter, $mdDialog, BudgetResource, BudgetEntryResource) {
                    $scope.appContext.contextPage = 'Novo Orçamento';
                    $scope.appContext.contextMenu.setActions([
                        {icon: 'add_circle', tooltip: 'Nova Entrada', onClick: function() {
                            openDialog($scope, $filter, $mdDialog, BudgetEntryResource);
                        }}
                    ]);

                    BudgetResource.getCurrent(function(budget){
                        $scope.budget = budget;
                    });

//                    $scope.budget = {
//                        year: 2016,
//                        totalIncome: 290010,
//                        totalExpense: 120200,
//                        totalInvested: 80300,
//                        totalNotAllocated: 90040,
//                        categories: [
//                            {
//                                id: 1,
//                                name: 'Moradia',
//                                budgeted: [300, 300, 300, 3600, 3500, 3080, 300, 300, 300, 300, 300, 300],
//                                totalBudgeted: 3600,
//                                subCategories: [
//                                    {
//                                         id: 2,
//                                         name: 'Cemig',
//                                         budgeted: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
//                                         totalBudgeted: 1200
//                                    },
//                                    {
//                                         id: 3,
//                                         name: 'Condomínio',
//                                         budgeted: [1000, 100, 1500, 100, 100, 100, 100, 100, 100, 100, 100, 100],
//                                         totalBudgeted: 1200
//                                    },
//                                    {
//                                         id: 4,
//                                         name: 'Diarista',
//                                         budgeted: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
//                                         totalBudgeted: 1200
//                                    }
//                                ]
//                            },
//                            {
//                                id: 5,
//                                name: 'Salário CI&T',
//                                budgeted: [1200, 3000, 1300, 23600, 3500, 3080, 300, 300, 300, 300, 300, 300],
//                                totalBudgeted: 53600,
//                                subCategories: [
//                                    {
//                                         id: 6,
//                                         name: 'RemVar CI&T - Carol',
//                                         budgeted: [1500, 100, 100, 100, 100, 55100, 100, 100, 100, 100, 100, 100],
//                                         totalBudgeted: 15200
//                                    }
//                                ]
//                            }
//                        ]
//                    }
                }
            ]);

            function openDialog($scope, $filter, $mdDialog, BudgetEntryResource){
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'modules/budget/views/new-budget-entry-template.html',
                    parent: angular.element(document.body),
                    locals: {
                        budget: $scope.budget
                    },
                    clickOutsideToClose:true
                }).then(function(newBudgetEntry){

                    newBudgetEntry.budgetYear = $scope.budget.year;
                    new BudgetEntryResource(newBudgetEntry).$new(function(data){

                        $scope.budget = data;
                        addSuccess($scope);
                    });
                });
            }

            function DialogController($scope, $filter, $mdDialog, BudgetResource, Utils, budget) {
                $scope.newBudget = {
                    option: 'sv',
                    budgetID: budget.id
                }

                // Gets all categories
                BudgetResource.listNonAllocatedCategories(function(data){
                    $scope.categories = data;
                });

                $scope.querySearch = function(query){
                    return $filter('filter')($scope.categories, query);
                }

                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.submit = function() {

                    if ($scope.newBudget.option == 'sv'){
                        $scope.newBudget.jan = $scope.newBudget.feb = $scope.newBudget.mar = $scope.newBudget.apr =
                        $scope.newBudget.may = $scope.newBudget.jun = $scope.newBudget.jul = $scope.newBudget.aug =
                        $scope.newBudget.sep = $scope.newBudget.oct = $scope.newBudget.nov = $scope.newBudget.dec =
                        Utils.currencyToNumber($scope.newBudget.sameValue);
                        delete $scope.newBudget.sameValue;

                    } else {
                        $scope.newBudget.jan = Utils.currencyToNumber($scope.newBudget.jan);
                        $scope.newBudget.feb = Utils.currencyToNumber($scope.newBudget.feb);
                        $scope.newBudget.mar = Utils.currencyToNumber($scope.newBudget.mar);
                        $scope.newBudget.apr = Utils.currencyToNumber($scope.newBudget.apr);
                        $scope.newBudget.may = Utils.currencyToNumber($scope.newBudget.may);
                        $scope.newBudget.jun = Utils.currencyToNumber($scope.newBudget.jun);
                        $scope.newBudget.jul = Utils.currencyToNumber($scope.newBudget.jul);
                        $scope.newBudget.aug = Utils.currencyToNumber($scope.newBudget.aug);
                        $scope.newBudget.sep = Utils.currencyToNumber($scope.newBudget.sep);
                        $scope.newBudget.oct = Utils.currencyToNumber($scope.newBudget.oct);
                        $scope.newBudget.nov = Utils.currencyToNumber($scope.newBudget.nov);
                        $scope.newBudget.dec = Utils.currencyToNumber($scope.newBudget.dec);
                    }
                    delete $scope.newBudget.option;
                    $scope.newBudget.subCategoryId = $scope.newBudget.subCategoryId.subCategoryId;

                    $mdDialog.hide($scope.newBudget);
                };
            }
        }

);