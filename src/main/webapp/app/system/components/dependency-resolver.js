define([], function() {
    return function(dependencies) {
        var definition = {
            resolver: ['$q','$rootScope', '$http', function($q, $rootScope, $http) {
                var deferred = $q.defer();

                require(dependencies, function() {
                	//If the promise is not resolved inside the $apply method of the $rootScope, 
                	// the route will not be rendered on the initial page load.
                	
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }]
        }

        return definition;
    }
});