define(['./module'], 
function (module) {
	
	module.factory('InvestmentResource', function($resource) {
	    return $resource(
	        'api/investment/:id/:action',
	        {id: '@id'},
	        {
	            listAll:	{ method :'GET',  params: {}, isArray : true },
	            delete:     { method :'DELETE',  params: {}, isArray : true },
	            get:		{ method :'GET',  params: {}, isArray : false },
	            summary:	{ method :'GET',  params: {action: 'summary'}, isArray : false },
	            statement:	{ method :'GET',  params: {action: 'statement'}, isArray : false },
	            updateIndex:{ method :'POST',  params: {action: 'updateIndex'}, isArray : false }
	        }
	    );

	});

});	