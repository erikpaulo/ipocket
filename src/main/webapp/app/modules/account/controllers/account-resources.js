define(['./module'], 
function (module) {
	
	module.factory('AccountResource', function($resource) {
	    return $resource(
	        'api/account/:id/:action', 
	        {account: '@account'}, 
	        {
	            listAll:	{ method :'GET',  params: {}, isArray : true },
	            get:		{ method :'GET',  params: {}, isArray : false },
	            new: 		{ method :'POST', params: {}, isArray : false }
	        }
	    );
	});

});	