define(['./module'], 
function (module) {
	
	module.factory('CategoryKindResource', function($resource) {
	    return $resource(
	        'api/configuration/kind/', 
	        {groupId: '@groupId'}, 
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true }
	        }
	    );
	});

});	