/* Index Module */
define(['angular-resource', 'jquery'], function (resource, $) {

    var IndexModule = angular.module('IndexModule', ['ngResource']);
    
    IndexModule.factory('AppContext',
	function() {
        var scope = null;
        var location = null;
        var timeout = null;
        var sideBarService = null;
        var warnings = [], errors = [];

        var context = {

            init: function($scope, $location, $timeout, $mdSidenav, $mdToast){
                scope = $scope;
                location = $location;
                timeout = $timeout;
                sideBarService = $mdSidenav;

                scope.$watch('appContext.contextMenu.isOpen', function(newValue, oldValue) {
                    if (newValue){
                        scope.appContext.contextMenu.icon = 'remove';
                    } else {
                        scope.appContext.contextMenu.icon = 'add';
                    }
                });

                $scope.$watch('appContext.toast.$warnings.length', function(newValue, oldValue){
                    if (scope.appContext.toast.$warnings.length > 0){
                        var msg = scope.appContext.toast.$warnings.join('\n');

                        var toast = $mdToast.simple()
                            .textContent(msg)
                            .parent(angular.element('#main-content'))
                            .hideDelay(3000);

                        $mdToast.show(toast);

                        scope.appContext.toast.$warnings = [];
                    }
                });

                $scope.$watch('appContext.toast.$errors.length', function(newValue, oldValue){
                    if (scope.appContext.toast.$errors.length > 0) {
                    var msg = scope.appContext.toast.$errors.join('\n');

                        var toast = $mdToast.simple()
                            .textContent(msg)
                            .parent(angular.element('#main-content'))
                            .theme("error-toast")
                            .action('OK')
                            .hideDelay(false);

                        $mdToast.show(toast);
                        scope.appContext.toast.$errors = [];
                    }
                });
            },
            contextMenu: {
                actions: [],
                setActions: function(acts){
                    this.actions = [];

                    timeout(function() {
                        scope.appContext.contextMenu.actions = acts;
                    },0);
                },
                icon: 'add',
                isOpen: false
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
            toast: {
                $warnings: [],
                $errors: [],
                addWarning: function(warn){
                    this.$warnings.push(warn)
                },
                addError: function(err){
                    this.$errors.push(err);
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

	IndexModule.controller('IndexController', ['$rootScope', '$scope', '$location', '$timeout', '$mdSidenav', '$mdDialog', '$mdToast', 'AuthService', 'ErrorHandler',
	    function($rootScope, $scope, $location, $timeout, $mdSidenav, $mdDialog, $mdToast, AuthService, ErrorHandler){
            $scope.appContext.init($scope, $location, $timeout, $mdSidenav, $mdToast);
	        $scope.appContext.contextPage = 'Entrada'

            AuthService.getUser().then(function(user){
                $scope.appContext.currentUser = user;
                if (!$scope.appContext.currentUser.authenticated){
                    $location.path('login');
                } else {
//                    $location.path('dashboard');
                }
            });

            $scope.handleClick = function(action){
                action.onClick();
            }

            $scope.logout = function(){
                window.location = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) + 'signout';
            }
        }
    ]);

    return IndexModule;
});

function addWarning($scope, msg){
    $scope.appContext.toast.addWarning(msg);
}

function addSuccess($scope){
    addWarning($scope, 'Operação realizada com sucesso.');
}

function addError($scope, msg, err){
    $scope.appContext.toast.addError(msg);
    console.log('message: '+ (err ? err.data.message : ''));
}