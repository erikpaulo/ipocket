define(['./module'], function (app) {

	app.service('ConstantsService', function() {
		this.CATEGORY_TYPE = {
				INCOME: {
					id: "E",
					type: "I",
					name: "Entrada"
				},
				FIXED_COST: {
					id: 'F',
					type: 'C',
					name: "Custo Fixo"
				},
				VARIABLE_COST: {
					id: 'V',
					type: 'C',
					name: 'Custo Variável'
				},
				IRREGULAR_COST: {
					id: 'I',
					type: 'C',
					name: 'Custo Irregular'
				},
				TRANSFER: {
					id: 'T',
					type: 'T',
					name: 'Transferência'
				}
		}
		
		this.CHART_COLOR_PALETTE= ["#0066CC", "#97BBCD", "#339966", "#FF6633","#2b908f"]
	});
});