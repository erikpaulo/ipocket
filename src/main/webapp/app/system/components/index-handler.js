/* Index Module */
define(['angular-resource', 'jquery'], function (resource, $) {

    var IndexModule = angular.module('IndexModule', ['ngResource']);
    
    IndexModule.factory('AppContext',
	function() {
        var scope = null;
        var location = null;
        var sideBarService = null;

        var context = {

            init: function($scope, $location, $mdSidenav){
                scope = $scope;
                location = $location;
                sideBarService = $mdSidenav;

                scope.$watch('appContext.contextMenu.isOpen', function(newValue, oldValue) {
                    if (newValue){
                        scope.appContext.contextMenu.icon = 'remove';
                    } else {
                        scope.appContext.contextMenu.icon = 'add';
                    }
                });
            },
            contextMenu: {
                actions: [],
                icon: 'add',
                isOpen: false,
                watchMenuState: function(){
                }
            },
            sidebarMenu: {
                handleClick: function(url){
                    sideBarService('left').close();
                    location.path(url);
                },
                toggleSidenav: function(menuId) {
                   sideBarService(menuId).toggle();
                }
            },
            currentUser: null
        };

	    return context;
	});

	IndexModule.run(function ($rootScope, AppContext) {
		$rootScope.modules = [];

        $.ajax({dataType: "json", url: 'modules/routes.json', async: false}).done( function(json) {
      		$rootScope.modules = json;
      	});

	    // adiciona o contexto o $scope
	    $rootScope.appContext = AppContext;
	});

	IndexModule.controller('IndexController', ['$rootScope', '$scope', '$location', '$mdSidenav', '$mdDialog', 'AuthService',
	    function($rootScope, $scope, $location, $mdSidenav, $mdDialog, AuthService){
            $scope.appContext.init($scope, $location, $mdSidenav);

            AuthService.getUser().then(function(user){
                $scope.appContext.currentUser = user;
                if (!$scope.appContext.currentUser || !$scope.appContext.currentUser.authenticated){
                    $location.path('login');
                }
            });

            $scope.logout = function(){
                window.location = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) + 'signout';
            }

            $scope.appContext.contextMenu.actions = [
                { name: 'add_location', action:'', description: 'Adicionar'}, {name: 'directions_boad', action: '', description: 'Remover'}, {name: 'directions_bike', action:'', description: 'Importar CSV'}];

        }
    ]);

    return IndexModule;
});