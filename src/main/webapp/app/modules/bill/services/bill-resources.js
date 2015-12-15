define(['./module'], 
function (module) {
	
	module.factory('BillResource', function($resource) {
	    return $resource(
	        'api/bill/:id/:action', 
	        {id: '@id'}, 
	        {
	            listAll:			{ method : 'GET',  	params: {}, isArray : true },
	            cashFlowProjection:	{ method : 'POST',  params: {action: 'cashflowprojection'}, isArray : false },
	            save:				{ method : 'POST',  params: {}, isArray : false}
	        }
	    );
	});

});	