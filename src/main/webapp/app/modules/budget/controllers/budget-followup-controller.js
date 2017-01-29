define(['./module'
        , '../../shared/services/utils-service'],

        function (app) {

            app.controller('BudgetFollowUpController', ['$scope', '$location',
                function($scope, $location) {
                    $scope.appContext.contextPage = 'Orçamento';
                    $scope.appContext.contextMenu.setActions([
                        {icon: 'add_circle', tooltip: 'Novo Orçamento', onClick: function() {
                            $location.path('/budget/new');
                        }}
                    ]);
                }
            ]);
        }
);