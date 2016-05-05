define(['./module',
        '../../shared/services/utils-service'], function (app) {

	app.controller('InvestmentController', ['$scope', '$location', '$mdDialog', 'Constants', 'Utils', 'InvestmentResource',
        function($scope, $location, $mdDialog, Constants, Utils, Investment) {
            $scope.appContext.contextPage = 'Investimentos';
            $scope.appContext.contextMenu.setActions([
                {icon: 'add_circle', tooltip: 'Novo Investimento', onClick: function() {
                    openDialog($scope, $mdDialog, Utils, Constants);
               }}
            ]);

            $scope.load = function(){
                Investment.summary(function(data){
                    $scope.summary = data;
                });
            }
            $scope.load();

            $scope.detail = function(investment){
                $location.path('/investment/'+ investment.type +'/'+ investment.id +'/entries');
            }

            function openDialog($scope, $mdDialog, Constants){
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'modules/investment/views/new-investment-template.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true
                }).then(function(newInvestment){
                    new Investment(newInvestment).$save(function(data){
                        $scope.load();
                        addWarning($scope, 'Investimento registrado com sucesso!');
                    }, function(err){
                        addError($scope, 'Não foi possível registrar novo investimento.', err);
                    });
                });
            }

        }
	]);

    function DialogController($scope, $mdDialog, Utils, Constants) {
        $scope.investmentTypes = Constants.INVESTMENT.TYPE;

        $scope.newInvestment = {};

//        $scope.updateQtdQuotes = function(){
//            var entry = $scope.newInvestment.entries[0];
//            entry.amount = Utils.currencyToNumber(entry.amount);
//            if (entry.amount > 0 &&  $scope.newInvestment.quoteValue > 0){
//              entry.qtdQuotes  = (entry.amount / $scope.newInvestment.quoteValue)
//            }
//        }

        $scope.hide = function() {
            $mdDialog.cancel();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.submit = function() {
            $mdDialog.hide($scope.newInvestment);
        };
    }
});

