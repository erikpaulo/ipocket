define(['./module'
        , '../../shared/services/utils-service',
        , '../../bill/services/budget-entry-resources',
        , '../../bill/services/budget-resources'],

        function (app) {

            app.controller('BudgetNewController', ['$scope', '$filter', '$mdDialog', 'BudgetResource', 'BudgetEntryResource',
                function($scope, $filter, $mdDialog, BudgetResource, BudgetEntryResource) {
                    $scope.appContext.contextPage = 'Novo Orçamento';
                    $scope.appContext.contextMenu.setActions([
                        {icon: 'add_circle', tooltip: 'Nova Entrada', onClick: function() {
                            openDialogNew($scope, $filter, $mdDialog, BudgetEntryResource);
                        }}
                    ]);

                    BudgetResource.getCurrent(function(budget){
                        $scope.budget = budget;
                    });

                    $scope.editBudgetEntry = function (subcategory){
                        openDialogEdit($scope, $mdDialog, BudgetEntryResource, subcategory);
                    }
                }
            ]);


            function openDialogNew($scope, $filter, $mdDialog, BudgetEntryResource){
                $mdDialog.show({
                    controller: DialogNewController,
                    templateUrl: 'modules/budget/views/new-budget-entry-template.html',
                    parent: angular.element(document.body),
                    locals: {
                        budget: $scope.budget
                    },
                    clickOutsideToClose:true
                }).then(function(editBudgetEntry){

                    editBudgetEntry.budgetYear = $scope.budget.year;
                    new BudgetEntryResource(editBudgetEntry).$new(function(data){

                        $scope.budget = data;
                        addSuccess($scope);
                    });
                });
            }

            function openDialogEdit($scope, $mdDialog, BudgetEntryResource, budgetEntry){
                $mdDialog.show({
                    controller: DialogEditController,
                    templateUrl: 'modules/budget/views/edit-budget-entry-template.html',
                    parent: angular.element(document.body),
                    locals: {
                        budget: $scope.budget,
                        budgetEntry: budgetEntry
                    },
                    clickOutsideToClose:true
                }).then(function(result){
                var budgetEntry = new BudgetEntryResource(result.data);
                    if ( result.operation == 'delete' ){
                        budgetEntry.$delete(function(data){
                            $scope.budget = data;
                            addSuccess($scope);
                        });
                    } else {
                        budgetEntry.$save(function(data){
                            $scope.budget = data;
                            addSuccess($scope);
                        });
                    }
                });
            }

            function DialogNewController($scope, $filter, $mdDialog, BudgetResource, Utils, budget) {
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
            function DialogEditController($scope, $mdDialog, Utils, budget, budgetEntry) {
                $scope.editBudget = {}

                $scope.editBudget.id = budgetEntry.id;
                $scope.editBudget.budgetID = budget.id;
                $scope.editBudget.subCategoryId = budgetEntry.subCategory.id;
                $scope.editBudget.jan = budgetEntry.perMonthPlanned[0];
                $scope.editBudget.feb = budgetEntry.perMonthPlanned[1];
                $scope.editBudget.mar = budgetEntry.perMonthPlanned[2];
                $scope.editBudget.apr = budgetEntry.perMonthPlanned[3];
                $scope.editBudget.may = budgetEntry.perMonthPlanned[4];
                $scope.editBudget.jun = budgetEntry.perMonthPlanned[5];
                $scope.editBudget.jul = budgetEntry.perMonthPlanned[6];
                $scope.editBudget.aug = budgetEntry.perMonthPlanned[7];
                $scope.editBudget.sep = budgetEntry.perMonthPlanned[8];
                $scope.editBudget.oct = budgetEntry.perMonthPlanned[9];
                $scope.editBudget.nov = budgetEntry.perMonthPlanned[10];
                $scope.editBudget.dec = budgetEntry.perMonthPlanned[11];

                $scope.categoryName = budgetEntry.subCategory.fullName;

                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.delete = function(){
                    $scope.submit('delete');
                }
                $scope.save = function(){
                    $scope.submit('save');
                }
                $scope.submit = function(operation) {

                    $scope.editBudget.jan = Utils.currencyToNumber($scope.editBudget.jan);
                    $scope.editBudget.feb = Utils.currencyToNumber($scope.editBudget.feb);
                    $scope.editBudget.mar = Utils.currencyToNumber($scope.editBudget.mar);
                    $scope.editBudget.apr = Utils.currencyToNumber($scope.editBudget.apr);
                    $scope.editBudget.may = Utils.currencyToNumber($scope.editBudget.may);
                    $scope.editBudget.jun = Utils.currencyToNumber($scope.editBudget.jun);
                    $scope.editBudget.jul = Utils.currencyToNumber($scope.editBudget.jul);
                    $scope.editBudget.aug = Utils.currencyToNumber($scope.editBudget.aug);
                    $scope.editBudget.sep = Utils.currencyToNumber($scope.editBudget.sep);
                    $scope.editBudget.oct = Utils.currencyToNumber($scope.editBudget.oct);
                    $scope.editBudget.nov = Utils.currencyToNumber($scope.editBudget.nov);
                    $scope.editBudget.dec = Utils.currencyToNumber($scope.editBudget.dec);

                    $mdDialog.hide({
                        operation: operation,
                        data: $scope.editBudget
                    });
                };
            }
        }

);