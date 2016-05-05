define(['./module'], function (app) {

	app.filter('mapType', function() {
		var typeHash = {
                'FC' : 'Despesa Mensal Fixa',
             	'VC' : 'Despesa Mensal Variável',
             	'IC' : 'Despesa Irregular'
		};

        return function(input) {
            if (!input){
                return '';
			} else {
				return typeHash[input];
			}
		};
	});

    app.filter('accountTypeName', function () {
        var typeNameHash = {
            CKA:  'Conta Corrente',
            SVA:  'Conta Poupança',
            INV:  'Conta Investimento',
            CCA: 'Cartão de Crédito'
        }
        return function (input) {
            return (typeNameHash[input] ? typeNameHash[input] : 'Not Found');
        };
    });

    app.filter('investEntryTypeName', function () {
        var typeNameHash = {
            B:  'Compra',
            S:  'Venda'
        }
        return function (input) {
            return (typeNameHash[input] ? typeNameHash[input] : 'Not Found');
        };
    });
});