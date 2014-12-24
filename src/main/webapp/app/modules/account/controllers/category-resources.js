define(['./module'], 
function (module) {
	
	module.factory('CategoryResource', function($resource) {
	    return $resource(
	        'api/account/category/:categoryId', 
	        {account: '@categoryId'}, 
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true },
	            new: 		{ method : 'POST', params: {}, isArray : false },
	            delete: 	{ method : 'DELETE', params: {}, isArray : false }
	        }
	    );
	});

});	