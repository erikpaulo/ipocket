define(['./module'], 
function (module) {
	
	module.factory('CategoryResource', function($resource) {
	    return $resource(
	        'api/configuration/category/:categoryId', 
	        {categoryId: '@categoryId'}, 
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true },
	            new: 		{ method : 'POST', params: {}, isArray : false }//,
//	            delete: 	{ method : 'DELETE', params: {}, isArray : false }
	        }
	    );
	});

});	