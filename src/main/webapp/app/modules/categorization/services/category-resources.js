define(['./module'], 
function (module) {
	
	module.factory('CategoryResource', ['$resource','$q', function($resource, $q) {
	    return $resource(
	        'api/categorization/:id/',
	        {id: '@id'},
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true },
	            new: 		{ method : 'POST', params: {}, isArray : false },
	            delete: 	{ method : 'DELETE', params: {}, isArray : false },
	            save: 		{ method : 'PUT', params: {}, isArray : false }
	        }
	    );
	}]);

});	