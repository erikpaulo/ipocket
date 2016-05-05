define(['./module',
        '../services/account-resources',
        '../../shared/services/constants',
        './account-investment-controller',
        './account-entry-controller',
        '../../shared/services/utils-service'], function (app) {

	app.controller('AccountDetailController', ['$scope', '$routeParams', 'AccountResource', 'Constants',
        function($scope, $routeParams, Account, Constants) {

            new Account({id: $routeParams.accountID}).$get(function(data){
                $scope.account = data;

                if ($scope.account.type == Constants.ACCOUNT.TYPE.INVESTMENT){
                    $scope.detailTemplate = "modules/account/views/account-investment-entry.html";
                } else {
                    $scope.detailTemplate = "modules/account/views/account-entry.html";
                }
            });
        }
	]);
});

