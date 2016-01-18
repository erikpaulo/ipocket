define(['./module'], 
function (module) {
	
	module.factory('BillResource', ['$resource', function($resource) {
//	    return $resource(
//	        'api/bill/:id/:action',
//	        {id: '@id'},
//	        {
//	            listAll:			{ method : 'GET',  	params: {}, isArray : true },
//	            cashFlowProjection:	{ method : 'POST',  params: {action: 'cashflowprojection'}, isArray : false },
//	            save:				{ method : 'POST',  params: {}, isArray : false}
//	        }
//	    );

        return {
            //TODO: recuperar pagamentos programados.
            listAll: function (callBack){

                callBack([
                    {id: 1, date:new Date('2016/1/15'), category:{id: 1, name: 'Household: Diarista'}, accountTo:{id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8}, amount:-250, type:'D'},
                    {id: 2, date:new Date('2016/1/28'), category:{id: 3, name: 'House: Financiamento Santander'},accountFrom:{id: 2,name: 'CC: HSBC Premier',balance: 56.0}, accountTo:{id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8}, amount:-5678.98, type:'T'},
                    {id: 3, date:new Date('2016/1/5'), category:{id: 3, name: 'House: Financiamento Santander'}, accountTo:{id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8}, amount:6432.43, type:'D'},
                    {id: 4, date:new Date('2016/1/5'), category:{id: 2, name: 'Household: Comdomínio'}, accountTo:{id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8}, amount:-1560, type:'D'},
                    {id: 5, date:new Date('2016/1/5'), category:{id: 8, name: 'Income: Salário CI&T - Carol'}, accountTo:{id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8}, amount:4260, type:'D'},
                    {id: 6, date:new Date('2016/1/5'), category:{id: 8, name: 'Income: Salário CI&T - Erik'}, accountTo:{id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8}, amount:3260, type:'D'}
                ]);
            }
        }
	}]);

});	