define(['./module'], 
function (module) {
	
	module.factory('BillEntryResource', function($resource) {
	    return $resource(
	        'api/bill/:billId/entries/:id/:action', 
	        {id: '@id', billId: '@billId'}, 
	        {
	        	register:	{ method : 'POST',  params: {action: 'register'}, isArray : false},
	            skip:		{ method : 'POST',  params: {action: 'skip'}, isArray : false},
	            save:		{ method : 'POST',  params: {}, isArray : false},
	        }
	    );
	});

});	