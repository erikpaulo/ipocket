define(['./module'], 
function (module) {
	
	module.factory('CategoryGroupResource', function($resource) {
	    return $resource(
	        'api/configuration/categorygroup/:groupId', 
	        {groupId: '@groupId'}, 
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true },
	            save: 		{ method : 'POST', params: {}, isArray : false },
	            delete: 	{ method : 'DELETE', params: {}, isArray : false }
	        }
	    );
	});

});	