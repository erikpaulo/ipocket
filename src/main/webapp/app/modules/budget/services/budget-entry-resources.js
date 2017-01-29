define(['./module'], 
function (module) {
	
	module.factory('BudgetEntryResource', ['$resource', function($resource) {
	    return $resource(
	        'api/budget/entry/:id/:action',
	        {id: '@id'},
	        {
	            new:	  { method : 'POST',  params: {}, isArray : false  }
	        }
	    );

	}]);

});	