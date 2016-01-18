define(['./module'
        , '../services/bill-resources'
        , '../services/bill-entry-resources'
        , '../../configuration/services/category-resources'
        , '../../account/services/account-resources'
        , '../../shared/services/utils-service'],

        function (app) {

	app.controller('BillController', ['$scope', '$filter', '$http', '$q', '$timeout', '$mdBottomSheet', 'MaterialCalendarData', 'BillResource', 'CategoryResource', 'AccountResource', 'Utils',
        function($scope, $filter, $http, $q, $timeout, $mdBottomSheet, MaterialCalendarData, Bill, Category, Account, Util) {
            $scope.appContext.contextPage = 'Pagamentos Programados';
            $scope.appContext.contextMenu.setActions([
                {icon: 'add_circle', tooltip: 'Novo Pagamento', onClick: function() {
                    openDialog($scope, $mdDialog);
               }},
               {icon: 'insert_chart', tooltip: 'Gráfico de Projeção', onClick: function() {
                    $mdBottomSheet.show({
                        templateUrl: 'modules/bill/views/bills-projection-template.html',
                        controller: 'ChartBottomSheetCtrl'
                    });
               }}
            ]);

            $scope.billsHash = [];
            $scope.selectedBills = [];
            var today = new Date();

            // gets all bills
            Bill.listAll(function(bills){

                // Use CalendarData to setup the bills in the correct date.
                var billsHash = [];
                angular.forEach(bills, function(bill){
                    if (!$scope.billsHash[bill.date]) $scope.billsHash[bill.date] = [];

//                    $scope.billsHash[bill.date].content += content + '<br>';
                    $scope.billsHash[bill.date].push(bill);
                });

                // iterate over the hash, setting the bills on the calendar
                for (var date in $scope.billsHash){
                    MaterialCalendarData.setDayContent(new Date(date), '<md-icon class="material-icons">event</md-icon>');
                    $scope.selectedBills = $scope.selectedBills.concat($scope.billsHash[date])
                }
            });

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
                var billsThisDay = $scope.billsHash[$scope.selectedDate];
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
            }

            // select one day of the calendar
            $scope.dayClick = function(date) {
                $scope.selectedBills = null
                if ($scope.billsHash[$scope.selectedDate]) $scope.selectedBills = $scope.billsHash[date];
            };

            // To select a single date, make sure the ngModel is not an array.
            $scope.selectedDate = new Date();

            // If you want multi-date select, initialize it as an array.
//            $scope.selectedDate = null;

//            $scope.firstDayOfWeek = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.
//            $scope.setDirection = function(direction) {
//              $scope.direction = direction;
//              $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
//            };


            $scope.prevMonth = function(data) {
              $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
            };

            $scope.nextMonth = function(data) {
              $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
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
});

function openDialog($scope, $mdDialog){
   $mdDialog.show({
       controller: DialogController,
       templateUrl: 'modules/account/views/new-bill-template.html',
       parent: angular.element(document.body),
       clickOutsideToClose:true
   }).then(function(newAccount){

        //TODO: Criar pagamento no server.
        angular.forEach($scope.summary.types, function(type){
            if (type.type == newAccount.type){
                newAccount.balance = newAccount.startBalance;
                type.accounts.push(newAccount);
                type.balance += newAccount.startBalance;
            }
        });
        $scope.summary.balance += newAccount.startBalance;

        $scope.appContext.toast.addWarning('Conta '+ newAccount.name +' incluída com sucesso!');
   });
}

function DialogController($scope, $mdDialog, Utils, Constants) {
    $scope.accountTypes = Constants.ACCOUNT.TYPE;

    $scope.newAccount = {};

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        $scope.newAccount.startBalance = Utils.currencyToNumber($scope.newAccount.startBalance);
        $mdDialog.hide($scope.newAccount);
    };
}