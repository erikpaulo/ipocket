define(['./module'
        , '../services/bill-resources'
        , '../../categorization/services/subcategory-resources'
        , '../../account/services/account-resources'
        , '../../shared/services/utils-service'],

        function (app) {

	app.controller('BillController', ['$scope', '$filter', '$http', '$timeout', '$mdBottomSheet', '$mdDialog', 'MaterialCalendarData', 'BillResource', 'SubCategoryResource', 'AccountResource', 'Utils',
        function($scope, $filter, $http, $timeout, $mdBottomSheet, $mdDialog, MaterialCalendarData, Bill, SubCategory, Account, Util) {
            $scope.appContext.contextPage = 'Pagamentos Programados';
            $scope.appContext.contextMenu.setActions([
                {icon: 'add_circle', tooltip: 'Novo Pagamento', onClick: function() {
                    openDialog($scope, $filter, $mdDialog, MaterialCalendarData, Bill, $scope.subCategories, $scope.accounts);
               }},
               {icon: 'insert_chart', tooltip: 'Gráfico de Projeção', onClick: function() {
                    $mdBottomSheet.show({
                        templateUrl: 'modules/bill/views/bills-projection-template.html',
                        controller: 'ChartBottomSheetCtrl'
                    });
               }}
            ]);

            $scope.querySearch = function(query){
                return $filter('filter')($scope.subCategories, query);
            }

            // gets all bills
            $scope.billsHash = [];
            Bill.listAll(function(bills){

                // Use CalendarData to setup the bills in the correct date.
                var billsHash = [];
                angular.forEach(bills, function(bill){
                    addBillHash($scope, $filter, MaterialCalendarData, bill)
                });
                selectBills($scope, $filter);
            });

            // To select a single date, make sure the ngModel is not an array.
            $scope.selectedDate = null;
            $scope.currentMonth = getFormattedMonth($filter, new Date());

            $scope.label = "";
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

                billToSave.$save(function(data){
                    angular.extend(bill, data);
                    bill.edit = false;
                    $scope.inEdit = null;

                    addSuccess($scope);
                });
            }

            $scope.delete = function(bill){
                bill.date = new Date(bill.date);

                new Bill(bill).$delete(function(){
                    var billsThisDay = $scope.billsHash[getFormattedDate($filter, bill.date)];
                    for (var i in billsThisDay){
                        if (billsThisDay[i].id == bill.id){
                            billsThisDay.splice(i,1);
                        }
                    }

                    // if there is no more bills in this day, remove the icon from calendar.
                    if (billsThisDay.length ==0){
                        MaterialCalendarData.data[MaterialCalendarData.getDayKey(bill.date)] = "";
                        delete $scope.billsHash[getFormattedDate($filter, bill.date)];
                    }

                    selectBills($scope, $filter);

                    addSuccess($scope);
                });
            }

            // select one day of the calendar
            $scope.dayClick = function(date) {
                if ($scope.inEdit) $scope.cancel($scope.inEdit.bill);
                selectBills($scope, $filter);
            };

            // select one day of the calendar
            $scope.monthClick = function(date) {
                if ($scope.inEdit) $scope.cancel($scope.inEdit.bill);
                $scope.selectedDate = null;
                $scope.currentMonth = getFormattedMonth($filter, new Date( date.year +'/'+ date.month +'/01' ))
                selectBills($scope, $filter);
            };

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
//                    {name:"Acumulado", data:[1200,2776,3121,7653,12653, 18085, 20430, 24214, 24448, 24641, 32276, 34276],id:"series-0"},
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
//                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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


    function openDialog($scope, $filter, $mdDialog, MaterialCalendarData, Bill, categories, accounts){
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

            new Bill(newBill).$new(function(data){
                var bills = data.relatedBills;
                bills.push(data);

                angular.forEach(bills, function(bill){
                    bill.date = new Date(bill.date);
                    addBillHash($scope, $filter, MaterialCalendarData, bill)
                });
                selectBills($scope, $filter)

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
        var selectedDate = getFormattedDate($filter, $scope.selectedDate);

        if (selectedDate){
            $scope.selectedBills = $scope.billsHash[selectedDate];
            $scope.label = $filter('date')($scope.selectedDate, 'dd/MM/yyyy')
        } else {
            $scope.selectedBills = [];

            for (var date in $scope.billsHash){
                if ( $scope.currentMonth == getFormattedMonth($filter, new Date(date)) ){
                    $scope.selectedBills = $scope.selectedBills.concat($scope.billsHash[date])
                }
            }
            $scope.selectedBills = $filter('orderBy')($scope.selectedBills, 'date', false);
            $scope.label = $filter('date')(new Date($scope.currentMonth+'/01'), 'MMMM/yyyy')
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


    function addBillHash($scope, $filter, MaterialCalendarData, bill){
        var key = getFormattedDate($filter, bill.date);

        if (!$scope.billsHash[key]){
            $scope.billsHash[key] = [];
            MaterialCalendarData.setDayContent(new Date(bill.date), 'content');
        }

        $scope.billsHash[key].push(bill);
    }

    function getFormattedDate($filter, date){
        return $filter('date')(date, 'yyyy/MM/dd');
    }

    function getFormattedMonth($filter, date){
        return $filter('date')(date, 'yyyy/MM');
    }
});