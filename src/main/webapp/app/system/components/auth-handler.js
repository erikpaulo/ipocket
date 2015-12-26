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
		    }
		);

	}]);

	AuthHandler.factory('AuthService', function($resource) {
		return $resource('public/user/:action', {},
				{
					authenticate: { method: 'POST', params: {'action' : 'authenticate'} },
					register: { method: 'POST', params: {'action' : 'register'} },
					current: { method: 'GET', params: {'action' : 'current'} }
				}
			);
	});

	AuthHandler.factory('UserService', ['$rootScope', '$q', '$cookieStore', 'AuthService',
        function($rootScope, $q, $cookieStore, AuthService) {

            return {
                currentUser: function(){
                    var deferred = $q.defer();

                    var authToken = $cookieStore.get('authToken');
                    if (authToken !== undefined) {
                        $rootScope.authToken = authToken;
                    }

                    AuthService.current( function(user) {
                        console.log('  user authenticated, is '+(user.admin? '' : 'NOT ')+ 'admin');
                        $rootScope.user = user

                        deferred.resolve(user);
                    }, function(err){
                        console.log('  user is not authenticated, add social signin menu.');
                        deferred.reject(err);
                    });


                    return deferred.promise;
                }
            }
	    }
	]);
	
	
	AuthHandler.run(function($rootScope, $location, $cookieStore, AuthService) {
			
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

	AuthHandler.controller('AuthController', [ '$scope', '$rootScope', '$location', '$cookieStore', 'AuthService', 'MessageHandler',
    function($scope, $rootScope, $location, $cookieStore, AuthService, MessageHandler) {
		
		MessageHandler.clear();
		
		$scope.messageHandler = MessageHandler;

		$scope.user = {$error: {}, rememberMe: false}
		
		$scope.go = function(link) {
			window.location = link;
		}
		
		$scope.appAuthenticate = function() {
			MessageHandler.clear();
			if ($scope.loginForm.$valid) {
				var service = new AuthService({email: $scope.user.email,
				                               password: $scope.user.password,
				                               rememberMe: $scope.user.rememberMe});
				
				service.$authenticate(function(result) {
                    $rootScope.authToken = result.token;
//                    if ($scope.user.rememberMe) {
//                        $cookieStore.put('authToken', authToken);
//                    }

                    // recupera o contextpath da aplicacao
                    var path = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
                    // força o redirect para recarregar novamente o IndexController
                    window.location = path;
				}, function (error) {
				    $scope.user.$error = {login: true};
				});
			} else {
				MessageHandler.addError({message: "Formulário possiu erros. Preencha os dados corretamente e tente novamente."});
			}

		};

		$scope.googleTokenAuthenticate = function (tokenId){
		    var service = new AuthService({googleTokenId: tokenId.token, rememberMe: $scope.user.rememberMe});

		    service.$authenticate(function(result) {
                $rootScope.authToken = result.token;
                // recupera o contextpath da aplicacao
                var path = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
                // força o redirect para recarregar novamente o IndexController
                window.location = path;
		    }, function (err){
		        $scope.user.$error = {login: true};
		    });
		}

		var authenticate = function (auth){
		}
		
		$scope.register = function() {
			MessageHandler.clear();
			if ($scope.registerForm.$valid) {
				var service = new AuthService({displayName: $scope.displayName, password: $scope.password, email: $scope.email});
				
				service.$register(function(result) {
					$rootScope.authToken = result.token;;
					// recupera o contextpath da aplicacao
					var path = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
					// força o redirect para recarregar novamente o IndexController
					window.location = path;
				});
			} else {
				MessageHandler.addError({message: "Formulário possiu erros. Preencha os dados corretamente e tente novamente."});
			}
			
		}
	}]);
	
	
	return AuthHandler;
});

function teste(){
console.log('teste success')
}