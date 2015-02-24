define(['./module', '../../shared/services/constants-service', '../services/report-expenses-service', '../../account/controllers/account-resources', '../../account/controllers/category-resources'], function (app) {
	
	app.controller('ExpensesReportController', ['$scope', 'AccountResource', 'ExpenseReportService', 'ConstantsService',
	   function($scope, Account, ExpenseReport, Constants) {
			var start = new Date();
			start.setDate(1);
			$scope.periodOptions = [
	             {id:0 , name:"Este Mês" , start: function(){ 
	            	 return new Date(start)
	             }, end: function(){
	            	 var date = new Date(start);
	            	 date.setMonth(date.getMonth()+1);
	            	 date.setDate(-0);
	            	 return date;
	             }},
	             {id:1 , name:"Mês Anterior" , start: function(){ 
	            	 var date = new Date(start);
	            	 date.setMonth(start.getMonth()-1);
	            	 return date;
	             }, end: function(){
	            	 var date = new Date(start);
	            	 date.setDate(-0);
	            	 return date;
	             }},
	             {id:2 , name:"Ultimos 03 Meses" , start: function(){ 
	            	 var date = new Date(start);
	            	 date.setMonth(start.getMonth()-3);
	            	 return date;
	             }, end: function(){
	            	 var date = new Date(start);
	            	 date.setDate(-0);
	            	 return date;
	             }},
	             {id:3 , name:"Este ano" , start: function(){
	            	 var date = new Date(start);
	            	 date.setMonth(0);
	            	 return date;
	             }, end: function(){
	            	 var date = new Date(start);
	            	 date.setMonth(date.getMonth()+1);
	            	 date.setDate(-0);
	            	 return date;
	             }},
	             {id:4 , name:"Ultimo Ano" , start: function(){ 
	            	 var date = new Date(start);
	            	 date.setMonth(0);
	            	 date.setFullYear(start.getFullYear()-1);
	            	 return date;
	             }, end: function(){
	            	 var date = new Date(start);
	            	 date.setMonth(0);
	            	 date.setDate(-0);
	            	 return date;
	             }}
	          ];
			
			// Lista todas as contas já cadastradas para o usuário.
			Account.listAll(function(accounts){
				$scope.accounts = accounts;
				$scope.incomeAndExpenses = ExpenseReport.newInstance(accounts);
			});
	}]);
	
	app.controller('ERController.IncomeExpenseByCategoryType', ['$scope', '$filter', 'ExpenseReportService', 'ConstantsService',
        function($scope, $filter, ExpenseReport, Constants) {
	                                         			
			$scope.chartConfig = {
 				options: {
 					chart: {type: "scatter"},
 					plotOptions: {
 			          series: {
 			                fillOpacity: 0.1
 			            },
 		               "column": {
 		                   "stacking": 'normal',
 		                   "dataLabels": {
 		                       "enabled": false,
 		                       "color": (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
 		                       "style": {
 		                           textShadow: '0 0 3px black'
 		                       }
 		                   }
 		               }
 		           },
 		           "tooltip": {
 		               "formatter": function () {
 		                   return '<b>' + this.x + '</b><br/>' +
 		                       this.series.name + ': ' + $filter('currency')(this.y, "R$", 2) +
 		                       (this.point.stackTotal != undefined ? '<br/>' + 'Total: ' + $filter('currency')(this.point.stackTotal, "R$", 2) : '');
 		               }
 		           }
 				},
 				"series": [
 		           {
 		        	   "name": "Custo Irregular",
 		        	   "connectNulls": true,
 		        	   "id": "series-3",
 		        	   "type": "column"
 		           },
 		           {
 		        	   "name": "Custo Variável",
 		        	   "type": "column",
 		        	   "id": "series-2"
 		           },
 		           {
 		        	   "name": "Custo Fixo",
 		        	   "type": "column",
 		        	   "id": "series-1",
 		        	   "connectNulls": false,
 		        	   "lineWidth": ""
 		           },
 		           {
 		        	   "id": "series-4",
 		        	   "name": "Entrada",
 		        	   "type": "spline",
 		        	   "dashStyle": "Solid",
 		        	   "lineWidth": "2px",
 		        	   "connectNulls": true
 		           }
 		        ],
 	           "title": {"text": ""},
 	           "credits": {"enabled": false},
 	           "loading": false,
 	           "size": {
 	        	   "width": "",
 	        	   "height": "250"
 	           },
 	           "subtitle": {"text": ""},
 	           "xAxis": {
 	        	   "currentMin": 0
 	           },
 	           "yAxis": {
 	        	   "currentMin": 0
 	           }
 			}
 		
 			$scope.$watch('incomeAndExpenses', function(newValue, oldValue){
 				if ($scope.incomeAndExpenses){
 					$scope.updateChart();
 				}
 			})
 		
 			$scope.updateChart = function(){
 				var n1Series = $scope.incomeAndExpenses.getN1Series($scope.periodOptions[3].start(), $scope.periodOptions[3].end());
 				$scope.chartConfig.xAxis.categories = n1Series.labels;
 				$scope.chartConfig.series[0].data = eval('n1Series.data.$'+Constants.CATEGORY_TYPE.IRREGULAR_COST.id);
 				$scope.chartConfig.series[1].data = eval('n1Series.data.$'+Constants.CATEGORY_TYPE.VARIABLE_COST.id);
 				$scope.chartConfig.series[2].data = eval('n1Series.data.$'+Constants.CATEGORY_TYPE.FIXED_COST.id);
 				$scope.chartConfig.series[3].data = eval('n1Series.data.$'+Constants.CATEGORY_TYPE.INCOME.id);
 			}
 	}]);
	
	app.controller('ERController.ExpensesByCategory', ['$scope', '$filter', 'ExpenseReportService',
       function($scope, $filter, ExpenseReport) {
			$scope.select2Options = {
					minimumResultsForSearch: -1
			}
		  	
			$scope.selectedPeriod = 0;
			
			var brandsData =  [{"name":"Microsoft Internet Explorer ","y":53.61,"drilldown":"Microsoft Internet Explorer "},{"name":"Chrome ","y":18.73,"drilldown":"Chrome "},{"name":"Firefox ","y":19.899999999999995,"drilldown":"Firefox "},{"name":"Safari ","y":4.64,"drilldown":"Safari "},{"name":"Opera ","y":1.54,"drilldown":"Opera "},{"name":"Proprietary or Undetectable","y":0.29,"drilldown":null}]
			var drilldownSeries = [{"name":"Microsoft Internet Explorer ","id":"Microsoft Internet Explorer ","data":[["v8.0",26.61],["v9.0",16.96],["v6.0",6.4],["v7.0",3.55],["v8.0",0.09]]},{"name":"Chrome ","id":"Chrome ","data":[["v18.0",8.01],["v19.0",7.73],["v17.0",1.13],["v16.0",0.45],["v18.0",0.26],["v14.0",0.25],["v20.0",0.24],["v15.0",0.18],["v12.0",0.16],["v13.0",0.13],["v11.0",0.1],["v10.0",0.09]]},{"name":"Firefox ","id":"Firefox ","data":[["v12",6.72],["v11",4.72],["v13",2.16],["v3.6",1.87],["v10",0.9],["v9.0",0.65],["v8.0",0.55],["v4.0",0.5],["v3.0",0.36],["v3.5",0.36],["v6.0",0.32],["v5.0",0.31],["v7.0",0.29],["v14",0.1],["v2.0",0.09]]},{"name":"Safari ","id":"Safari ","data":[["v5.1",3.53],["v5.0",0.85],["v4.0",0.14],["v4.1",0.12]]},{"name":"Opera ","id":"Opera ","data":[["v11.x",1.3],["v12.x",0.15],["v10.x",0.09]]}]
			
			$scope.chartConfig = {
					"options": {
						"chart": {
							"type": 'pie'
						},
						"tooltip": {
							"enabled": false,
							"headerFormat": '<span style="font-size:11px">{series.name}</span><br>',
							"pointFormat": '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
						},
						"plotOptions": {
							"series": {
								"dataLabels": {
									"enabled": true,
									"format": '{point.name}: R${point.y:,.2f}'
								}
							}
						},
						"drilldown": {
							"series": []
						}
					},
	                "title": {
	                    "text": ''
	                },
	                "subtitle": {
	                    "text": ''
	                },
	                "series": [{
	                    "name": 'Categorias',
	                    "colorByPoint": true,
	                    "data": []
	                }],
	                "credits": {"enabled": false},
	 	           	"loading": false,
	 	           	"size": {
	 	        	   "width": "",
	 	        	   "height": "280"
	 	           	}
	            }
			
			$scope.updateChart = function(){
				var expensesByCategory = $scope.incomeAndExpenses.getN2SeriesForPie($scope.periodOptions[$scope.selectedPeriod].start(), $scope.periodOptions[$scope.selectedPeriod].end());
				$scope.chartConfig.series[0].data = expensesByCategory.series;
				$scope.chartConfig.options.drilldown.series = expensesByCategory.drilldownSeries;
			}
			
 			$scope.$watch('incomeAndExpenses', function(newValue, oldValue){
 				if ($scope.incomeAndExpenses){
 					$scope.updateChart();
 				}
 			})
		}]);
	
	app.controller('ERController.ExpensesByCategoryEvolution', ['$scope', '$filter', 'AccountResource', 'CategoryResource', 'ConstantsService',
        function($scope, $filter, Account, Category, Constants) {
			
			$scope.chartConfig = {
				"options": {
			        chart: {
			            type: 'area'
			        },
			        plotOptions: {
			        	area: {
//			        		stacking: 'percent',
			        		lineColor: '#ffffff',
			        		lineWidth: 1,
			        		marker: {
			        			enabled: false,
			        			lineWidth:1,
			        			lineColor: '#ffffff',
		        				width: 0.5,
		        				height: 0.5
			        		}
			        	},
			            series: {
			                fillOpacity: 0.8
			            }
			        },
					tooltip: {
			               formatter: function () {
			                   return '<b>' + this.x + '</b><br/>' +
			                       this.series.name + ': ' + $filter('currency')(this.y, "R$", 2) +
			                       (this.point.stackTotal != undefined ? '<br/>' + 'Total: ' + $filter('currency')(this.point.stackTotal, "R$", 2) : '');
			               }
					}
				},
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
//		            categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
//		            tickmarkPlacement: 'on',
		            title: {
		                enabled: false
		            }
		        },
		        yAxis: {
		            title: {
		                text: 'Percent'
		            }
		        },
		        series: [{
		            name: 'Custo Irregular',
//		            data: [502, 635, 809, 947, 1402, 3634, 5268]
		        }, {
		            name: 'Custo Variável',
//		            data: [106, 107, 111, 133, 221, 767, 1766]
		        }, {
		            name: 'Custo Fixo',
//		            data: [163, 203, 276, 408, 547, 729, 628]
		        }],
                "credits": {"enabled": false},
 	           	"loading": false,
 	           	"size": {
 	        	   "width": "",
 	        	   "height": "318"
 	           	}
		    }
			
 			$scope.$watch('incomeAndExpenses', function(newValue, oldValue){
 				if ($scope.incomeAndExpenses){
 					// Recupera a lista de categorias disponível no sistema.
 					Category.listAll(function(categories){
 						$scope.updateChart(categories);
 					});
 					
 				}
 			})
 		
 			$scope.updateChart = function(categories){
				var selectedCategories = [];

				// Recupera as categorias para as quais deseja recuperar os valores.
				angular.forEach(categories, function(category){
					if (category.type == Constants.CATEGORY_TYPE.IRREGULAR_COST.id || 
						category.type == Constants.CATEGORY_TYPE.VARIABLE_COST.id || 
						category.type == Constants.CATEGORY_TYPE.FIXED_COST.id){
						selectedCategories.push(category);
					}
				})
 				var n2Series = $scope.incomeAndExpenses.getN2Series(selectedCategories, $scope.periodOptions[4].start(), $scope.periodOptions[3].end());
 				$scope.chartConfig.xAxis.categories = n2Series.labels;
 				var series = []
 				for (var name in n2Series.data){
 					series.push({name: name.replace('$', ''), data: n2Series.data[name]});
 				}
 				$scope.chartConfig.series = series;
			}
	}]);
	
});