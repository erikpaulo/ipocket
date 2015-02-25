define(['./module', '../../shared/services/constants-service'], function (app) {
	
	app.service('ExpenseReportService', ['ConstantsService', function(Constants) {
		return{
			/**
			 * Itera por todos os lançamentos contidos nas contas informadas, criando uma estrutura do tipo:
			 * [
			 * 		mmm/yyyy'
			 * 		{total: 0.00 - saldo total do mês: +entradas - saídas
			 * 		 data:[
			 * 			Constants.CATEGORY_TYPE.<<TYPE>>.name,
			 * 			{total: 0.00 - soma total dos lançamentos desse tipo
			 * 			 data: [
			 * 				entry.category.name,
			 * 				{total: 0.00 - soma total dos lançamentos dessa categoria
			 * 				 data: [
			 * 					entry.category.subCategoryName, 
			 * 					{total: 0.00 - soma total dos lançamentos dessa subcategoria}
			 * 				 ]
			 * 			 ]
			 * 		]
			 * ]
			 */
			newInstance: function(accounts){
				var incomeAndExpense = {};
				
				var dataN1 = [];
				angular.forEach(accounts, function(account){
					angular.forEach(account.entries, function(entry){
						var date = new Date(entry.date);
						var groupId = getGroupId(date, "Month");
						
						if (entry.category){
							// Agrupamento por mês
							if (!dataN1[groupId]) dataN1[groupId] = {total: 0, data: []}
							dataN1[groupId].total += entry.amount;
							
							// Agrupamento por tipo de categoria
							if (!dataN1[groupId].data[entry.category.type]) 
								dataN1[groupId].data[entry.category.type] = {total: 0, data: []};
							dataN1[groupId].data[entry.category.type].total += entry.amount;
							
							// Agrupamento por categoria
							if (!dataN1[groupId].data[entry.category.type].data[entry.category.name]) 
								dataN1[groupId].data[entry.category.type].data[entry.category.name] = {total: 0, data: []}
							dataN1[groupId].data[entry.category.type].data[entry.category.name].total += entry.amount;
							
							// Agrupamento por subcategoria
							if (!dataN1[groupId].data[entry.category.type].data[entry.category.name].data[entry.category.subCategoryName])
								dataN1[groupId].data[entry.category.type].data[entry.category.name].data[entry.category.subCategoryName] = {total: 0}; 
							dataN1[groupId].data[entry.category.type].data[entry.category.name].data[entry.category.subCategoryName].total += entry.amount;
						}
					})
				})
				incomeAndExpense.data = dataN1;
				
				/**
				 * Recupera as séries de nível 01 - tipo de categoria - agrupados por mês.
				 */
				incomeAndExpense.getN1Series = function(startDate, endDate){
					var n1Series = {};
					
					var date = new Date(startDate.getTime());
					n1Series.labels = labels = []
					while (date <= endDate){
						if (this.data[getGroupId(date, "Month")]) labels.push(getGroupId(date, "Month"));
						date.setMonth(date.getMonth()+1);
					}

					var n1Data = [];
					for (var i in labels){
						for (var property in Constants.CATEGORY_TYPE) {
							if (Constants.CATEGORY_TYPE.hasOwnProperty(property)){
								if (!n1Data['$'+ eval('Constants.CATEGORY_TYPE.'+ property).id]) n1Data['$'+ eval('Constants.CATEGORY_TYPE.'+ property).id] = [];
								n1Data['$'+ eval('Constants.CATEGORY_TYPE.'+ property).id].push(0);
							}
						}
						for (var n1Name in this.data[labels[i]].data){
							if (!n1Data['$'+ n1Name]) n1Data['$'+ n1Name] = [];
							n1Data['$'+ n1Name][i] = this.data[labels[i]].data[n1Name].total * (this.data[labels[i]].data[n1Name].total < 0 ? -1:1);
						}
					}
					n1Series.data = n1Data;
					
					return n1Series;
				}
				
				/**
				 * Recupera as séries de nível 02 - categoria - para impressão em gráfico de série.
				 */
				incomeAndExpense.getN2Series = function(categories, startDate, endDate){
					var n2Series = {};
					
					var date = new Date(startDate.getTime());
					n2Series.labels = labels = []
					while (date <= endDate){
						if (this.data[getGroupId(date, "Month")]) labels.push(getGroupId(date, "Month"));
						date.setMonth(date.getMonth()+1);
					}

					// Inicializa a estrutura com as categorias selecionadas.
					var n2Data = [];
					angular.forEach(categories, function(category){
						if (!n2Data['$'+ category.name]) n2Data['$'+ category.name] = [];
					})
					
					for (var i in labels){
						// Inicializa todas as categorias do mês.
						for(var name in n2Data){
							n2Data[name].push(0);
						}
						
						// Atualiza aquelas categorias que possuem valor caso contrário fica com 0.
						for (var n1Name in this.data[labels[i]].data){
							for (var n2Name in this.data[labels[i]].data[n1Name].data){
								if (n2Data['$'+ n2Name]){
									n2Data['$'+ n2Name][i] = this.data[labels[i]].data[n1Name].data[n2Name].total * (this.data[labels[i]].data[n1Name].data[n2Name].total < 0 ? -1:1);
								}
							}
						}
					}
					n2Series.data = n2Data;
					
					return n2Series;
				}
				
				/**
				 * Recupera as séries de nível 02 - categoria -  no formato para impressão em gráfico de pizza.
				 */
				incomeAndExpense.getN2SeriesForPie = function (startDate, endDate){
					var tempHolder = [];
					var dataToRet = {};
					
					var labels = [];
					var date = new Date(startDate.getTime());
					while (date <= endDate){
						if (this.data[getGroupId(date, "Month")]) labels.push(getGroupId(date, "Month"));
						date.setMonth(date.getMonth()+1);
					}
					
					for (var i in labels){
						n0Name = labels[i];
						if (this.data[n0Name]){
							for (var n1Name in this.data[n0Name].data){
								// Somente despesas
								if (n1Name == Constants.CATEGORY_TYPE.FIXED_COST.id || n1Name == Constants.CATEGORY_TYPE.FIXED_COST.id || n1Name == Constants.CATEGORY_TYPE.IRREGULAR_COST.id){
									for (var n2Name in this.data[n0Name].data[n1Name].data){
										if (!tempHolder[n2Name]) tempHolder[n2Name] = {total: 0, subcategory: []};
										
										tempHolder[n2Name].total += this.data[n0Name].data[n1Name].data[n2Name].total *-1;
										for (var n3Name in this.data[n0Name].data[n1Name].data[n2Name].data){
											if (!tempHolder[n2Name].subcategory[n3Name]) tempHolder[n2Name].subcategory[n3Name] = 0;
											tempHolder[n2Name].subcategory[n3Name] += this.data[n0Name].data[n1Name].data[n2Name].data[n3Name].total *-1;
										}
									}
								}
							}
						}
					}
					
					dataToRet.series = [];
					dataToRet.drilldownSeries = [];
					for(var name in tempHolder) {
						dataToRet.series.push({name: name, y: tempHolder[name].total, drilldown: name});
						var data = [];
						for (var subname in tempHolder[name].subcategory){
							data.push([subname, tempHolder[name].subcategory[subname]])
						}
						dataToRet.drilldownSeries.push({name: name, id: name, data: data});
					}
					
					return dataToRet;
				}
				
				return incomeAndExpense
				
			}
		}
	}]);
});

function getGroupId(source, groupBy){
	var monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
	
	if (groupBy == "Month") {
		return monthNames[source.getMonth()] +'/'+ source.getFullYear();
	} else if (groupBy == "Week") {
		var day;
		if (source.getDate()>28){
			var newDate = new Date(source);
			newDate.setMonth(source.getMonth()+1);
			newDate.setDate(-0);
			day = newDate.getDate();
		} else {
			day = Math.ceil((source.getDate()/7))*7;
		}
		return day +'/'+ monthNames[source.getMonth()] +'/'+ source.getFullYear();
		
	} else if (groupBy == 'Subcategory'){
		return source.name +':'+ source.subCategoryName;
		
	} else if (groupBy == 'Category'){
		return source.name;
	}
}