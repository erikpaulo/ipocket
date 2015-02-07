define(['./module'], 
function (module) {
	
	module.factory('BillResource', function($resource) {
	    return $resource(
	        'api/bill/:id/:action', 
	        {id: '@id'}, 
	        {
	            listAll:	{ method :'GET',  	params: {}, isArray : true },
	            save:		{ method : 'POST',  params: {}, isArray : false},
	            register:	{ method : 'POST',  params: {action: 'register'}, isArray : false},
	            skip:		{ method : 'POST',  params: {action: 'skip'}, isArray : false}
	        }
	    );
	});

});	