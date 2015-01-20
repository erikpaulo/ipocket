define(['./module'], 
function (module) {
	
	module.factory('AccountEntryResource', function($resource) {
	    return $resource(
	        'api/account/:accountId/entries/:id', 
	        {accountId: '@accountId', id: '@id'}, 
	        {
	            listAll:	{ method : 'GET',  params: {}, isArray : true },
	            get:		{ method : 'GET',  params: {}, isArray : false },
	            new: 		{ method : 'POST', params: {}, isArray : false },
	            delete:		{ method : 'DELETE' , params: {}, isArray : false }
	        }
	    );
	});

});	