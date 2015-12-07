define(['./module'], 
function (module) {
	
	module.factory('CategoryGroupResource', function($resource) {
	    return $resource(
	        'api/configuration/categorygroup/:id', 
	        {id: '@id'}, 
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true },
	            new: 		{ method : 'POST', params: {}, isArray : false },
	            delete: 	{ method : 'DELETE', params: {}, isArray : false },
	            save: 		{ method : 'PUT', params: {}, isArray : false }
	        }
	    );
	});

});	