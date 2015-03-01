define(['./module', '../../shared/services/constants-service', '../../account/controllers/category-resources'], function (app) {
	
	app.service('ExpenseReportService', ['ConstantsService', 'CategoryResource', function(Constants, Category) {
		return{
			JUST_EXPENSES: 'E',
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
			newInstance: function(categories, accounts){
				var incomeAndExpense = {};
				
				// Cria hash para recuperação do nome associado ao tipo de categoria
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
					if (!dataTree[categoryTypes[category.type]].data[category.name]){
						dataTree[categoryTypes[category.type]].data[category.name] = {total: [], data: []}
					}
					if (!dataTree[categoryTypes[category.type]].data[category.name].data[category.subCategoryName]){
						dataTree[categoryTypes[category.type]].data[category.name].data[category.subCategoryName] = {total: []}
					}
				})
				
				// Atribui a arvore criada, os valores contidos nas contas do usuário.
				angular.forEach(accounts, function(account){
					angular.forEach(account.entries, function(entry){
						if (entry.category){
							var categoryType = categoryTypes[entry.category.type];
							var category = entry.category.name;
							var subCategory = entry.category.subCategoryName;
							var x = getGroupId(new Date(entry.date), "Month");
							
							// Tipo de Categoria
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
					for (var n0 in this.dataTree){ // Tipo de categoria
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
					for (var n0 in dataTree){ // tipos de categoria
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
				
//				var dataN1 = [];
//				angular.forEach(accounts, function(account){
//					angular.forEach(account.entries, function(entry){
//						var date = new Date(entry.date);
//						var groupId = getGroupId(date, "Month");
//						
//						if (entry.category){
//							// Agrupamento por mês
//							if (!dataN1[groupId]) dataN1[groupId] = {total: 0, data: []}
//							dataN1[groupId].total += entry.amount;
//							
//							// Agrupamento por tipo de categoria
//							if (!dataN1[groupId].data[entry.category.type]) 
//								dataN1[groupId].data[entry.category.type] = {total: 0, data: []};
//							dataN1[groupId].data[entry.category.type].total += entry.amount;
//							
//							// Agrupamento por categoria
//							if (!dataN1[groupId].data[entry.category.type].data[entry.category.name]) 
//								dataN1[groupId].data[entry.category.type].data[entry.category.name] = {total: 0, data: []}
//							dataN1[groupId].data[entry.category.type].data[entry.category.name].total += entry.amount;
//							
//							// Agrupamento por subcategoria
//							if (!dataN1[groupId].data[entry.category.type].data[entry.category.name].data[entry.category.subCategoryName])
//								dataN1[groupId].data[entry.category.type].data[entry.category.name].data[entry.category.subCategoryName] = {total: 0}; 
//							dataN1[groupId].data[entry.category.type].data[entry.category.name].data[entry.category.subCategoryName].total += entry.amount;
//						}
//					})
//				})
//				incomeAndExpense.data = dataN1;
//				
//				/**
//				 * Recupera as séries de nível 0 - meses.
//				 */
//				incomeAndExpense.getTree = function(startDate, endDate){
//					var tree = [];
//					
//					var date = new Date(startDate.getTime());
//					var selectedMonths = []
//					while (date <= endDate){
//						if (this.data[getGroupId(date, "Month")]) selectedMonths.push(getGroupId(date, "Month"));
//						date.setMonth(date.getMonth()+1);
//					}
//					
//					for (var i0=0;i0<selectedMonths.length;){
////						if (labels[n0Name]){
//						n0Name = selectedMonths[i0];
//						tree.push({id: n0Name, total: this.data[n0Name].total, data: []});
//						
//						var i1=0;
//						for (var n1Name in this.data[n0Name].data){
//							tree[i0].data.push({id: n1Name, total: this.data[n0Name].data[n1Name].total, data: []})
//							
//							var i2=0;
//							for (var n2Name in this.data[n0Name].data[n1Name].data){
//								tree[i0].data[i1].data.push({id: n2Name, total: this.data[n0Name].data[n1Name].data[n2Name].total, data: []})
//								
//								for (var n3Name in this.data[n0Name].data[n1Name].data[n2Name].data){
//									tree[i0].data[i1].data[i2].data.push({id: n3Name, total: this.data[n0Name].data[n1Name].data[n2Name].data[n3Name].total})
//								}
//								i2++;
//							}
//							i1++;
//						}
//						i0++;
////						}
//					}
//					
//					return tree;
//				}
//				
//				
//				/**
//				 * Recupera as séries de nível 01 - tipo de categoria - agrupados por mês.
//				 */
//				incomeAndExpense.getN1Series = function(startDate, endDate){
//					var n1Series = {};
//					
//					var date = new Date(startDate.getTime());
//					n1Series.labels = labels = []
//					while (date <= endDate){
//						if (this.data[getGroupId(date, "Month")]) labels.push(getGroupId(date, "Month"));
//						date.setMonth(date.getMonth()+1);
//					}
//
//					var n1Data = [];
//					for (var i in labels){
//						for (var property in Constants.CATEGORY_TYPE) {
//							if (Constants.CATEGORY_TYPE.hasOwnProperty(property)){
//								if (!n1Data['$'+ eval('Constants.CATEGORY_TYPE.'+ property).id]) n1Data['$'+ eval('Constants.CATEGORY_TYPE.'+ property).id] = [];
//								n1Data['$'+ eval('Constants.CATEGORY_TYPE.'+ property).id].push(0);
//							}
//						}
//						for (var n1Name in this.data[labels[i]].data){
//							if (!n1Data['$'+ n1Name]) n1Data['$'+ n1Name] = [];
//							n1Data['$'+ n1Name][i] = this.data[labels[i]].data[n1Name].total * (this.data[labels[i]].data[n1Name].total < 0 ? -1:1);
//						}
//					}
//					n1Series.data = n1Data;
//					
//					return n1Series;
//				}
//				
//				/**
//				 * Recupera as séries de nível 02 - categoria - para impressão em gráfico de série.
//				 */
//				incomeAndExpense.getN2Series = function(categories, startDate, endDate){
//					var n2Series = {};
//					
//					var date = new Date(startDate.getTime());
//					n2Series.labels = labels = []
//					while (date <= endDate){
//						if (this.data[getGroupId(date, "Month")]) labels.push(getGroupId(date, "Month"));
//						date.setMonth(date.getMonth()+1);
//					}
//
//					// Inicializa a estrutura com as categorias selecionadas.
//					var n2Data = [];
//					angular.forEach(categories, function(category){
//						if (!n2Data['$'+ category.name]) n2Data['$'+ category.name] = [];
//					})
//					
//					for (var i in labels){
//						// Inicializa todas as categorias do mês.
//						for(var name in n2Data){
//							n2Data[name].push(0);
//						}
//						
//						// Atualiza aquelas categorias que possuem valor caso contrário fica com 0.
//						for (var n1Name in this.data[labels[i]].data){
//							for (var n2Name in this.data[labels[i]].data[n1Name].data){
//								if (n2Data['$'+ n2Name]){
//									n2Data['$'+ n2Name][i] = this.data[labels[i]].data[n1Name].data[n2Name].total * (this.data[labels[i]].data[n1Name].data[n2Name].total < 0 ? -1:1);
//								}
//							}
//						}
//					}
//					n2Series.data = n2Data;
//					
//					return n2Series;
//				}
//				
//				/**
//				 * Recupera as séries de nível 02 - categoria -  no formato para impressão em gráfico de pizza.
//				 */
//				incomeAndExpense.getN2SeriesForPie = function (startDate, endDate){
//					var tempHolder = [];
//					var dataToRet = {};
//					
//					var labels = [];
//					var date = new Date(startDate.getTime());
//					while (date <= endDate){
//						if (this.data[getGroupId(date, "Month")]) labels.push(getGroupId(date, "Month"));
//						date.setMonth(date.getMonth()+1);
//					}
//					
//					for (var i in labels){
//						n0Name = labels[i];
//						if (this.data[n0Name]){
//							for (var n1Name in this.data[n0Name].data){
//								// Somente despesas
//								if (n1Name == Constants.CATEGORY_TYPE.FIXED_COST.id || n1Name == Constants.CATEGORY_TYPE.FIXED_COST.id || n1Name == Constants.CATEGORY_TYPE.IRREGULAR_COST.id){
//									for (var n2Name in this.data[n0Name].data[n1Name].data){
//										if (!tempHolder[n2Name]) tempHolder[n2Name] = {total: 0, subcategory: []};
//										
//										tempHolder[n2Name].total += this.data[n0Name].data[n1Name].data[n2Name].total *-1;
//										for (var n3Name in this.data[n0Name].data[n1Name].data[n2Name].data){
//											if (!tempHolder[n2Name].subcategory[n3Name]) tempHolder[n2Name].subcategory[n3Name] = 0;
//											tempHolder[n2Name].subcategory[n3Name] += this.data[n0Name].data[n1Name].data[n2Name].data[n3Name].total *-1;
//										}
//									}
//								}
//							}
//						}
//					}
//					
//					dataToRet.series = [];
//					dataToRet.drilldownSeries = [];
//					for(var name in tempHolder) {
//						dataToRet.series.push({name: name, y: tempHolder[name].total, drilldown: name});
//						var data = [];
//						for (var subname in tempHolder[name].subcategory){
//							data.push([subname, tempHolder[name].subcategory[subname]])
//						}
//						dataToRet.drilldownSeries.push({name: name, id: name, data: data});
//					}
//					
//					return dataToRet;
//				}
				
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
		return source.name +':'+ source.subCategoryName;
		
	} else if (groupBy == 'Category'){
		return source.name;
	}
}