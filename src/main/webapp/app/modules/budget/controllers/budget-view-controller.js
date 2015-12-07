define(['./module', '../services/budget-resources', '../services/budget-service', '../../account/services/account-entry-services'], function (app) {

	app.controller('BudgetViewController', ['$scope', '$location', 'AccountEntryService', 'BudgetService', 'BudgetResource',
        function($scope, $location, AccountEntryService, BudgetService, Budget) {
		var thisYear = new Date().getFullYear();
		var thisMonth = new Date().getMonth(); 
		var months = ["janPlanned","febPlanned", "marPlanned", "aprPlanned", "mayPlanned", "junPlanned", "julPlanned", "augPlanned", "sepPlanned", "octPlanned", "novPlanned", "decPlanned"]
		$scope.budget = null;
			
			// Recupera os orçamentos cadastrados para o usuário.
			Budget.listAll(function (data){
				var budgets = data;
				
				// Recupera os lançamentos efetuados no ano correspondente.
				AccountEntryService.newInstance(new Date(2015, 0, 1), new Date(2015, 11, 31)).then(function(aeService){
					for(var i=0;i<budgets.length;i++){
						budget = budgets[i];
						
					if (budget.year == thisYear){
							var spentEntries = aeService.getEntriesByCategory();
					
							$scope.budget = budget;
							
							budget.totalPlannedByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							budget.totalSpentByMonth   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							budget.plannedAcumulated   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							budget.spentAcumulated     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
							
							// Para cada grupo do orçamento...
							angular.forEach(budget.entryGroups, function(group){
								group.totalSpentByMonth   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
								group.totalPlannedByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
								group.totalSpent = 0;
								
								// Recupera o valor realizado para o grupo correspondente.
								if (spentEntries[group.categoryGroup.name]){
									group.totalSpent = Math.abs(spentEntries[group.categoryGroup.name].total);
									
									// Armazena total do grupo agrupado por mês para cálculo acumulado.
									for (var i=0;i<12;i++){
										budget.totalSpentByMonth[i] += Math.abs(spentEntries[group.categoryGroup.name].totalByMonth[i]);
										group.totalSpentByMonth[i] = Math.abs(spentEntries[group.categoryGroup.name].totalByMonth[i]);
									}
								}
								
								// Recupera o valor realizado para cada categoria
								angular.forEach(group.entries, function(entry){
									entry.totalSpentByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
									entry.inBudget     = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
								
									for (var i=0;i<12;i++){
										if (spentEntries[group.categoryGroup.name]){
											if (spentEntries[group.categoryGroup.name].data[entry.category.name]){
												// Total realizado por mês para a categoria.
												entry.totalSpentByMonth[i] = Math.abs(spentEntries[group.categoryGroup.name].data[entry.category.name].totalByMonth[i]);
												
												// Define o status dessa entrada -> 'ok' ou 'nok';
												entry.inBudget[i] = (entry.totalSpentByMonth[i] > entry[months[i]] ? false : true)
											}
										}
										
										// Armazena o valor planejado total do grupo agrupado por mês.
										group.totalPlannedByMonth[i] += entry[months[i]];
										budget.totalPlannedByMonth[i] += entry[months[i]];
									}
								});
								
								// Recupera valor planejado até este mês.
								group.plannedToThisMonth = 0;
								for (var i=0;i<=thisMonth;i++){
									group.plannedToThisMonth += group.totalPlannedByMonth[i];
								}
								
								group.percentSpent = setPercent(group.totalSpent, group.totalPlanned);
								group.percentExpected = setPercent(group.plannedToThisMonth, group.totalPlanned);
								group.status = setStatus(group.percentSpent, group.percentExpected);
								
							});
							
							// Calcula planejado e executado acumulado total.
							for (var i=0;i<12;i++){
								for (var r=i;r>=0;r--){
									budget.plannedAcumulated[i] += budget.totalPlannedByMonth[r];
									budget.spentAcumulated[i] += budget.totalSpentByMonth[r];
								}
							}
							
							$scope.chartConfig.series[0] = {name: "Total Planejado", data: $scope.budget.plannedAcumulated};
							$scope.chartConfig.series[1] = {name: "Total Executado", data: $scope.budget.spentAcumulated};
							$scope.chartConfig.xAxis.categories = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
							
							break;
						}
					};
				
					// Se não possui orçamento cadastrado para este ano, redireciona para inclusão.
					if (!$scope.budget){
						$location.path('/new/budget');
					}
				});
				
			});
			
			// Aciona o detalhamento da conta, recuperando todos os lançamentos realizados ali.
			$scope.edit = function (budget){
				$location.path('/budget/'+ budget.id);
			};
			
			// Faz o zoom no grupo para avaliar as categorias.
			$scope.zoomInOut = function (entryGroup){
				entryGroup.zoomIn = !entryGroup.zoomIn;
			}
			
			$scope.selectInOut = function (entryGroup){
				entryGroup.selected = !entryGroup.selected;
				
				// Itera pelos grupos para atualizar o gráfico
				var plannedSeries = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var spentSeries   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var found = false;
				$scope.chartConfig.series = [];
				angular.forEach($scope.budget.entryGroups, function(group){
					if (group.selected){
						for (var i=0;i<12;i++){
							for (var r=i;r>=0;r--){
								plannedSeries[i] += group.totalPlannedByMonth[r];
								spentSeries[i] += group.totalSpentByMonth[r];
							}
						}
						found = true;
					}
				});
				
				if (!found){
					$scope.chartConfig.series[0] = {name: "Total Planejado", data: $scope.budget.plannedAcumulated};
					$scope.chartConfig.series[1] = {name: "Total Executado", data: $scope.budget.spentAcumulated};					
				} else {
					$scope.chartConfig.series.push({name: "Parcial Planejado", data: plannedSeries});
					$scope.chartConfig.series.push({name: "Parcial Executado", data: spentSeries});
				}
			}
			
			//*********** CHART **************//
			$scope.chartConfig = {
				options: {
			        chart: {
			            type: 'areaspline'
			        },
			        plotOptions: {
			            areaspline: {
			                fillOpacity: 0.5
			            },
			            lineWidth: 1,
			            series: {
			                marker: {
			                    radius: 2
			                },
			                states: {
			                	hover: {
			                		lineWidthPlus: 0
			                	}
			                }
			            }
			        },
			        tooltip: {
			            shared: true,
			            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>R$ {point.y: ,.2f}</b><br/>'
			        }
				},
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            categories: [],
		        },
		        yAxis: {
		            title: {
		                text: ''
		            },
			        labels:{
			        	enabled: true
			        }
		        },
		        series: [],
	            "credits": {"enabled": false},
	           	"loading": false,
	           	"size": {
	        	   "width": "",
	        	   "height": "380"
	           	}
		    }
		}
	]);
});

function setPercent(dividend, divisor){
	var percent = 0;
	
	var dividend = dividend * (dividend >= 0 ? 1 : -1);
	var divisor = divisor;
	
	if (divisor > 0 && dividend > 0){
		percent = Math.round( (dividend / divisor) * 100 );
	}
	
	return percent;
}

function setStatus(perSpent, perExpected){
	var status = "ok";
	
	if (perSpent > perExpected){
		status = "danger";
	} else if ((perExpected - perSpent) < 10 ) {
		status = "warning";
	} else if ((perExpected - perSpent) > 25){
		status = "sucess"
	}
	
	return status;
}