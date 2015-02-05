define(['./module'], 
function (module) {
	
	module.factory('BillResource', function($resource) {
	    return $resource(
	        'api/bill/:id', 
	        {id: '@id'}, 
	        {
	            listAll:	{ method :'GET',  	params: {}, isArray : true },
	            save:		{ method : 'POST',  params: {}, isArray : false}
	        }
	    );
	});

});	