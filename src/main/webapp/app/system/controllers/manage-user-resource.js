define(['app'], function (module) {
	/**
	 * Service ManageUserRestService
	 * 
	 */
	module.factory('ManageUser', function($resource) {
	    return $resource(
	        'api/admin/users/:action:userId/:userAction', 
	        { userId : '@userId' }, 
	        {
	            list             : { method : 'GET',  params : {action : 'list'}, isArray : true },
	            get              : { method : 'GET' },
	            lock             : { method : 'PUT',  params : {userAction : 'lock'} },
	            unlock           : { method : 'PUT',  params : {userAction : 'unlock'} },
	            trust            : { method : 'PUT',  params : {userAction : 'trust'} },
	            untrust          : { method : 'PUT',  params : {userAction : 'untrust'} },
	            addAuthorRole    : { method : 'PUT',  params : {userAction : 'addAuthorRole'} },
	            removeAuthorRole : { method : 'PUT',  params : {userAction : 'removeAuthorRole'} }
	        }
	    );
	});
});