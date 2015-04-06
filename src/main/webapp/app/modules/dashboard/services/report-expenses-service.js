define(['./module', '../../shared/services/constants-service', '../../configuration/services/category-resources'], function (app) {
	
	app.service('ExpenseReportService', ['ConstantsService', 'CategoryResource', function(Constants, Category) {
		return{
			JUST_EXPENSES: 'E',
			/**
			 * Itera por todos os lançamentos contidos nas contas informadas, criando uma estrutura do Grupo:
			 * [
			 * 		mmm/yyyy'
			 * 		{total: 0.00 - saldo total do mês: +entradas - saídas
			 * 		 data:[
			 * 			Constants.CATEGORY_TYPE.<<TYPE>>.name,
			 * 			{total: 0.00 - soma total dos lançamentos desse Grupo
			 * 			 data: [
			 * 				entry.category.groupName,
			 * 				{total: 0.00 - soma total dos lançamentos dessa categoria
			 * 				 data: [
			 * 					entry.category.name, 
			 * 					{total: 0.00 - soma total dos lançamentos dessa subcategoria}
			 * 				 ]
			 * 			 ]
			 * 		]
			 * ]
			 */
			newInstance: function(categories, accounts){
				var incomeAndExpense = {};
				
				// Cria hash para recuperação do nome associado ao Grupo de categoria
				var categoryTypes = [];
				for (var type in Constants.CATEGORY_TYPE){
					categoryTypes[eval('Constants.CATEGORY_TYPE.' + type).id] = eval('Constants.CATEGORY_TYPE.' + type).name;
				}
				
				// Constroe a árvore a partir de todas as categories cadastradas.
				var dataTree = [];
				angular.forEach(categories, function(category){
					if (!dataTree[categoryTypes[category.type]]) {
						dataTree[categoryTypes[category.type]] = {total: [], data: []};
					}
					if (!dataTree[categoryTypes[category.type]].data[category.groupName]){
						dataTree[categoryTypes[category.type]].data[category.groupName] = {total: [], data: []}
					}
					if (!dataTree[categoryTypes[category.type]].data[category.groupName].data[category.name]){
						dataTree[categoryTypes[category.type]].data[category.groupName].data[category.name] = {total: []}
					}
				})
				
				// Atribui a arvore criada, os valores contidos nas contas do usuário.
				angular.forEach(accounts, function(account){
					angular.forEach(account.entries, function(entry){
						if (entry.category){
							var categoryType = categoryTypes[entry.category.type];
							var category = entry.category.groupName;
							var subCategory = entry.category.name;
							var x = getGroupId(new Date(entry.date), "Month");
							
							// Grupo de Categoria
							if (!dataTree[categoryType].total[x]) dataTree[categoryType].total[x] = 0;
							dataTree[categoryType].total[x] += entry.amount;
							
							// Categoria
							if (!dataTree[categoryType].data[category].total[x]) dataTree[categoryType].data[category].total[x] = 0;
							dataTree[categoryType].data[category].total[x] += entry.amount;
							
							// Subcategoria
							if (!dataTree[categoryType].data[category].data[subCategory].total[x]) dataTree[categoryType].data[category].data[subCategory].total[x] = 0;
							dataTree[categoryType].data[category].data[subCategory].total[x] += entry.amount;
						}
					})
				})
				
				incomeAndExpense.dataTree = dataTree;
				
				/**
				 * Transforma toda a árvore em array.
				 */
				incomeAndExpense.getTree = function(startDate, endDate){
					var treeSerie = {labels: [], data: []};
					
					// Recupera hash contendo os meses selecionados.
					var selectedMonths = getSelectedMonths(startDate, endDate);
					for (var month in selectedMonths){
						treeSerie.labels.push(month);
					}	
					
					var i0=0;
					for (var n0 in this.dataTree){ // Grupo de categoria
						treeSerie.data.push({name: n0, totals: [], data: []});
						for (var month in selectedMonths){
							if (this.dataTree[n0].total[month]){
								treeSerie.data[i0].totals.push(this.dataTree[n0].total[month]);
							} else {
								treeSerie.data[i0].totals.push(0);
							}
						}
						
						var i1=0;
						for (var n1 in this.dataTree[n0].data){ // Categoria
							treeSerie.data[i0].data.push({name: n1, totals: [], data: []});
							for (var month in selectedMonths){
								if (this.dataTree[n0].data[n1].total[month]){
									treeSerie.data[i0].data[i1].totals.push(this.dataTree[n0].data[n1].total[month]);
								} else {
									treeSerie.data[i0].data[i1].totals.push(0);
								}
							}
							
							var i2=0;
							for (var n2 in this.dataTree[n0].data[n1].data){ // Subcategoria
								treeSerie.data[i0].data[i1].data.push({name: n2, totals: []});
								for (var month in selectedMonths){
									if (this.dataTree[n0].data[n1].data[n2].total[month]){
										treeSerie.data[i0].data[i1].data[i2].totals.push(this.dataTree[n0].data[n1].data[n2].total[month]);
									} else {
										treeSerie.data[i0].data[i1].data[i2].totals.push(0);
									}
								}
								i2++;
							}
							i1++;
						}
						i0++;
					}
					
					return treeSerie;
				}
				
				/**
				 * Recupera o nível 0 da árvore no padrão:
				 * [{name: Category_Type_Name, data: [lista com totais por mês]}]
				 */
				incomeAndExpense.getN0 = function(startDate, endDate){
					var n0Serie = {labels: [], data: []};
					
					// Recupera hash contendo os meses selecionados.
					var selectedMonths = getSelectedMonths(startDate, endDate);
					for (var month in selectedMonths){
						n0Serie.labels.push(month);
					}
					
					// Itera pela árvore no nível 01 selecionando de acordo com o período informado.
					var i=0;
					for (var n0 in dataTree){
						n0Serie.data.push({name: n0, y: []});
						for (var month in selectedMonths){
							if (dataTree[n0].total[month]){
								n0Serie.data[i].y.push(dataTree[n0].total[month] * (dataTree[n0].total[month] < 0 ? -1 : 1));
							} else {
								n0Serie.data[i].y.push(0);
							}
						}
						i++
					}
					
					return n0Serie;
				}

				/**
				 * Recupera o nível 1 da árvore em formato de árvore.
				 */
				incomeAndExpense.getN1Tree = function(startDate, endDate){
					var treeSerie = {labels: [], data: []};
					var tempHolder = [];
					
					// Recupera hash contendo os meses selecionados.
					var selectedMonths = getSelectedMonths(startDate, endDate);
					for (var month in selectedMonths){
						treeSerie.labels.push(month);
					}	
					
					var i0=0;
					for (var n0 in this.dataTree){ // Tipo de categoria
						for (var n1 in this.dataTree[n0].data){ // Grupo categoria
							if (!tempHolder[n1]) tempHolder[n1] = {total: [], data: []};
							for (var month in selectedMonths){
								if (dataTree[n0].data[n1].total[month]){
									if (!tempHolder[n1].total[month]) tempHolder[n1].total[month] = 0;
									tempHolder[n1].total[month] += dataTree[n0].data[n1].total[month];
								} else {
									tempHolder[n1].total[month] = 0;
								}
							}
							
							for (var n2 in this.dataTree[n0].data[n1].data){ // Categoria
								tempHolder[n1].data[n2] = {total: []};
								
								for (var month in selectedMonths){
									if (this.dataTree[n0].data[n1].data[n2].total[month]){
										tempHolder[n1].data[n2].total[month] = this.dataTree[n0].data[n1].data[n2].total[month];
									} else {
										tempHolder[n1].data[n2].total[month] = 0;
									}
								}
							}
						}
					}
					
					var i0 = 0;
					for (var groupName in tempHolder){
						treeSerie.data.push({name: groupName, totals: [], data:[]})
						for(var month in tempHolder[groupName].total){
							treeSerie.data[i0].totals.push(tempHolder[groupName].total[month]);
						}
						
						var i1 = 0;
						for (var catName in tempHolder[groupName].data){
							treeSerie.data[i0].data.push({name: catName, totals: []});
							for (var month in tempHolder[groupName].data[catName].total){
								treeSerie.data[i0].data[i1].totals.push(tempHolder[groupName].data[catName].total[month])
							}
							i1++;
						}
						i0++;
					}
					
					return treeSerie;
				}
					
				
				/**
				 * Recupera o nível 1 da árvore com opção de drilldown no padrão:
				 * [{name: Category_Type_Name, data: [lista com totais por mês]}]
				 */
				incomeAndExpense.getN1 = function(startDate, endDate, drilldown, option, accumulated){
					var n1Serie = {labels: [], data: []};
					if (drilldown) n1Serie.drilldownData = [];
					
					// Recupera hash contendo os meses selecionados.
					var selectedMonths = getSelectedMonths(startDate, endDate);
					for (var month in selectedMonths){
						n1Serie.labels.push(month);
					}
					
					// Recupera as categorias selecionadas.
					var selectedCategories = [];
					for (var type in Constants.CATEGORY_TYPE){
						if (eval('Constants.CATEGORY_TYPE.'+ type).type == option){
							selectedCategories[eval('Constants.CATEGORY_TYPE.'+ type).name] = 1;
						}
					}

					//Recupera o nível n1
					var tempHolder = [];
					for (var n0 in dataTree){ // Grupos de categoria
						if (selectedCategories[n0]){
							for (var n1 in dataTree[n0].data){ // categorias
								if (!tempHolder[n1]) tempHolder[n1] = {total: [], data: []};
								for (var month in dataTree[n0].data[n1].total){
									if (!tempHolder[n1].total[month]) tempHolder[n1].total[month] = 0;
									tempHolder[n1].total[month] += dataTree[n0].data[n1].total[month];
								}
								for (var x in dataTree[n0].data[n1].data){
									tempHolder[n1].data[x] = dataTree[n0].data[n1].data[x];
								}
							}
						}
					}
					
					// Itera pela árvore no nível 01 selecionando de acordo com o período informado.
					var i=0;
					for (var n1 in tempHolder){
						if (accumulated){
							n1Serie.data.push({name: n1, y: 0});
						} else {
							n1Serie.data.push({name: n1, y: []});
						}
						if (drilldown){
							n1Serie.data[i].drilldown = n1;
							n1Serie.drilldownData.push({name: n1, id: n1, data: []});
						}
						for (var month in selectedMonths){
							if (tempHolder[n1].total[month]){
								if (n1Serie.labels.length > 1){
									if (accumulated){
										n1Serie.data[i].y += tempHolder[n1].total[month] * (tempHolder[n1].total[month] < 0 ? -1 : 1);
									} else {
										n1Serie.data[i].y.push(tempHolder[n1].total[month] * (tempHolder[n1].total[month] < 0 ? -1 : 1));
									}
								} else {
									n1Serie.data[i].y = tempHolder[n1].total[month] * (tempHolder[n1].total[month] < 0 ? -1 : 1)
								}
							} else {
								if (!accumulated){
									if (n1Serie.labels.length > 1){
										n1Serie.data[i].y.push(0);
									} else {
										n1Serie.data[i].y = 0;
									}
								}
							}
						}
						
						if (drilldown){
							for (var n2 in tempHolder[n1].data){ // subcategorias
								for (var month in selectedMonths){
									if (tempHolder[n1].data[n2].total[month]){
										n1Serie.drilldownData[i].data.push([n2, tempHolder[n1].data[n2].total[month] * (tempHolder[n1].data[n2].total[month] < 0 ? -1 : 1 )]);
									}
								}
							}
						}
						i++
					}
					
					// filtra as categorias que não possuem despesas no período.
					for (var i=n1Serie.data.length-1;i>=0;i--){
						if (n1Serie.labels.length > 1 && !accumulated){
							var found = false;
							for (var r=0;r<n1Serie.data[i].y.length;r++){
								if (n1Serie.data[i].y[r] > 0){
									found = true
									break;
								}
							}
							
							if (!found) {
								delete n1Serie.data[i];
							}
						} else if (n1Serie.data[i].y == 0) {
							n1Serie.data.splice(i, 1);
						}
					}
					
					return n1Serie;
				}
				
				return incomeAndExpense
				
				
				function getSelectedMonths(startDate, endDate){
					var date = new Date(startDate.getTime());
					var selectedMonths = []
					while (date <= endDate){
						selectedMonths[getGroupId(date, "Month")] = 1;
						date.setMonth(date.getMonth()+1);
					}
					
					return selectedMonths;
				}
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
		return source.name +':'+ source.name;
		
	} else if (groupBy == 'Category'){
		return source.name;
	}
}