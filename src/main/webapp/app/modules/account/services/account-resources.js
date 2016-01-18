define(['./module'], 
function (module) {
	
	module.factory('AccountResource', function($resource) {
//	    return $resource(
//	        'api/account/:id/:action',
//	        {account: '@account'},
//	        {
//	            listAll:	{ method :'GET',  params: {}, isArray : true },
//	            summary:	{ method :'GET',  params: {action: 'summary'}, isArray : false },
//	            statement:	{ method :'GET',  params: {action: 'statement'}, isArray : false },
////	            get:		{ method :'GET',  params: {}, isArray : false },
//	            new: 		{ method :'POST', params: {}, isArray : false }
//	        }
//	    );

        return {
            listAll: function(callBack){
                //TODO: recuperar as contas do usuário.
                callBack([
                    {id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8},
                    {id: 2,name: 'CC: HSBC Premier',balance: 56.0},
                    {id: 3,name: 'Poupança Personalitè',balance: 61986.02},
                    {id: 3,name: 'Maximime DI',balance: 986.02},
                    {id: 4,name: 'Itaú Personalitè - Visa Carol',balance: -10000.02},
                    {id: 5,name: 'Itaú Personalitè - Visa Erik',balance: -2986.02}
                ]);
            }
        }
	});

});	