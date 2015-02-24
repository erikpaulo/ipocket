define(['./module'], function (app) {

	app.factory('ChartLineService', function() {
		return function(bankingAccounts, bills, beginDate, endDate, options){
			var monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
			var holder = [];
			var labels = [];
			
			if (!angular.isDate(beginDate)) beginDate = new Date(beginDate);
			beginDate.setDate(1);
			
			if (!angular.isDate(endDate)) endDate = new Date(endDate);
			endDate.setMonth(endDate.getMonth()+1)
			endDate.setDate(-0);
			
			// Gera os labels.
			var date = new Date(beginDate.getTime());
			while (date <= endDate){
				labels[getGroupId(date, options.groupBy)] = 0;
				if (options.groupBy == "Month"){
					date.setMonth(date.getMonth()+1);
				} else if (options.groupBy == "Week") {
					date.setDate(date.getDate()+7);
				}
			}
			
			// Itera pelas contas e de acordo com a periodicidade, define o saldo total dessas contas nesses períodos.
			angular.forEach(bankingAccounts, function(account){
				doSum(account.name, account.createDate, account.startBalance, options.groupBy);
				angular.forEach(account.entries, function(entry){
					doSum(account.name, entry.date, entry.amount, options.groupBy);
				})
			});
			
			// Itera pelos lançamentos programados fazendo projeção do fluxo de caixa.
			angular.forEach(bills, function(bill){
				var accountName, destinyAccountName;
				
				// Recupera o nome da conta associada ao lançameto programado.
				for (var a in bankingAccounts){
					if (bankingAccounts[a].id == bill.accountId){
						accountName = bankingAccounts[a].name;
					}
					if (bankingAccounts[a].id == bill.destinyAccountId){
						destinyAccountName = bankingAccounts[a].name;
					}
				}
				if (exists(holder, accountName)){
					angular.forEach(bill.billEntries, function(billEntry){
						doSum(accountName, billEntry.date, billEntry.amount, options.groupBy);
					})
				}
				if (exists(holder, destinyAccountName)){
					angular.forEach(bill.billEntries, function(billEntry){
						doSum(destinyAccountName, billEntry.date, billEntry.amount*-1, options.groupBy);
					})
				}
			})

			// Realiza a soma do valor no mês correspondente.
			function doSum(serie, date, amount, groupBy){
				if (!angular.isDate(date)) date = new Date(date);
				if (!exists(holder, serie)){
					var newLabels = {};
					newLabels = copy(labels);
					holder[serie] = newLabels;
				}
				
				if (date >= beginDate && date <= endDate){
					holder[serie][getGroupId(date, groupBy)] += amount;
				} else {
					if (date < beginDate){
						holder[serie][getGroupId(beginDate, groupBy)] += amount;
					}
				}
			}
			

			
			function copy(source){
				var arr = [];
				for (var i in source){
					arr[i] = source[i];
				}
				return arr;
			}
			
			var chartInstance = {};
			chartInstance.labels = [];
			chartInstance.data = [];
			chartInstance.series = [];
			for (var serie in holder){
				var data = [];
				var balance = 0;
				for (var label in holder[serie]){
					balance += holder[serie][label];
					data.push(balance.toFixed(2));
					if (!exists(chartInstance.labels, label)) 
						chartInstance.labels.push(label);
				}

				chartInstance.series.push(serie)
				chartInstance.data.push(data);
			}
			
//			$scope.data = chartInstance.data;
//			$scope.labels = chartInstance.labels;
//			$scope.series = chartInstance.series;
			
			return chartInstance
		}
	});
	
	/**
	 * Serviço para traduzir os lançamentos nas contas e lançamentos programados em estrutura
	 * entendida pelos gráficos de Pizza Charts.js.
	 */
	app.factory('ChartPieService', function() {
	var defaultsColours = [
         { // blue - #97BBCD
        	 fillColor: "rgba(151,187,205,0.2)",
        	 strokeColor: "rgba(151,187,205,1)",
        	 pointColor: "rgba(151,187,205,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(151,187,205,0.8)"
         },
         { // Roxo - #8A67C1
        	 fillColor: "rgba(138,103,193,0.2)",
        	 strokeColor: "rgba(138,103,193,1)",
        	 pointColor: "rgba(138,103,193,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(138,103,193,0.8)"
         },
         { // red - #F7464A
        	 fillColor: "rgba(247,70,74,0.2)",
        	 strokeColor: "rgba(247,70,74,1)",
        	 pointColor: "rgba(247,70,74,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(247,70,74,0.8)"
         },
         { // green
        	 fillColor: "rgba(70,191,189,0.2)",
        	 strokeColor: "rgba(70,191,189,1)",
        	 pointColor: "rgba(70,191,189,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(70,191,189,0.8)"
         },
         { // yellow
        	 fillColor: "rgba(253,180,92,0.2)",
        	 strokeColor: "rgba(253,180,92,1)",
        	 pointColor: "rgba(253,180,92,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(253,180,92,0.8)"
         },
         { // blue
        	 fillColor: "rgba(52,152,219,0.2)",
        	 strokeColor: "rgba(52,152,219,1)",
        	 pointColor: "rgba(52,152,219,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(52,152,219,0.8)"
         },
         { // dark green
        	 fillColor: "rgba(3,108,0,0.2)",
        	 strokeColor: "rgba(3,108,0,1)",
        	 pointColor: "rgba(3,108,0,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(3,108,0,1)"
         },
         { // dark pink
        	 fillColor: "rgba(215,19,79,0.2)",
        	 strokeColor: "rgba(215,19,79,1)",
        	 pointColor: "rgba(215,19,79,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(215,19,79,1)"
         },
         { // dark blue - #102098
        	 fillColor: "rgba(16,32,152,0.2)",
        	 strokeColor: "rgba(16,32,152,1)",
        	 pointColor: "rgba(16,32,152,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(16,32,152,1)"
         },
         { // light yellow - #BCB472
        	 fillColor: "rgba(188,180,114,0.2)",
        	 strokeColor: "rgba(188,180,114,1)",
        	 pointColor: "rgba(188,180,114,1)",
        	 pointStrokeColor: "#fff",
        	 pointHighlightFill: "#fff",
        	 pointHighlightStroke: "rgba(188,180,114,1)"
         }
         ];

		return function(accounts, startDate, endDate, options){
			var dataStructure = [];
			dataStructure.labels = [];
			dataStructure.data = [];
			dataStructure.colours = [];
			
			var holder = [];
			var items = [];
			
			angular.forEach(accounts, function(account){
				angular.forEach(account.entries, function(entry){
					if (options.kind == "JustDebit" && entry.amount < 0 && entry.category.type != 'T'){
						var date = new Date(entry.date);
						if (date >= startDate && date <= endDate){
							var grouper = getGroupId(entry.category, options.groupId);
							if (!exists(holder, grouper)){
								holder[grouper] = 0;
							}
							holder[grouper] += entry.amount;
						}
					}
				})
			})
			
			for (var key in holder) items.push([key, holder[key]]);
			items.sort(function(a, b){
				return a[1] - b[1];
			});
			var max=0;
			for (var i=0;i<items.length;i++) {
				dataStructure.labels.push(items[i][0]);
				dataStructure.data.push(items[i][1]);
				dataStructure.colours.push(defaultsColours[i]);
				if (++max>=10) break;
			}

			return dataStructure;
		}
		
	});
});

/**
 * Verifica o o item informado existe no array como um item ou uma chave de hash.
 * @param arr Array
 * @param item Item a ser localizado.
 * @returns {Boolean}
 */
function exists(arr, item) {
	var found = false;
	for(var i in arr){
		if (i == item || arr[i] == item){
			found = true
			break;
		}
	}
	
	return found;
}

/**
 * Recupera o o agrupador apropriado da fonte informada.
 * @param sorce - pode ser uma data ou uma categoria
 * @param groupBy
 */
function getGroupId(source, groupBy){
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