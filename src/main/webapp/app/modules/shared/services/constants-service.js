define(['./module'], function (app) {

	app.filter('mapType', function() {
		var typeHash = {
                'F' : 'Despesa Fixa',
             	'V' : 'Despesa Variável',
             	'I' : 'Despesa Irregular',
             	'E' : 'Entrada',
  	            'RF': 'Renda Fixa',
  	            'RV': 'Renda Variável',
             	'T' : 'Transferência'
		};

				return function(input) {
					if (!input){
						return '';
			} else {
				return typeHash[input];
			}
		};
	});
});