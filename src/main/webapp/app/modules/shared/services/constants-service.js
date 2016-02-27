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
});