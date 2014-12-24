define(['angular', 
        'angular-route', 
        'angular-cookies',
        'system/components/error-handler'], 
function (angular, resource, cookie, errorHandler) {

	var AuthHandler = angular.module('AuthHandler', ['ngRoute', 'ngCookies', errorHandler.name]);
	
//	AuthHandler.config([ '$routeProvider', '$locationProvider', '$httpProvider',
//    function($routeProvider, $locationProvider, $httpProvider) {
//			    
//		/* Registers auth token interceptor, auth token is either passed by header or by query parameter
//		 * as soon as there is an authenticated user */
//		$httpProvider.interceptors.push(function ($q, $rootScope, $location) {
//		    return {
//		    	'request': function(config) {
//		    		var isRestCall = (config.url.indexOf('api') == 0 || config.url.indexOf('public') == 0);
//		    		if (isRestCall && angular.isDefined($rootScope.authToken)) {
//		    			var authToken = $rootScope.authToken;
//		    			config.headers['X-Auth-Token'] = authToken;
//		    			//config.url = config.url + "?token=" + authToken;
//		        		}
//		        		return config || $q.when(config);
//		        	}
//		        };
//		    }
//		);
//			   
//	}]);

	AuthHandler.factory('AuthService', function($resource) {
		return $resource('public/user/:action', {},
				{
					authenticate: { method: 'POST', params: {'action' : 'authenticate'} },
					register: { method: 'POST', params: {'action' : 'register'} },
					current: { method: 'GET', params: {'action' : 'current'} }
				}
			);
	});		
	
	
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
		$scope.rememberMe = false;
		
		$scope.go = function(link) {
			window.location = link;
		}
		
		$scope.login = function() {
			MessageHandler.clear();
			if ($scope.loginForm.$valid) {
				var service = new AuthService({email: $scope.email, password: $scope.password});
				
				service.$authenticate(function(result) {
					$rootScope.authToken = result.token;;
					// recupera o contextpath da aplicacao
					var path = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
					// força o redirect para recarregar novamente o IndexController
					window.location = path;
				});
			} else {
				MessageHandler.addError({message: "Formulário possiu erros. Preencha os dados corretamente e tente novamente."});
			}			

		};
		
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