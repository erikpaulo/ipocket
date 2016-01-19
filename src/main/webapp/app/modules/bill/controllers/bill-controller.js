define(['./module'
        , '../services/bill-resources'
        , '../services/bill-entry-resources'
        , '../../configuration/services/category-resources'
        , '../../account/services/account-resources'
        , '../../shared/services/utils-service'],

        function (app) {

	app.controller('BillController', ['$scope', '$filter', '$http', '$timeout', '$mdBottomSheet', '$mdDialog', 'MaterialCalendarData', 'BillResource', 'CategoryResource', 'AccountResource', 'Utils',
        function($scope, $filter, $http, $timeout, $mdBottomSheet, $mdDialog, MaterialCalendarData, Bill, Category, Account, Util) {
            $scope.appContext.contextPage = 'Pagamentos Programados';
            $scope.appContext.contextMenu.setActions([
                {icon: 'add_circle', tooltip: 'Novo Pagamento', onClick: function() {
                    openDialog($scope, $mdDialog, MaterialCalendarData, $scope.categories, $scope.accounts);
               }},
               {icon: 'insert_chart', tooltip: 'Gráfico de Projeção', onClick: function() {
                    $mdBottomSheet.show({
                        templateUrl: 'modules/bill/views/bills-projection-template.html',
                        controller: 'ChartBottomSheetCtrl'
                    });
               }}
            ]);

            // gets all bills
            $scope.billsHash = [];
            Bill.listAll(function(bills){

                // Use CalendarData to setup the bills in the correct date.
                var billsHash = [];
                angular.forEach(bills, function(bill){
                    addBillHash($scope, MaterialCalendarData, bill)
                });
            });

            // To select a single date, make sure the ngModel is not an array.
            $scope.selectedDate = null;

            $scope.label = "";
            $scope.selectedBills = null;
            selectBills($scope, $filter);

            // gets all configured categories
            Category.listAll(function(categories){
                $scope.categories = categories;
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
                $scope.inEdit = angular.copy(bill);
                $scope.inEdit.bill = bill;
            }

            $scope.cancel = function(bill){
                bill.edit = false
                $scope.inEdit = null;
            }

            $scope.save = function(bill){
                $scope.inEdit.amount = Util.currencyToNumber($scope.inEdit.amount);
                delete $scope.inEdit.bill;

                // get the correct category entity
                angular.forEach($scope.categories, function(category){
                    if (category.id == $scope.inEdit.category.id){
                        $scope.inEdit.category = angular.copy(category);
                    }
                })

                // get entities of selected accounts
                angular.forEach($scope.accounts, function(account){
                    if (account.id == $scope.inEdit.accountTo.id){
                        $scope.inEdit.accountTo = angular.copy(account);
                    }
                    if ($scope.inEdit.accountFrom && account.id == $scope.inEdit.accountFrom.id){
                        $scope.inEdit.accountFrom = angular.copy(account);
                    }
                });
                angular.extend(bill, $scope.inEdit);

                //TODO: send the edited bill to the server.
                $scope.inEdit = null;
                bill.edit = false;
            }

            $scope.delete = function(bill){
                //TODO: delete this bill on server
                var billsThisDay = $scope.billsHash[bill.date];
                for (var i in billsThisDay){
                    if (billsThisDay[i].id == bill.id){
                        billsThisDay.splice(i,1);
                    }
                }

                // if there is no more bills in this day, remove the icon from calendar.
                if (billsThisDay.length ==0){
                    MaterialCalendarData.data[MaterialCalendarData.getDayKey($scope.selectedDate)] = "";
                    delete $scope.billsHash[$scope.selectedDate];
                }

                selectBills($scope, $filter);
            }

            // select one day of the calendar
            $scope.dayClick = function(date) {
                if ($scope.inEdit) $scope.cancel($scope.inEdit.bill);
                selectBills($scope, $filter);
            };

	    }
	]);

    app.controller('ChartBottomSheetCtrl', function($scope, $timeout, $mdBottomSheet) {
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
                    {name:"Acumulado", data:[1200,2776,3121,7653,12653, 18085, 20430, 24214, 24448, 24641, 32276, 34276],id:"series-0"},
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
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    });

    function openDialog($scope, $mdDialog, MaterialCalendarData, categories, accounts){
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

            //TODO: Criar pagamento no server.
            addBillHash($scope, MaterialCalendarData, newBill)
            $scope.appContext.toast.addWarning('Pagamento incluído com sucesso!');
        });
    }

    function DialogController($scope, $mdDialog, categories, accounts, Utils) {
        $scope.categories = categories;
        $scope.accounts = accounts;

        $scope.newBill = {events: 1}

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
            $mdDialog.hide($scope.newBill);
        };
    }

    function selectBills($scope, $filter){
        var today = new Date();

        if ($scope.selectedDate){
            $scope.selectedBills = $scope.billsHash[$scope.selectedDate];
            $scope.label = $filter('date')($scope.selectedDate, 'dd/MM/yyyy')
        } else {
            $scope.selectedBills = [];

            for (var date in $scope.billsHash){
                var date = new Date(date);

                // as a first load, verify if this bill belongs to current month.
                if (date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()){
                    $scope.selectedBills = $scope.selectedBills.concat($scope.billsHash[date])
                }
            }
            $scope.selectedBills = $filter('orderBy')($scope.selectedBills, 'date', false);
            $scope.label = $filter('date')(today, 'MMMM/yyyy')
        }
    }


    function addBillHash($scope, MaterialCalendarData, bill){
        if (!$scope.billsHash[bill.date]){
            $scope.billsHash[bill.date] = [];
            MaterialCalendarData.setDayContent(new Date(bill.date), 'content');
        }

        $scope.billsHash[bill.date].push(bill);
    }
});