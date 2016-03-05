define(['./module'], 
function (module) {
	
	module.factory('AccountEntryResource', function($resource) {
	    return $resource(
	        'api/account/:accountId/entries/:id/:action',
	        {accountId: '@accountId', id: '@id'}, 
	        {
	            new: 		{ method : 'POST', 		params: {}, isArray : false },
	            save: 		{ method : 'PUT', 		params: {}, isArray : false },
//	            listAll:	{ method : 'GET',  		params: {}, isArray : true  },
//	            listAllLByPeriod:	{ method : 'POST', params: {action: 'listAll'}, isArray : true  },
//	            listAllL3M:	{ method : 'GET',  		params: {action: 'listAllL3M'}, isArray : true  },
//	            get:		{ method : 'GET',  		params: {}, isArray : false },
	            delete:		{ method : 'DELETE' , 	params: {}, isArray : false }
	        }
	    );
	});

});	