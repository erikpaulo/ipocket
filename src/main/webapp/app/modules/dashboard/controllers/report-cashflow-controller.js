define(['./module', '../../bill/services/bill-resources', '../../bill/services/bill-service', '../../account/services/account-resources'], function (app) {

	app.controller('CashflowController', ['$scope', 'AccountResource', 'BillResource', 'BillService',
        function($scope, Account, Bill, BillService) {
		$scope.accounts;
		$scope.bills;
//		$scope.selectedAccountIds;
		
		$scope.select2Options = {
			minimumResultsForSearch: -1
		}
		
		var start = new Date();
		$scope.Selected = {period: 0};
		$scope.periodOptions = [
		    {id:0 , name:"Este ano" , start: start, end: function(){
           	 var date = new Date(start);
        	 date.setMonth(12);
        	 date.setDate(-0);
        	 return date;
		    }},
		    {id:1 , name:"Próximos 6 meses" , start: start, end: function(){
		    	var date = new Date(start);
		    	date.setMonth(start.getMonth() + 7)
		    	date.setDate(-0);
		    	return date;
		    }},
		    {id:2 , name:"Próximos 12 meses" , start: start, end: function(){
		    	var date = new Date(start);
		    	date.setMonth(start.getMonth() + 13)
		    	date.setDate(-0);
		    	return date;
		    }},
		    {id:3 , name:"Próximos 24 meses" , start: start, end: function(){
		    	var date = new Date(start);
		    	date.setMonth(start.getMonth() + 25)
		    	date.setDate(-0);
		    	return date;
		    }}
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
			
			// Recupera todos os lançamentos programados do usuário.
			Bill.listAll(function(bills){
				$scope.bills = bills;
				
				$scope.generateChart();
			});
		});
		
		// Filtra os itens selecionadas e aciona a geração do gráfico.
		$scope.generateChart = function(){
			var startDate = $scope.periodOptions[$scope.Selected.period].start;
			var endDate = $scope.periodOptions[$scope.Selected.period].end();

			// Atualiza o gráfico.
			var billsProjection = BillService.newInstance($scope.accounts, $scope.bills);
			var cashFlowProjection = billsProjection.getCashFlowProjection(startDate, endDate, "Month");
			
			$scope.chartConfig.xAxis.categories = cashFlowProjection.labels;
			$scope.chartConfig.series = cashFlowProjection.series;
		}
		
	}]);
});