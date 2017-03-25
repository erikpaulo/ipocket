define(['./module'], 
function (module) {
	
	module.factory('BillResource', ['$resource', function($resource) {
	    return $resource(
	        'api/bill/:id/:action',
	        {id: '@id'},
	        {
	            getCurrent:   { method : 'GET',  params: {}, isArray : false  },
	            new:		  { method : 'POST', params: {}, isArray : false },
	            save:		  { method : 'PUT',  params: {}, isArray : false },
	            done:		  { method : 'GET',  params: {action: 'done'}, isArray : false },
	            listCashFlow: { method : 'GET',  params: {action: 'cashFlow'}, isArray : false },
	            saveBaseline: { method : 'GET',  params: {action: 'saveBaseline'}, isArray : false },
	            budget:       { method : 'GET',  params: {action: 'budget'}, isArray : false }
	        }
	    );

	}]);

});	