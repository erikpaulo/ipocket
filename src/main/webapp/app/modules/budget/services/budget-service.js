define(['./module', './budget-resources',
        '../../configuration/services/category-group-resources',
        '../../shared/services/utils-service'],
        function (app) {
	
	app.service('BudgetService', ['$q', '$routeParams', 'BudgetResource', 'CategoryGroupResource', 'Utils', function($q, $routeParams, Budget, CategoryGroup, Utils) {
		var thisMonth = new Date().getMonth();
		var months = ["janPlanned","febPlanned", "marPlanned", "aprPlanned", "mayPlanned", "junPlanned", "julPlanned", "augPlanned", "sepPlanned", "octPlanned", "novPlanned", "decPlanned"]
		
		return{

			/**************************************************************
			 * Create a new instance of Budget, starting from the categories
			 * configured by the user.
			 */
			initNewBudget: function (thisYear){
				var deferred = $q.defer();

				CategoryGroup.listAll(function(groups) {
				    var budget = {year: thisYear, totalIncome: 0, totalExpense: 0, groups:[]};

				    // groups
				    angular.forEach(groups, function(group){
				        var bGroup = {group: group, categories: [], anualPlan: 0};

				        // categories
				        angular.forEach(group.categories, function(category){
				            var bCat = {category: category, subcategories: [], anualPlan: 0}

				            // subcategories
				            angular.forEach(category.subcategories, function(sc){
				                this.subcategories.push({subcategory: sc, monthPlan:0, anualPlan: 0})
				            }, bCat);
				            this.categories.push(bCat)

				        }, bGroup);
				        budget.groups.push(bGroup);
				    });

				    deferred.resolve(budget);
				});
				
				return deferred.promise;
			},

			updateCalculatedFields: function(budget){
			    budget.totalIncome = 0;
			    budget.totalExpense = 0;

			    angular.forEach(budget.groups, function(group){
			        angular.forEach(group.categories, function(category){
			            angular.forEach(category.subcategories, function(subcat){
			                if (subcat.monthPlan != 0){
			                    subcat.anualPlan = Utils.currencyToNumber(subcat.monthPlan) * 12;

			                    //TODO: pensar em uma maneira melhor de classificar os grupos de categoria
			                    if (group.group.name == 'Entradas'){
			                        budget.totalIncome += subcat.anualPlan;
			                    } else if (group.group.name == 'Despesas'){
			                        budget.totalExpense += subcat.anualPlan;
			                    }
			                }
			            });
			        });
			    });
			}
		}
	}]);
});