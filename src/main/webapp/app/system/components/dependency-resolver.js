define([], function() {
    return function(dependencies) {
        var definition = {
            resolver: ['$q','$rootScope', '$http', function($q, $rootScope, $http) {
                var deferred = $q.defer();

                require(dependencies, function() {
                	//If the promise is not resolved inside the $apply method of the $rootScope, 
                	// the route will not be rendered on the initial page load.
                	
//                	see link: https://github.com/matys84pl/angularjs-requirejs-lazy-controllers/blob/master/app/js/utils/route-config.js
//                	var controller = arguments[0],
//                    template = arguments[1];                	
//                	$controllerProvider.register(controllerName, controller);
//                    html = template;
//                    defer.resolve();
//                    $rootScope.$apply()
                	
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