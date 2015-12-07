define(['./module', './budget-resources', '../../configuration/services/category-group-resources'], function (app) {
	
	app.service('BudgetService', ['$q', '$routeParams', 'BudgetResource', 'CategoryGroupResource', function($q, $routeParams, Budget, CategoryGroup) {
		var thisMonth = new Date().getMonth();
		var months = ["janPlanned","febPlanned", "marPlanned", "aprPlanned", "mayPlanned", "junPlanned", "julPlanned", "augPlanned", "sepPlanned", "octPlanned", "novPlanned", "decPlanned"]
		
		return{

			newWizardControl: function(){
				var wizardControl = {};
				wizardControl.steps = ['one', 'two', 'three'];
			    wizardControl.step = 0;
			    wizardControl.wizard = {tacos: 2};
			    wizardControl.forward = true;
			    
			    wizardControl.isCurrentStep = function (step) {
			        return wizardControl.step === step;
			    };

			    wizardControl.setCurrentStep = function (step) {
			        wizardControl.step = step;
			    };

			    wizardControl.getCurrentStep = function () {
			        return wizardControl.steps[wizardControl.step];
			    };
			    
			    wizardControl.isFirstStep = function () {
			        return wizardControl.step === 0;
			    };

			    wizardControl.isLastStep = function () {
			        return wizardControl.step === (wizardControl.steps.length - 1);
			    };

			    wizardControl.getNextLabel = function () {
			        return (wizardControl.isLastStep()) ? 'Submit' : 'Next';
			    };

			    wizardControl.handlePrevious = function () {
			    	wizardControl.forward = false;
			        wizardControl.step -= (wizardControl.isFirstStep()) ? 0 : 1;
			    };

			    wizardControl.handleNext = function () {
			    	wizardControl.forward = true;
			        if (wizardControl.isLastStep()) {
			        } else {
			            wizardControl.step += 1;
			        }
			    };
			    
				return wizardControl;
			},
		
//			/**************************************************************
//			 * A partir do budget distribuido nas categorias informadas. Utiliza as entradas informadas
//			 * no segundo parâmetro para construir os valores que suportarão a decisão.
//			 */
//			newCategoriesBudget: function (categoryGroups, l3mEntries){
//				var categoriesBudget = {};
//				
//				var lastMonthBegin = new Date();
//				var lastMOnthEnd = new Date();
//				lastMonthBegin.setDate(-0)
//				lastMonthBegin.setDate(1)
//				lastMOnthEnd.setDate(-0)
//				console.log('Mês anterior: '+ lastMonthBegin +' a '+ lastMOnthEnd);
//				
//				var last3MBegin = new Date();
//				var last3MEnd = new Date();
//				last3MBegin.setMonth(last3MBegin.getMonth()-3);
//				last3MBegin.setDate(1);
//				last3MEnd.setDate(-0);
//				console.log('L3M: '+ last3MBegin +' a '+ last3MEnd);
//				
//				// Itera pelos grupos de categoria construindo a estrutura.
//				var holder = [];
//				for(var i in categoryGroups) {
//					var group = categoryGroups[i]; 
//					
//					// Itera pelas categorias do grupo
//					for (var r in group.categories) {
//						var category = group.categories[r];
//						if (!holder[category.id]) holder[category.id] = {lastMonth: 0, averageL3M: 0}; 
//					}
//				}
//				
//				// Itera pelas entradas preenchendo a estrutura.
//				for (var t in l3mEntries){
//					var entry = l3mEntries[t];
//					entry.date = new Date(entry.date);
//					
//					if (entry.date >= lastMonthBegin && entry.date <= lastMOnthEnd) {
//						holder[entry.category.id].lastMonth += entry.amount;
//					}
//					
//					if (entry.date >= last3MBegin && entry.date <= last3MEnd) {
//						holder[entry.category.id].averageL3M += entry.amount;
//					}
//				}
//				
//				// Itera por todas as categorias calculando a média
//				for(var i in holder){
//					holder[i].averageL3M = holder[i].averageL3M / 3; 
//				}
//				
//				
//				for(var i in categoryGroups) {
//					var group = categoryGroups[i]; 
//					
//					// Itera pelas categorias do grupo
//					for (var r in group.categories) {
//						var category = group.categories[r];
//						category.lastMonth = holder[category.id].lastMonth;
//						category.averageL3M = holder[category.id].averageL3M;
//						if (!category.amount) { // Se budget sendo criado.
//							category.amount = [];
//							for (var i=0;i<12;i++){
//								category.amount[i] = 0;
//							}
//						}
//					}
//				}
//				
//				return categoryGroups;
//
//			},
		
			/**************************************************************
			 * Atualiza ou cria um novo orçamento no sistema.
			 */
			createOrUpdateBudget: function (budget){
				// Salva.
				budget.$save(function(data){
					console.log(data);
				});
			},
			
			/**************************************************************
			 * Cria uma nova instância de Budget. Utiliza os valores das categorias do sistema
			 * e entradas do usuário para criar controles para suporte à decisão.
			 */
			initBudget: function (){
				var deferred = $q.defer();
				var budget = null;

				// Recupera os grupos de categoria.
				var categoryGroups = null;
				CategoryGroup.listAll(function (dataCat) {
					categoryGroups = dataCat;
					
					var holder = [];
					for(var i=0;i<categoryGroups.length;i++) {
						var group = categoryGroups[i];
						if (!holder[group.name]) holder[group.name] = {entries: [], categoryGroup: group, totalPlanned: 0};
						
						// Itera pelas categorias do grupo
						for (var r=0;r<categoryGroups[i].categories.length;r++) {
							var category = categoryGroups[i].categories[r];
							if(!holder[group.name].entries[category.name]) 
								holder[group.name].entries[category.name] = {janPlanned: 0, febPlanned: 0, marPlanned: 0, aprPlanned: 0, mayPlanned: 0, junPlanned: 0, 
																			 julPlanned: 0, augPlanned: 0, sepPlanned: 0, octPlanned: 0, novPlanned: 0, decPlanned: 0,
																			 category: category};
						}
					}
					
					// Se editando...
					if ($routeParams.budgetId) {
						// Recupera o orçamento do usuário.
						Budget.get({id: $routeParams.budgetId}, function(data){
							budget = data;
							
							// Verifica quais categorias já existem registradas no orçamento e as remove.
							if (budget.entryGroups){
								for (var i=0;i<budget.entryGroups.length;i++){
									var groupName = budget.entryGroups[i].categoryGroup.name;
									
									if (holder[groupName]){
										var found = false;
										for (var r=0;r<budget.entryGroups[i].entries.length;r++){
											budget.entryGroups[i].entries[r].thisMonth =  eval('budget.entryGroups[i].entries[r].' + months[thisMonth]);
											var catName = budget.entryGroups[i].entries[r].category.name;
											
											if (holder[groupName].entries[catName]){
												delete holder[groupName].entries[catName];
											} else {
												found = true;
											}
										}
										if (!found)	delete holder[groupName];
									}
								}
							}

							// Atualiza no orçamento as categorias não existentes.
							budget = addCategories(budget, holder);
							deferred.resolve(budget);
						});
						
					// Se novo...
					} else {
						budget = new Budget();
					}
					
					// Atualiza no orçamento as categorias não existentes.
					if (budget){
						budget = addCategories(budget, holder);
						deferred.resolve(budget);
					}
				});
				
				return deferred.promise;
			},
			
			/**
			 * Consiste os dados da entrada do orçamento de acordo com o entrado pelo usuário.
			 */
			updateEntry: function(entry, singleIn){
				var deferred = $q.defer();
				var thisMonth = new Date().getMonth();
				
				if (singleIn){
					entry.janPlanned = entry.febPlanned = entry.marPlanned = entry.aprPlanned = entry.mayPlanned = entry.junPlanned = entry.thisMonth;
					entry.julPlanned = entry.augPlanned = entry.sepPlanned = entry.octPlanned = entry.novPlanned = entry.decPlanned = entry.thisMonth;
				} else {
					entry.thisMonth = entry[months[thisMonth]];
				}
				
				entry.totalAnnual = 0;
				for(var i in months){
					entry.totalAnnual += entry[months[i]];
				}
				deferred.resolve(entry);
				
				return deferred.promise;
			}
		}
	}]);
});


/*********************************************
 * Adiciona no orçamento as categorias informadas.
 * @param budget
 * @param categories
 */
function addCategories(budget, categories){
	// Acrescenta no orçamento as categorias ainda não cadastradas.
	var iGroup=0;
	for (var groupName in categories){
		if (!budget.entryGroups) budget.entryGroups = [];
		budget.entryGroups.push(categories[groupName]);
		
		for (var catName in categories[groupName].entries){
			if (!budget.entryGroups[iGroup].entries) budget.entryGroups[iGroup].entries = [];
			budget.entryGroups[iGroup].entries.push(categories[groupName].entries[catName]);
		}
		iGroup++;
	}
	
	return budget;
}