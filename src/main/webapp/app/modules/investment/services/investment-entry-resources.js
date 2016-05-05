define(['./module'], 
function (module) {
	
	module.factory('InvestmentEntryResource', function($resource) {
	    return $resource(
	        'api/investment/:investmentId/:action',
	        {id: '@id', investmentId: '@investmentId'},
	        {
//	            listAll:	{ method :'GET',  params: {}, isArray : true },
//	            delete:     { method :'DELETE',  params: {}, isArray : true },
//	            get:		{ method :'GET',  params: {}, isArray : false },
//	            summary:	{ method :'GET',  params: {action: 'summary'}, isArray : false },
//	            statement:	{ method :'GET',  params: {action: 'statement'}, isArray : false },
//	            updateIndex:{ method :'POST',  params: {action: 'updateIndex'}, isArray : false }
	        }
	    );

	});

});	