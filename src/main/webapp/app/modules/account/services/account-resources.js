define(['./module'], 
function (module) {
	
	module.factory('AccountResource', function($resource) {
	    return $resource(
	        'api/account/:id/:action',
	        {id: '@id'},
	        {
	            listAll:	{ method :'GET',  params: {}, isArray : true },
	            delete:     { method :'DELETE',  params: {}, isArray : true },
	            get:		{ method :'GET',  params: {}, isArray : false },
	            summary:	{ method :'GET',  params: {action: 'summary'}, isArray : false },
	            statement:	{ method :'GET',  params: {action: 'statement'}, isArray : false }
	        }
	    );

	});

});	