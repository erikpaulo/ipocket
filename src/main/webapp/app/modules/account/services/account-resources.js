define(['./module'], 
function (module) {
	
	module.factory('AccountResource', function($resource) {
	    return $resource(
	        'api/account/:id/:action', 
	        {account: '@account'}, 
	        {
	            listAll:	{ method :'GET',  params: {}, isArray : true },
	            summary:	{ method :'GET',  params: {action: 'summary'}, isArray : false },
	            statement:	{ method :'GET',  params: {action: 'statement'}, isArray : false },
//	            get:		{ method :'GET',  params: {}, isArray : false },
	            new: 		{ method :'POST', params: {}, isArray : false }
	        }
	    );
	});

});	