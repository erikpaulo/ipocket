define([],
function () {

	var InterceptorModule = angular.module('InterceptorModule', []);
	

    InterceptorModule.factory('progressLinear', function($rootScope, $q) {
        var progressLinear = {
            request: function(config) {
                if (isRestCall(config))
                    $rootScope.ajaxCompleted = false;
                return config;
            },
             response: function(response) {
                if (isRestCall(response.config))
                    $rootScope.ajaxCompleted = true;
                return response;
            },
            requestError: function(rejection){
               if (isRestCall(rejection.config))
                   $rootScope.ajaxCompleted = true;

                return $q.reject(rejection);
            },
            responseError: function(rejection) {
               if (isRestCall(rejection.config))
                   $rootScope.ajaxCompleted = true;
                return $q.reject(rejection);
            }
        };
        return progressLinear;
    });


    InterceptorModule.factory('defaultMessage', function($rootScope, $q) {
        var defaultMessage = {
            responseError: function(rejection) {
               if (isRestCall(rejection.config))
                    addError($rootScope, 'Problemas para concluir operação.', rejection);
                return $q.reject(rejection);
            }
        };
        return defaultMessage;
    });

    function isRestCall(config){
        return (config.url.indexOf('api') == 0 || config.url.indexOf('public') == 0);
    }

    InterceptorModule.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('progressLinear');
        $httpProvider.interceptors.push('defaultMessage');
    }]);

    return InterceptorModule;
});