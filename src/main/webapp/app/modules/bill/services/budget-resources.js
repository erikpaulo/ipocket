define(['./module'], 
function (module) {
	
	module.factory('BudgetResource', ['$resource', function($resource) {
	    return $resource(
	        'api/budget/:id/:action',
	        {id: '@id'},
	        {
	            listNonAllocatedCategories:	  { method : 'GET',  params: {action: 'nonAllocatedCategories'}, isArray : true  },
	            getCurrent: { method : 'GET',  params: {}, isArray : false  },
	            getBudgetFollowUp: { method : 'GET',  params: {action: "followup"}, isArray : false  },
                saveBaseline: { method : 'GET',  params: {action: 'saveBaseline'}, isArray : false }
	        }
	    );

	}]);

});	