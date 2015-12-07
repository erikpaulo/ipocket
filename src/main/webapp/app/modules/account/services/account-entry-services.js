define(['./module', '../controllers/account-entry-resources'], function (app) {
	
	app.service('AccountEntryService', ['$http', '$q', 'AccountEntryResource', function($http, $q, AccountEntry) {
		return{

			newInstance: function(startDate, endDate){
				var deferred = $q.defer();
				var instance = {};
				
				// Recupera os lançamento realizados no período informado.
				AccountEntry.listAllLByPeriod({startDate: startDate, endDate: endDate}).$promise.then(function (data){
					instance.period = {startDate: startDate, endDate: endDate};
					instance.entries = data;

					// Recupera os lançamentos realizados no período agrupado por categoria
					instance.getEntriesByCategory = function(){
						var holder = [];
						var entries = null;
						
						if (instance.entries){
							
							// Itera pelos lançamentos agrupando por grupo de categoria e categoria.
							angular.forEach(instance.entries, function(entry){
								if (entry.category){
									var groupName = entry.category.groupName;
									var catName = entry.category.name;
									
									// Grupo de categoria
									if (!holder[groupName]) holder[groupName] = {total: 0, totalByMonth:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], accumulated:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], data: []};
									holder[groupName].total += entry.amount;
									holder[groupName].totalByMonth[new Date(entry.date).getMonth()] += entry.amount;
									
									// Categoria
									if (!holder[groupName].data[catName]) holder[groupName].data[catName] = {total: 0, totalByMonth:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], accumulated:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
									holder[groupName].data[catName].total += entry.amount;
									holder[groupName].data[catName].totalByMonth[new Date(entry.date).getMonth()] += entry.amount;
								}
							});
							
							// Gasto realizado acumulado por mês;
//							for (var groupName in holder){
//								for (var i=0;i<holder[groupName].accumulated.length;i++){
//									for (var r=i;r>=0;r--){
//										holder[groupName].accumulated[i] += holder[groupName].totalByMonth[r];
//									}
//								}
//							}
						}
						
						
						return holder;
					}
					deferred.resolve(instance);
					
				});
				return deferred.promise;
			}
		}
	}]);
});
