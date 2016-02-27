define(['./module'], 
function (module) {
	
	module.factory('CategoryResource', ['$resource','$q', function($resource, $q) {
	    return $resource(
	        'api/categorization/category/:id/',
	        {id: '@id'},
	        {
	            listAll:	{ method : 'GET', params: {}, isArray : true },
	            new: 		{ method : 'POST', params: {}, isArray : false },
	            delete: 	{ method : 'DELETE', params: {}, isArray : false },
	            save: 		{ method : 'PUT', params: {}, isArray : false }
	        }
	    );

//        return {
//            listAll: function(callBack){
//                callBack([
//                    {id: 1, name: 'Household: Diarista'},
//                    {id: 2, name: 'Household: Comdomínio'},
//                    {id: 3, name: 'House: Financiamento Santander'},
//                    {id: 4, name: 'Alimentação: Alimentação'},
//                    {id: 5, name: 'Transporte: Gasolina'},
//                    {id: 6, name: 'Transporte: IPVA'},
//                    {id: 7, name: 'Transporte: Seguro'},
//                    {id: 8, name: 'Income: Salário CI&T - Erik'},
//                    {id: 9, name: 'Income: Salário CI&T - Carol'},
//                    {id: 10, name: 'Education: Escola de Inglês'}
//                ]);
//            }
//        }
	}]);

});	