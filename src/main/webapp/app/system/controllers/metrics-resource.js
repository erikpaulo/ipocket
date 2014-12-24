define(['app'], function (module) {

	
	module.factory('MetricsService', ['$resource',
	    function ($resource) {
	        return $resource('metrics/metrics', {}, {
	            'get': { method: 'GET'}
	        });
    }]);
	
	module.factory('ThreadDumpService', ['$http',
	    function ($http) {
	        return {
	            dump: function() {
	                var promise = $http.get('dump').then(function(response){
	                    return response.data;
	                });
	                return promise;
	            }
	        };
    }]);
	
	module.factory('HealthCheckService', ['$rootScope', '$http',
	    function ($rootScope, $http) {
	        return {
	            check: function() {
	                var promise = $http.get('health').then(function(response){
	                    return response.data;
	                });
	                return promise;
	            }
	        };
    }]);

});