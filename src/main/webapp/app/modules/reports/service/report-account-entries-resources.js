define(['./module'], function (module) {
	
	module.factory('ReportAEResource', function($resource) {
	    return $resource(
	        'api/account/all/entries/listByFilter',
	        {},
	        {
	            list:	    { method :'POST',  params: {}, isArray : false }
	        }
	    );

	});

});	