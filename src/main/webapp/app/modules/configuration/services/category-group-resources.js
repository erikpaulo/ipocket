define(['./module'], 
function (module) {
	
	module.factory('CategoryGroupResource', function($resource) {
//	    return $resource(
//	        'api/configuration/categorygroup/:id',
//	        {id: '@id'},
//	        {
//	            listAll:	{ method : 'GET', params: {}, isArray : true },
//	            new: 		{ method : 'POST', params: {}, isArray : false },
//	            delete: 	{ method : 'DELETE', params: {}, isArray : false },
//	            save: 		{ method : 'PUT', params: {}, isArray : false }
//	        }
//	    );
        return {
        listAll: function(callBack){
                callBack([
                    {id: 2,
                     name: 'Entradas',
                     categories:[
                        {id: 6,
                         name: 'Salário CI&T',
                         subcategories:[
                            {id: 8, name: 'Salário CI&T - Erik'},
                            {id: 9, name: 'Salário CI&T - Carol'},
                         ]
                        }
                     ]
                    },
                    {id: 1,
                     name: 'Despesas',
                     categories: [
                        {id: 1,
                         name: 'Household',
                         subcategories:[
                            {id: 1, name: 'Household: Diarista'},
                            {id: 2, name: 'Household: Comdomínio'}
                         ]
                        },
                        {id: 2,
                         name: 'Transporte',
                         subcategories:[
                            {id: 5, name: 'Transporte: Gasolina'},
                            {id: 6, name: 'Transporte: IPVA'},
                            {id: 7, name: 'Transporte: Seguro'}
                         ]
                        },
                        {id: 3,
                         name: 'House',
                         subcategories:[
                            {id: 3, name: 'House: Financiamento Santander'},
                         ]
                        },
                        {id: 4,
                         name: 'Alimentação',
                         subcategories:[
                            {id: 4, name: 'Alimentação: Alimentação'},
                         ]
                        },
                        {id: 5,
                         name: 'Educação',
                         subcategories:[
                            {id: 10, name: 'Education: Escola de Inglês'}
                         ]
                        }
                     ]
                    }
                ]);
            }
        }
	});

});

