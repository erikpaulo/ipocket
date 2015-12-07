define(['./module', '../services/budget-resources', '../../account/services/account-resources', '../services/budget-service'], function (app) {

	app.controller('BudgetController', ['$scope', '$modal', '$routeParams', 'BudgetService', 'BudgetResource', 'AccountResource', 
        function($scope, $modal, $routeParams, BudgetService, Budget, Account, AccountEntry, CategoryGroup) {
		
			// Controlador do wizard.
			$scope.wizardControl = BudgetService.newWizardControl();
		
			// Recupera o orçamento do usuário.
			BudgetService.initBudget().then(function (budget){
				$scope.budget = budget;
			});
			
			// Somatório indicando o valor total para orçamento no grupo da categoria.
			$scope.groupTotalBudget = function (entryGroup) {
				var total = 0;
				angular.forEach(entryGroup.entries, function(row){
					total += (row.totalAnnual ? row.totalAnnual : 0);
				});
				entryGroup.totalPlanned = total;
				return total;
			}
			
			// Somatório indicando o valor total para orçamento da categoria.
			$scope.entryTotal = function(entry){
				var total = 0;
				
				if (!entry.totalAnnual){
					total = entry.janPlanned + entry.febPlanned + entry.marPlanned + entry.aprPlanned + entry.mayPlanned + entry.junPlanned + 
					entry.julPlanned + entry.augPlanned + entry.sepPlanned + entry.octPlanned + entry.novPlanned + entry.decPlanned;
					
					entry.totalAnnual = total;
				}
				return entry.totalAnnual;
			}
			
			// Abre modal para detalhamento do orçamento por mês.
			$scope.detailAmount = function (entry){
				var modalInstance = openModal($scope, $modal, ModalInstanceCtrl, entry)
				modalInstance.result.then(function (data) {
					angular.extend(entry, data);
					BudgetService.updateEntry(entry, false).then(function(data){
						entry = data;
					});
				});
			}
			
			// Replica o mesmo valor para todos os meses
			$scope.setThisMonth = function (entry) {
				BudgetService.updateEntry(entry, true).then(function(data){
					entry = data;
				});
			}
			
			$scope.finish = function(){
				BudgetService.createOrUpdateBudget($scope.budget);
			}
			

			/***********************************************************************
			 * MODAL
			 */
	        function openModal($scope, $modal, ModalInstanceCtrl, entry){
	        	
	    		var modalInstance = $modal.open({
	    			templateUrl: 'modules/budget/views/modal-detailamount-budget.html',
	    			controller: ModalInstanceCtrl,
	    			size: 'md',
	    			resolve: {
	    				entry: function () {
	    					return entry;
	    				}
	    			}
	    		});
	    		
	    		return modalInstance;
	        }
			
	        // CONTROLADOR
	     	var ModalInstanceCtrl = function ($scope, $filter, $modalInstance, entry) {

	     		$scope.entry = entry;
	     		
	     		$scope.ok = function ( form ) {
	     			$modalInstance.close($scope.entry);
	     		};

	     		$scope.cancel = function () {
	     			$modalInstance.dismiss('cancel');
	     		};
	     	}
			
		}
	]);
});