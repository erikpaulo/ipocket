define(['./module'], 
function (module) {
	
	module.factory('BudgetResource', function($resource) {
	    return $resource(
	        'api/budget/:id', 
	        {id: '@id'}, 
	        {
	            listAll:	{ method:'GET',  params: {}, isArray: true },
	            save:		{ method:'POST', params: {}, isArray: false},
	            get:		{ method:'GET',  params: {}, isArray: false}
	        }
	    );
	});

});	