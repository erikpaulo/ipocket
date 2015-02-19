define(['./module'], function (app) {

	app.factory('ChartService', function() {
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
			
			function getGroupId(date, groupBy){
				if (groupBy == "Month") {
					return monthNames[date.getMonth()] +'/'+ date.getFullYear();
				} else if (groupBy == "Week") {
					var day;
					if (date.getDate()>28){
						var newDate = new Date(date);
						newDate.setMonth(date.getMonth()+1);
						newDate.setDate(-0);
						day = newDate.getDate();
					} else {
						day = Math.ceil((date.getDate()/7))*7;
					}
					return day +'/'+ monthNames[date.getMonth()] +'/'+ date.getFullYear();
				}
			}
			
			function copy(source){
				var arr = [];
				for (var i in source){
					arr[i] = source[i];
				}
				return arr;
			}
			
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
});
