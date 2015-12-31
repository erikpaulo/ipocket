define(['angular', 
        'angular-route', 
        'angular-cookies',
        'system/components/error-handler'], 
function (angular, resource, cookie, errorHandler) {

	var AuthHandler = angular.module('AuthHandler', ['ngRoute', 'ngCookies', errorHandler.name]);
	
	AuthHandler.config([ '$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {

		/* Registers auth token interceptor, auth token is either passed by header or by query parameter
		 * as soon as there is an authenticated user */
		$httpProvider.interceptors.push(function ($q, $rootScope, $location) {
		    return {
		    	'request': function(config) {
		    		var isRestCall = (config.url.indexOf('api') == 0 || config.url.indexOf('public') == 0);
		    		if (isRestCall && angular.isDefined($rootScope.authToken)) {
		    			var authToken = $rootScope.authToken;
		    			config.headers['X-Auth-Token'] = authToken;
		    			//config.url = config.url + "?token=" + authToken;
		        	}
		        	return config || $q.when(config);
		        }
		    };
		});

	}]);

	AuthHandler.factory('UserService', function($resource) {
		return $resource('public/user/:action', {},
				{
					authenticate: { method: 'POST', params: {'action' : 'authenticate'} },
					register: { method: 'POST', params: {'action' : 'register'} },
					current: { method: 'GET', params: {'action' : 'current'} },
					logout: { method: 'GET', params: {'action' : 'logout'} }
				}
			);
	});

	AuthHandler.factory('AuthService', ['$rootScope', '$q', '$location', '$cookieStore', 'UserService',
        function($rootScope, $q, $location, $cookieStore, UserService) {

            function authenticate(service){
                var deferred = $q.defer();

                service.$authenticate(function(result) {
                    window.location = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
                    deferred.resolve(result);
                }, function (err){
                    //@TODO: Adicionar mensagem de erro após serviço pronto.
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            return {
                getUser: function(){
                    var deferred = $q.defer();

                    if ($rootScope.appContext.currentUser == null){
                        UserService.current( function(user) {
                            $rootScope.appContext.currentUser = user

                            deferred.resolve(user);
                        }, function(err){
                            deferred.reject(err);
                        });
                    } else {
                        deferred.resolve(user);
                    }

                    return deferred.promise;
                },
                googleAuthenticate: function ($scope, user, tokenId){
                    var service = new UserService({ googleTokenId: tokenId.token,
                                                    rememberMe: user.rememberMe});

                    authenticate(service).then(function(user){
                        user.isLoggedOnGoogle = true;
                        $scope.appContext.currentUser = user;
                    }, function (error) {
                        //@TODO: Adicionar mensagem de erro após serviço pronto.
                    });

                },
                appAuthenticate: function($scope, user, loginForm) {
                    if (loginForm.$valid) {
                        var service = new UserService({email: user.email,
                                                       password: user.password,
                                                       rememberMe: user.rememberMe});

                        authenticate(service).then(function(user) {
                            user.isLoggedOnGoogle = false;
                            $scope.appContext.currentUser = user;
                        }, function (error) {
                            $scope.user.$error = {login: true};
                        });
                    } else {
                        //MessageHandler.addError({message: "Formulário possiu erros. Preencha os dados corretamente e tente novamente."});
                        //@TODO: Adicionar mensagem de erro após serviço pronto.
                    }

                }
            }
	    }
	]);

	AuthHandler.run(function($rootScope, $location, $cookieStore) {
			
			$rootScope.hasRole = function(role) {
				
				if ($rootScope.user === undefined) {
					return false;
					
				}
				
				if ($rootScope.user.roles[role] === undefined) {
					return false;
				}
				
				return $rootScope.user.roles[role];
			};
			
		});

	AuthHandler.controller('AuthController', [ '$scope', '$rootScope', '$location', 'AuthService',
    function($scope, $rootScope, $location, AuthService) {
		
		$scope.user = {$error: {}, rememberMe: false}

        if ($rootScope.appContext.currentUser && $rootScope.appContext.currentUser.authenticated){
            $location.path('/');
        }

		$scope.go = function(link) {
			window.location = link;
		}

		$scope.appAuthenticate = function(){
		    AuthService.appAuthenticate($scope, $scope.user, $scope.loginForm);
		}

		$scope.googleAuthenticate = function (tokenId){
		    AuthService.googleAuthenticate($scope, $scope.user, tokenId);
		    AuthService.googleAuth2 = tokenId.auth2;
		}
	}]);
	
	
	return AuthHandler;
});