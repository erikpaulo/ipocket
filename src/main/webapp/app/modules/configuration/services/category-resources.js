define(['./module'], 
function (module) {
	
	module.factory('CategoryResource', function($resource) {
	    return $resource(
	        'api/configuration/category/:id/', 
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