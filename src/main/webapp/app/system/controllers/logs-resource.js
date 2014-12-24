define(['app'], function (module) {
	/**
	 * Service LogsResource
	 * 
	 */
	
	module.factory('LogsService', ['$resource',
    function ($resource) {
        return $resource('api/admin/logs', {}, {
            'findAll': { method: 'GET', isArray: true},
            'changeLevel':  { method: 'PUT'}
        });
    }]);
});		