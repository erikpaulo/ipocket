define(['./module', './bill-resources', '../../account/controllers/category-resources', '../../account/controllers/account-resources'], function (app) {

	app.controller('BillController', ['$scope', '$modal', 'BillResource', 'CategoryResource', 'AccountResource', 'uiGridConstants',
        function($scope, $modal, Bill, Category, Account, uiGridConstants) {
		$scope.appContext.changeCurrentContext($scope.modules[0].id);
		
		$scope.bills = null;
		$scope.bill = null;
		$scope.categories = null;
		$scope.accounts = null;
		
		// Configura a tabela com as contas
		$scope.gridOptions = {
				enableSorting: false,
				enableRowSelection: true, 
				enableSelectAll: false,
				multiSelect: false,
				enableFiltering: false,
				enableRowHeaderSelection: false,
				enableColumnMenus: false,
				rowHeight: 25,
				excessRows:15,
				minRowsToShow:8,
				columnDefs: [
				     {field: 'billEntries[0].date', displayName: 'Data', type: 'date', cellFilter: "date:'dd/MM/yyyy'", width: '85', enableFiltering: false, cellClass: 'align-date', headerCellClass: 'align-date'},
				     {field: 'description', displayName: 'Descrição', width: '*', visible: $scope.fullLayout},
				     {field: 'category.getFullName()', displayName: 'Categoria', width: '*', filter: {condition: uiGridConstants.filter.CONTAINS}},
		             {field: 'account.name', displayName: 'Conta Bancária'},
		             {field: 'billEntries[0].amount', 
		            	 displayName: 'Valor', 
		            	 width: '130', 
		            	 cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope align-currency" ng-class="{positive:grid.getCellValue(row,col)>0, negative:grid.getCellValue(row,col)<0}">{{grid.getCellValue(row,col) | currency:"R$ "}}</div></div>', 
		                 headerCellClass: 'align-currency'
		             }
	             ]
		
		};
		
		// Registra eventos na tabela de lançamentos para permitir seleção nas linhas.
		$scope.gridOptions.onRegisterApi = function( gridApi ) {
			$scope.gridApi = gridApi;
		};
		
		// Recupera a lista de categorias disponível no sistema.
		Category.listAll(function(data){
			$scope.categories = data;
		});
		
		// Lista todas as contas já cadastradas para o usuário.
		Account.listAll(function(accounts){
			$scope.accounts = accounts
		});
		
		// Recupera todos os lançamentos programados registrados para o usuário.
		Bill.listAll(function(bills){
			$scope.gridOptions.data = $scope.bills = bills;
			updateListView($scope.bills);
		});
		
		// Aciona modal para criação de nova conta.
		$scope.new = function(){
			save(new Bill());
		}
		
		// Altera um lançamento programado previamente incluído.
		$scope.edit = function(){
			if ($scope.gridApi.selection.getSelectedRows().length>0){
				save($scope.gridApi.selection.getSelectedRows()[0]);
			} else {
				console.log('Selecione uma linha para editar.')
			}
		}
		
		var save = function(scopeBill){
			$scope.bill = scopeBill;
			
			var modalInstance = openModal($scope, $modal, ModalInstanceCtrl, (scopeBill.id ? "edit" : "new"));
			modalInstance.result.then(function (bill) {
				// Recupera o objecto correspondente a conta selecionada.
				for(var i=0;i<$scope.accounts.length;i++){
					if ($scope.accounts[i].id == bill.account.id){
						bill.account = $scope.accounts[i];
						break;
					}
				}
				
				// Recupera o objecto correspondente a categoria selecionada.
				for(var i=0;i<$scope.categories.length;i++){
					if ($scope.categories[i].id == bill.category.id){
						bill.category = $scope.categories[i];
						break;
					}
				}
				
				// Inclui ou altera um lançamento programado.
				bill.$save(function(){
					updateListView($scope.bills, bill);
				});
			});
		}
		
		// Remove uma conta programada.
		$scope.delete = function(){
			if ($scope.gridApi.selection.getSelectedRows().length>0){
				var bill = $scope.gridApi.selection.getSelectedRows()[0];
				bill.$delete(function(){
					for (var i=0;i<$scope.bills.length;i++){
						if ($scope.bills[i].id == bill.id){
							$scope.bills.splice(i, 1);
						}
					}
				})
			} else {
				console.log('Selecione uma linha para editar.')
			}
		}
		
		// Atualiza a lista de lançamentos programados ordenando crescente pela data.
		var updateListView = function (bills, newEntry){
			
			// Localiza o id do novo lançamento para decidir se atualiza ou cria.
			if (newEntry){
				for (var ae=0;ae<bills.length;ae++){
					if (newEntry.id == bills[ae].id){
//						angular.extend(bills[ae], newEntry);
						bills[ae] = newEntry;
						break;
					}
				}
				if ((ae == undefined || ae == bills.length)){
					bills.push(newEntry);
				}
			}
			
			// Adiciona função para recuperar os nomes da categoria com subcategoria
		    angular.forEach(bills, function(row){
		    	if (row.category){
					if (!row.category.getFullName){
						row.category.getFullName = function() {
							return this.name + ' : ' + this.subCategoryName;
						}
				    }
		    	} else {
		    		return '';
		    	}
		    });
			
			// Ordena crescente pela data.
			bills.sort(function(a, b){
				if (!angular.isDate(a.date)) a.date = new Date(a.date);
				if (!angular.isDate(b.date)) b.date = new Date(b.date);
				return b.date - a.date;
			});
			
			// Ordena as entradas de cada lançamento programado.
			for (var i=0;i<bills.length;i++){
				bills[i].billEntries.sort(function(a, b){
				if (!angular.isDate(a.date)) a.date = new Date(a.date);
				if (!angular.isDate(b.date)) b.date = new Date(b.date);
				return a.date - b.date;
				})
			}
			
			return bills;
		}
		
		
		
		/*****************
		 * Modal
		 ****************/
        function openModal($scope, $modal, ModalInstanceCtrl, action){
        	
    		var modalInstance = $modal.open({
    			templateUrl: (action == 'new' ? 'modules/bill/views/modal-new-bill.html' : 'modules/bill/views/modal-edit-bill.html'),
    			controller: ModalInstanceCtrl,
    			size: 'lg',
    			resolve: {
    				bill: function () {
    					return $scope.bill;
    				},
    				categories: function(){
    					return $scope.categories;
    				},
    				accounts: function(){
    					return $scope.accounts;
    				}
    			}
    		});
    		
    		return modalInstance;
        }
        
     	var ModalInstanceCtrl = function ($scope,  $modalInstance, bill, categories, accounts) {
     		$scope.categories = categories;
     		$scope.bill = bill; 
     		$scope.accounts = accounts;
     		$scope.types = [
     		       {id: 'F', value: 'Valor Fixo'}, 
     		       {id: 'A', value: 'Valor Médio'}
     		];
     		
     		$scope.ok = function ( form ) {
     			if (form.$valid){
     				$modalInstance.close($scope.bill);
     			} else {
     				dirtyFormFields(form);
     			}
     		};
     		
     		$scope.cancel = function () {
     			$modalInstance.dismiss('cancel');
     		};
     	}

		
	}]);
});

function dirtyFormFields(form){
	for (var validation in form.$error){
		for (var field in form.$error[validation]){
			if (form.$error[validation][field].$pristine){
				form.$error[validation][field].$pristine = false;
			}
		}
	}
}