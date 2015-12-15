define(['./module', '../../shared/services/constants-service'], function (app) {
	
	app.service('BillService', ['$q', 'ConstantsService', function($q, Constants) {
		return{

			newInstance: function(accounts, bills){
				billsProjection = {};
				billsProjection.accounts = accounts;
				billsProjection.bills = bills;
				
				/**
				 * A partir das contas e lançamentos programados, realiza a projeção do fluxo de
				 * caixa no período informado e retorna em uma serie.
				 */
				billsProjection.getCashFlowProjection = function(startDate, endDate, groupBy) {
					var series = [];
					var labels = [];
					
					// Gera os labels.
					var date = new Date(startDate.getTime());
					date.setDate(1);
					while (date <= endDate){
						labels[getGroupId(date, groupBy)] = 0;
						if (groupBy == "Day"){
							date.setDate(date.getDate()+1);
						} else {
							date.setMonth(date.getMonth()+1);
						}
					}
					
					// Itera pelas contas e de acordo com a periodicidade, define o saldo total dessas contas nesses períodos.
					angular.forEach(this.accounts, function(account){
						doSum(account.name, account.createDate, account.startBalance, groupBy);
						angular.forEach(account.entries, function(entry){
							doSum(account.name, entry.date, entry.amount, groupBy);
						})
					});
					
					// Itera pelos lançamentos programados fazendo projeção do fluxo de caixa.
					angular.forEach(bills, function(bill){
						var accountName, destinyAccountName;
						
						// Recupera o nome da conta associada ao lançameto programado.
						for (var a in billsProjection.accounts){
							if (this.billsProjection.accounts[a].id == bill.accountId){
								accountName = this.billsProjection.accounts[a].name;
							}
							if (this.billsProjection.accounts[a].id == bill.destinyAccountId){
								destinyAccountName = this.billsProjection.accounts[a].name;
							}
						}
						angular.forEach(bill.billEntries, function(billEntry){
							if (series[accountName]){
								doSum(accountName, billEntry.date, billEntry.amount, groupBy);
							}
							if (series[destinyAccountName]){
								doSum(destinyAccountName, billEntry.date, billEntry.amount*-1, groupBy);
							}
						})
					})
					
					// Realiza a soma do valor no mês correspondente.
					function doSum(serieName, date, amount, groupBy){
						if (!angular.isDate(date)) date = new Date(date);
						if (!series[serieName]) {
							var newLabels = {};
							newLabels = copy(labels);
							series[serieName] = newLabels;
						}
						
						if (date >= startDate && date <= endDate){
							series[serieName][getGroupId(date, groupBy)] += amount;
						} else {
							if (date < startDate){
								series[serieName][getGroupId(startDate, groupBy)] += amount;
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
							
						} else if (groupBy == 'Day'){
							return source.getDate() +'/'+ (parseInt(source.getMonth())+1) +'/'+ source.getFullYear();
						} 
						else if (groupBy == 'Subcategory'){
							return source.name +':'+ source.subCategoryName;
							
						} else if (groupBy == 'Category'){
							return source.name;
						}
					}
					
					// Elimina os pontos sem valor
					if (groupBy == "Day"){
						for (var labelName in labels){
							found = false;
							for (var serieName in series){
								if (series[serieName][labelName] == 0){
									found = true;
								} else {
									found = false;
									break;
								}
							}
							
							if (found){
								for (var serieName in series){
									delete series[serieName][labelName];
									delete labels[labelName];
								}
							}
						}
					}
					
					var color = ['#666666', '#6699CC', '#3399CC', '#6666FF', '#669900', '#669933', '#669966']
					
					var cashFlowProjection = {labels: [], series: []};
					var i = 0;
					for (var serieName in series){
						var balance = 0;
						cashFlowProjection.series[i] = {name: serieName, data:[], color: color[i%7], visible: (i==0)};
						for (var labelName in series[serieName]) {
							balance += series[serieName][labelName]
							cashFlowProjection.series[i].data.push(balance);
						}
						i++;
					}
					
					for (var labelName in labels){
						cashFlowProjection.labels.push(labelName);
					}
					
					return cashFlowProjection;
				}
				
				return billsProjection;
			}
		}
	}]);
});

