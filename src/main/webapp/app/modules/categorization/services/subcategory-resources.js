define(['./module'], 
function (module) {
	
	module.factory('SubCategoryResource', ['$resource', function($resource) {
	    return $resource(
	        'api/categorization/category/:categoryId/subcategory/:id/',
	        {categoryId: '@categoryId', id: '@id'},
	        {
	            listAll:	{ method : 'GET', params: {categoryId: 'all'}, isArray : true },
	            new: 		{ method : 'POST', params: {}, isArray : false },
	            delete: 	{ method : 'DELETE', params: {}, isArray : false },
	            save: 		{ method : 'PUT', params: {}, isArray : false }
	        }
	    );
	}]);

});	