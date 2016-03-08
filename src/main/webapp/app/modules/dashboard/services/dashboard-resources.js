define(['./module'], function (module) {
	
	module.factory('DashboardResource', function($resource) {
	    return $resource(
	        'api/dashboard',
	        {id: '@id'},
	        {
	            get:	    { method :'GET',  params: {}, isArray : false },
//	            delete:     { method :'DELETE',  params: {}, isArray : true },
//	            get:		{ method :'GET',  params: {}, isArray : false },
//	            summary:	{ method :'GET',  params: {action: 'summary'}, isArray : false },
//	            statement:	{ method :'GET',  params: {action: 'statement'}, isArray : false },
//	            new: 		{ method :'POST', params: {}, isArray : false }
	        }
	    );

	});

});	