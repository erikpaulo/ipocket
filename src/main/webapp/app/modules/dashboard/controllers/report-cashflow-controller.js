define(['./module', '../../bill/controllers/bill-resources', '../../bill/services/bill-service', '../../account/controllers/account-resources'], function (app) {

	app.controller('CashflowController', ['$scope', 'AccountResource', 'BillResource', 'BillService',
        function($scope, Account, Bill, BillService) {
		$scope.accounts;
		$scope.bills;
		$scope.selectedAccountIds;
		
		$scope.select2Options = {
			minimumResultsForSearch: -1
		}
		
		var start = new Date();
		$scope.selectedPeriod = 1;
		$scope.periodOptions = [
		    {id:1 , name:"Este ano" , start: start, end: new Date(start).setMonth(11)},
		    {id:2 , name:"Próximos 6 meses" , start: start, end: new Date(start).setMonth(start.getMonth() + 6)},
		    {id:3 , name:"Próximos 12 meses" , start: start, end: new Date(start).setMonth(start.getMonth() + 12)},
		    {id:4 , name:"Próximos 24 meses" , start: start, end: new Date(start).setMonth(start.getMonth() + 24)}
		]
		
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
		            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>R$ {point.y: .,2f}</b><br/>'
		        }
			},
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            title: {
	                text: ''
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
				
		// Lista todas as contas já cadastradas para o usuário.
		Account.listAll(function(accounts){
			$scope.accounts = accounts;
		});
		
		// Recupera todos os lançamentos programados do usuário.
		Bill.listAll(function(bills){
			$scope.bills = bills;
		});
		
		// Filtra os itens selecionadas e aciona a geração do gráfico.
		$scope.generateChart = function(){
			var selectedAccounts = [];
			var selectedBills = [];
			var startDate = new Date();
			var endDate = new Date()
			
			// Recupera todas as contas (object) selecionadas pelo usuário.
			for (var aId in $scope.selectedAccountIds){
				for (var i=0;i<$scope.accounts.length;i++){
					if ($scope.accounts[i].id == $scope.selectedAccountIds[aId]){
						selectedAccounts.push($scope.accounts[i]);
						break;
					}
				}
			}
			
			// Recupera os lançamentos programados relacionadas às contas selecionadas.
			for (var i=0;i<$scope.bills.length;i++){
				for (var aId in $scope.selectedAccountIds){
					if ($scope.bills[i].accountId == $scope.selectedAccountIds[aId]){
						selectedBills.push($scope.bills[i]);
					}
				}
			}
			
			// Recupera o período de geração do gráfico.
			for (var p in $scope.periodOptions){
				if ($scope.periodOptions[p].id == $scope.selectedPeriod){
					startDate = $scope.periodOptions[p].start;
					endDate = $scope.periodOptions[p].end;
				}
			}

			// Atualiza o gráfico.
			updateChart(selectedAccounts, selectedBills, startDate, endDate);
		}
		
		
		function updateChart(selectedAccounts, selectedBills, startDate, endDate){
			var billsProjection = BillService.newInstance(selectedAccounts, selectedBills);
			var cashFlowProjection = billsProjection.getCashFlowProjection(startDate, endDate);
			
			$scope.chartConfig.xAxis.categories = cashFlowProjection.labels;
			$scope.chartConfig.series = cashFlowProjection.series;
		}
		
	}]);
});