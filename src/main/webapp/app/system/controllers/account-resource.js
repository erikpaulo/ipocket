define(['app'], function (module) {
/**
 * Resource para com.softb.system.security.webAccountRestService
 */
	module.factory('Account', function($resource) {
	    return $resource(
	        'api/accounts/:action', 
	        { provider : '@provider' }, 
	        {
	        	overview : { method : 'GET', params : {action : 'overview'} },
	            getProfile : { method : 'GET', params : {action : 'profile'} },
	            updateProfile : { method : 'PUT', params : {action : 'profile'} },
	            useSocialImage : { method : 'PUT', params : {action : 'useSocialImage'} }
	        }
	    );
	});
});	