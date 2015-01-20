define(['./module', './account-resources', './account-entry-resources', './category-resources'], function (app) {

	
	app.controller('AccountEntryController', ['$scope', '$filter', '$routeParams', 'AccountResource', 'AccountEntryResource', 'CategoryResource', 'MessageHandler', 'uiGridConstants',
        function($scope, $filter, $routeParams, Account, AccountEntry, Category, MessageHandler, uiGridConstants) {
		
		  	$scope.tabs = [
		  	             { title:'Direto', type: 'D', active: true },
		                 { title:'Transferência', type: 'T', active: false }
		               ];
		
			$scope.appContext.changeCurrentContext($scope.modules[0].id);
			$scope.account = {};
			$scope.accounts = [];
			$scope.accountEntry = {};
			$scope.categories = null;

			// Opções para definição do ng-grid com os lançamentos da conta.
			$scope.gridOptions = {
					enableSorting: false,
					enableRowSelection: true, 
					enableSelectAll: false,
					multiSelect: false,
					enableFiltering: true,
					enableRowHeaderSelection: false,
					enableColumnMenus: false,
					rowHeight: 25,
					excessRows:50,
					minRowsToShow:12,
					columnDefs: [
			             {field: 'id', displayName: 'id', visible: false},
			             {field: 'accountId',displayName: 'accountId',  visible: false},
			             {field: 'userId',displayName: 'userId',  visible: false},
			             {field: 'date', displayName: 'Data', type: 'date', cellFilter: "date:'dd/MM/yyyy'", width: '8%', enableFiltering: false, cellClass: 'align-date', headerCellClass: 'align-date'},
			             {field: 'description', displayName: 'Descrição', width: '*'},
			             {field: 'category.getFullName()', displayName: 'Categoria', width: '*', filter: {condition: uiGridConstants.filter.CONTAINS}},
			             {field: 'reconciled', displayName: 'R', width: '5', enableFiltering: false, cellClass: 'align-date', headerCellClass: 'align-date'},
			             {field: 'amount', displayName: 'Valor', cellFilter: 'currency: "R$ "', width: '10%', cellClass: 'align-currency', headerCellClass: 'align-currency'},
			             {field: 'balance', displayName: 'Saldo', cellFilter: 'currency: "R$ "', width: '10%', enableFiltering: false, cellClass: 'align-currency', headerCellClass: 'align-currency'}
		             ]
			
			};
			
			// Registra eventos na tabela de lançamentos para permitir seleção nas linhas.
			$scope.gridOptions.onRegisterApi = function( gridApi ) {
				$scope.gridApi = gridApi;
				gridApi.selection.on.rowSelectionChanged($scope,function(row){
					if (row.isSelected){
						angular.extend($scope.accountEntry, row.entity);
					} else {
						$scope.accountEntry = {};
					}
				});
			};
			
			// Recupera todas as contas do usuário para usar em transferências
			Account.listAll(function (data){
				$scope.accounts = data;
			})
			
			// Recupera a lista de categorias disponível no sistema.
			Category.listAll(function(data){
				$scope.categories = data;
			});
			
			// Recupera os dados da conta selecionada juntamente com seus lançamentos.
			Account.get({id: $routeParams.accountID}, function(account){
				$scope.account = $scope.updateView(account);
				$scope.gridOptions.data = $scope.account.entries;
			}, function(err){
				console.log(err)
			});
			
			// Salva um novo ou já existente lançamento na conta selecionada.
			$scope.save = function(form){
				if (form.$valid){
					$scope.accountEntry.category = $filter('filter')($scope.categories, {id: $scope.accountEntry.category.id})[0];
					$scope.accountEntry.type = $filter('filter')($scope.tabs, {active: true})[0].type;
					
					var entry = new AccountEntry({accountId: $scope.account.id});
					angular.extend(entry, $scope.accountEntry);
					
					// Salva
					entry.$save(function(data){
						$scope.clear(form);
						$scope.updateView($scope.account, data.object, null);
					},function(err){
						console.log('Não foi possível salvar o lançamento da conta. err: '+ err);
					});
				} else {
					dirtyFormFields(form);
				}
			};
				
			// Remove o lançamento selecionado na tabela.
			$scope.remove = function (form){
				if ($scope.accountEntry.id){
					new AccountEntry({accountId: $scope.account.id, id: $scope.accountEntry.id}).$delete(function(data){
						if (data.success) {
							$scope.updateView($scope.account, null, $scope.accountEntry)
							$scope.clear(form);
						} else console.log('Erro na remoção do lançamento.'); 
					},function(err){
						console.log('Não foi possível remover o lançamento selecionado. err: '+ err);
					});
				} else {
					$scope.clear(form);
				}
				
			}
				
			// Limpa o form e remove seleção no grid.
			// Cancela a operação de edição ou inclusão de um novo lançamento na conta.
			$scope.clear = function(form){
				$scope.gridApi.selection.clearSelectedRows();
				$scope.accountEntry = {};
				form.$setPristine();
			}
			
			/**
			 * Atualiza o Array de lançamentos para serem atualizados no grid.
			 */
			$scope.updateView = function (account, newEntry, delEntry){
					
				// Localiza o id do novo lançamento para decidir se atualiza ou cria.
				if (newEntry || delEntry){
					for (var ae=0;ae<account.entries.length;ae++){
						if ((newEntry ? newEntry.id : delEntry.id) == account.entries[ae].id){
							if (newEntry) {
								angular.extend(account.entries[ae], newEntry);
							} else {
								$scope.account.entries.splice(ae,1);
							}
							break;
						}
					}
					if ((ae == undefined || ae == account.entries.length) && newEntry){
						account.entries.push(newEntry);
					}
				}
				
				// Adiciona função para recuperar os nomes da categoria com subcategoria
			    angular.forEach(account.entries, function(row){
					if (!row.category.getFullName){
						row.category.getFullName = function() {
							return this.name + ' : ' + this.subCategoryName;
						}
				    }
			    });
				
				// Ordena decrescente pela data.
				account.entries.sort(function(a, b){
					if (!angular.isDate(a.date)) a.date = new Date(a.date);
					if (!angular.isDate(b.date)) b.date = new Date(b.date);
					return a.date - b.date;
				});
				
				// Atualiza o saldo após o lançamento em questão.
				var balance = 0;
				for (var e in account.entries){
					balance += account.entries[e].amount;
					account.entries[e].balance = balance;
				}
				
				// Atualiza o saldo total da conta.
				account.balance = balance;
				
				return account;
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