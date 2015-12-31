define([ 'app' ], function(app) {
	app.controller('DashboardController', ['$rootScope', '$scope', '$timeout',
	function($rootScope, $scope, $timeout) {
	$rootScope.appContext.contextPage = 'Dashboard';

        $scope.dashboard = {};
        $scope.dashboard.todoList = {text: null}
        $scope.dashboard.todos = [
            {done: false, description: 'Planejamento Estratégico 2016'},
            {done: true, description: 'Verificar valor do seguro do golzim e lançar'},
            {done: false, description: 'Movimentar saldo de 2015 para Maxime DI - Melhor opção?'}
        ]

        $scope.addTodo = function(){
            $scope.dashboard.todos.push({done:false, description:$scope.todoList.text});
            $scope.dashboard.todoList.text = null;
        }
	}]);
});