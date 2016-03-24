define(['./module'], 
function (module) {
	
	module.factory('BillResource', ['$resource', function($resource) {
	    return $resource(
	        'api/bill/:id/:action',
	        {id: '@id'},
	        {
	            listAll:	  { method : 'GET',  params: {}, isArray : true  },
	            new:		  { method : 'POST', params: {}, isArray : false },
	            save:		  { method : 'PUT',  params: {}, isArray : false },
	            listCashFlow: { method : 'GET',  params: {action: 'cashFlow'}, isArray : false }
	        }
	    );

	}]);

});	