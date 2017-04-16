define(['./module'
        , '../services/bill-resources'
        , '../services/budget-resources'
        , '../../categorization/services/subcategory-resources'
        , '../../account/services/account-resources'
        , '../../shared/services/utils-service'],

        function (app) {

	app.controller('BillController', ['$scope', '$filter', '$timeout', '$mdBottomSheet', '$mdDialog', 'BillResource', 'BudgetResource', 'SubCategoryResource', 'AccountResource', 'Utils',
        function($scope, $filter, $timeout, $mdBottomSheet, $mdDialog, Bill, Budget, SubCategory, Account, Util) {
            $scope.appContext.contextPage = 'Planejamento';
            $scope.appContext.contextMenu.setActions([
                {icon: 'add_circle', tooltip: 'Novo Pagamento', onClick: function() {
                    openDialog($scope, $filter, $mdDialog, Bill, $scope.subCategories, $scope.accounts);
               }},
               {icon: 'insert_chart', tooltip: 'Gráfico de Projeção', onClick: function() {
                    $mdBottomSheet.show({
                        templateUrl: 'modules/bill/views/bills-projection-template.html',
                        controller: 'ChartBottomSheetCtrl'
                    });
               }},
               {icon: 'archive', tooltip: 'Gravar Baseline', onClick: function() {
                    $scope.saveBaseline();
               }}
            ]);

            $scope.querySearch = function(query){
                return $filter('filter')($scope.subCategories, query);
            }

            $scope.saveBaseline = function(){
                Budget.saveBaseline(function(budget){
                    $timeout(function() {
                        setCurrentBudget($scope, $filter, budget);
                        addSuccess($scope);
                    }, 0);
                });
            }

            // gets all bills
            Bill.getCurrent(function(budget){
                setCurrentBudget($scope, $filter, budget);
            });

            // To select a single date, make sure the ngModel is not an array.
            $scope.currentMonth = new Date();
            $scope.currentMonth.setDate(1);

            $scope.next = function(){
                $scope.currentMonth.setMonth($scope.currentMonth.getMonth() + 1);
                selectBills($scope, $filter);
            }

            $scope.prev = function(){
                $scope.currentMonth.setMonth($scope.currentMonth.getMonth() - 1);
                selectBills($scope, $filter);
            }

            $scope.selectedBills = null;

            // gets all configured categories
            SubCategory.listAll(function(data){
                $scope.subCategories = data;
            })

            // gets all accounts
            Account.listAll(function(accounts){
                $scope.accounts = accounts;
            });

            // edit some bill, setting this line as input fields
            $scope.inEdit = null;
            $scope.edit = function(bill){
                if ($scope.inEdit){
                    $scope.cancel($scope.inEdit.bill);
                }
                bill.edit = true;
                bill.date = new Date(bill.date);
                $scope.inEdit = angular.copy(bill);
                $scope.inEdit.bill = bill;
            }

            $scope.cancel = function(bill){
                bill.edit = false
                $scope.inEdit = null;
            }

            $scope.save = function(bill){
                var billToSave = new Bill($scope.inEdit)

                billToSave.amount = Util.currencyToNumber($scope.inEdit.amount);
                delete billToSave.edit
                delete billToSave.bill

                billToSave.$save(function(budget){
                    setCurrentBudget($scope, $filter, budget);
                    addSuccess($scope);
                });
            }

            $scope.delete = function(bill){
                bill.date = new Date(bill.date);

                new Bill(bill).$delete(function(budget){
                    setCurrentBudget($scope, $filter, budget);
                    addSuccess($scope);
                });
            }

            $scope.done = function(bill){
                bill.date = new Date(bill.date);

                new Bill(bill).$done(function(budget){
                    setCurrentBudget($scope, $filter, budget);
                    addSuccess($scope);
                });
            }
	    }
	]);

    app.controller('ChartBottomSheetCtrl', ['$scope', '$timeout', '$mdBottomSheet', 'BillResource',
        function($scope, $timeout, $mdBottomSheet, Bill) {

            // List all cashflows impacted throw bills
            Bill.listCashFlow(function(cashFlow){
                $scope.billProjectionChartConfig.xAxis.categories = cashFlow.labels;

                angular.forEach(cashFlow.series, function(serie){
                    $scope.billProjectionChartConfig.series.push({name: serie.name, data: serie.data, id: serie.name})
                });
            });


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
        }
    ]);


    function openDialog($scope, $filter, $mdDialog, Bill, categories, accounts){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'modules/bill/views/new-bill-template.html',
            parent: angular.element(document.body),
            locals: {
                categories: categories,
                accounts: accounts
            },
            clickOutsideToClose:true
        }).then(function(newBill){

            new Bill(newBill).$new(function(budget){
                setCurrentBudget($scope, $filter, budget);
                addSuccess($scope);
            });
        });
    }

    function DialogController($scope, $filter, $mdDialog, categories, accounts, Utils) {
        $scope.subCategories = categories;
        $scope.accounts = accounts;

        $scope.newBill = {events: 1}

        $scope.querySearch = function(query){
            return $filter('filter')($scope.subCategories, query);
        }

        $scope.events = [];
        for (var i=1;i<=12;i++){
            $scope.events.push({id: i, name: i + 'x'})
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.submit = function() {
            $scope.newBill.amount = Utils.currencyToNumber($scope.newBill.amount);

            angular.forEach(accounts, function(account){
                if (account.id == $scope.newBill.accountTo.id){
                    $scope.newBill.accountTo = account;
                }

                if ($scope.newBill.accountFrom && account.id == $scope.newBill.accountFrom.id){
                    $scope.newBill.accountFrom = account;
                }
            });

            $mdDialog.hide($scope.newBill);
        };
    }

    function selectBills($scope, $filter){
        var selectedDate = getFormattedMonth($filter, $scope.currentMonth);

        if (selectedDate){
            $scope.selectedBills = $scope.billsHash[selectedDate];
        }

        $scope.income = 0.0;
        $scope.expenses = 0.0;
        $scope.accTotal = {
            CKA: 0.0,
            CCA: 0.0,
            others: 0.0
        }
        angular.forEach($scope.selectedBills, function(bill){
            if (bill.amount < 0) {
                $scope.expenses += (bill.amount*-1);
            } else {
                $scope.income += bill.amount;
            }

            if ($scope.accTotal[bill.accountTo.type] != undefined) {
                $scope.accTotal[bill.accountTo.type] += bill.amount;
            } else {
                $scope.accTotal.others += bill.amount;
            }
        });
    }


    function addBillHash($scope, $filter, bill){
        var key = getFormattedMonth($filter, bill.date);

        if (!$scope.billsHash[key]){
            $scope.billsHash[key] = [];
        }

        $scope.billsHash[key].push(bill);
    }

    function setCurrentBudget($scope, $filter, budget){
        $scope.budget = budget;

        // reset controls
        $scope.billsHash = [];


        // Use CalendarData to setup the bills in the correct date.
        angular.forEach(budget.bills, function(bill){
            addBillHash($scope, $filter, bill)
        });
        selectBills($scope, $filter);
    }

    function getFormattedDate($filter, date){
        return $filter('date')(date, 'yyyy/MM/dd');
    }

    function getFormattedMonth($filter, date){
        return $filter('date')(date, 'yyyy/MM');
    }
});