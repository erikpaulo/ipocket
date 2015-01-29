define(['./module', './account-resources', './account-entry-resources', './category-resources'], function (app) {

	
	app.controller('AccountEntryController', ['$scope', '$http', '$modal', '$window', '$filter', '$routeParams', 'AccountResource', 'AccountEntryResource', 'CategoryResource', 'MessageHandler', 'uiGridConstants', 'FileUploader',
        function($scope, $http, $modal, $window, $filter, $routeParams, Account, AccountEntry, Category, MessageHandler, uiGridConstants, FileUploader) {
			var profile = ($window.innerWidth > 768 ? 'TOTAL' : 'MINIMUM');
		  	$scope.tabs = [
		  	             { title:'Direto', type: 'D', active: true },
		                 { title:'Transferência', type: 'T', active: false }
		               ];
		
			$scope.appContext.changeCurrentContext($scope.modules[0].id);
			$scope.account = {};
			$scope.accounts = [];
			$scope.accountEntry = {};
			$scope.categories = null;
			$scope.fileWithEntries = null;

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
			             {field: 'date', displayName: 'Data', type: 'date', cellFilter: "date:'dd/MM/yyyy'", width: '85', enableFiltering: false, cellClass: 'align-date', headerCellClass: 'align-date'},
			             {field: 'description', displayName: 'Descrição', width: '*', visible: (profile == 'TOTAL' ? true : false)},
			             {field: 'category.getFullName()', displayName: 'Categoria', width: '*', filter: {condition: uiGridConstants.filter.CONTAINS}},
			             {field: 'reconciled', displayName: 'R', width: '5', enableFiltering: false, cellClass: 'align-date', headerCellClass: 'align-date', visible: (profile == 'TOTAL' ? true : false)},
			             {field: 'amount', 
			            	 displayName: 'Valor', 
			            	 width: '130', 
			            	 cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope align-currency" ng-class="{positive:grid.getCellValue(row,col)>0, negative:grid.getCellValue(row,col)<0}">{{grid.getCellValue(row,col) | currency:"R$ "}}</div></div>', 
			                 headerCellClass: 'align-currency'
			             },
			             {field: 'balance', 
			            	 displayName: 'Saldo', 
			            	 cellFilter: 'currency: "R$ "', 
			            	 width: '10%', 
			            	 enableFiltering: false, 
			            	 cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope align-currency" ng-class="{positive:grid.getCellValue(row,col)>0, negative:grid.getCellValue(row,col)<0}">{{grid.getCellValue(row,col) | currency:"R$ "}}</div></div>',
			            	 headerCellClass: 'align-currency', 
			            	 visible: (profile == 'TOTAL' ? true : false)}
		             ]
			
			};
			
			// De acordo com a resolução corrente, show/hide algumas colunas.
			
			
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
			
			$scope.uploadFile = function() {
				// Abre a modal.
				var modalInstance = openModal($scope, $filter, $modal, ModalInstanceCtrl)
				modalInstance.result.then(function (entries) {
					var entriesToImport = [];
					angular.forEach(entries, function(row){
						if (row.ok)	entriesToImport.push(row);
					})
					$http.post('api/account/'+ $scope.account.id +'/entries/import', entriesToImport).
					  success(function(data, status, headers, config) {
						  if(data.success){
							  angular.forEach(data.object, function(row){
								  $scope.account.entries.push(row);
							  })
							  $scope.updateView($scope.account);
						  }
					  }).
					  error(function(data, status, headers, config) {
						  console.log('NOK')
					  });
				});
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
			
	        
			
	        // Abre a modal.
	        function openModal($scope, $filter, $modal, ModalInstanceCtrl){
	        	
	    		var modalInstance = $modal.open({
	    			templateUrl: 'modules/account/views/modal-upload-entries.html',
	    			controller: ModalInstanceCtrl,
	    			size: 'lg',
	    			resolve: {
	    				file: function () {
	    					return $scope.fileWithEntries;
	    				},
	    				categories: function(){
	    					return $scope.categories;
	    				},
	    				accountId: function(){
	    					return $routeParams.accountID;
	    				}
	    			}
	    		});
	    		
	    		return modalInstance;
	        }
	        
	     	/***********************************************************************
			 * Controlador para tratamento da modal de edição/inserção.
			 **********************************************************************/
	     	var ModalInstanceCtrl = function ($scope, $filter, $modalInstance, FileUploader, file, accountId, categories) {

	     		$scope.file = file;
	     		$scope.entriesToImport = [];
	     		$scope.categories = categories;
	     		
	     		$scope.getConflictsText = function(conflicts){
	     			var text = "";
	     			
	     			angular.forEach(conflicts, function(row){
	     				var date = $filter('date')(row.date, 'dd/MM/yyyy', 'GMT+3');
	     				var amount = $filter('currency')(row.amount, 'R$ ', 2)
	     				text += (text.length>0 ? '\n\n' : '') + '('+ date +' - '+ row.description +' - '+ amount +')';
	     			});
	     			
	     			return text;
	     		}
	     		
	     		 var uploader = $scope.uploader = new FileUploader({
	 	        	url: 'api/account/'+ accountId +'/entries/upload'
//	 	        	headers: {'Content-Type': 'multipart/form-data'}
	     		 });
	     		 
//	     		uploader.onAfterAddingFile = function(fileItem) {
//		            console.info('onAfterAddingFile', fileItem);
//		        };
//		        uploader.onAfterAddingAll = function(addedFileItems) {
//		            console.info('onAfterAddingAll', addedFileItems);
//		        };
//		        uploader.onBeforeUploadItem = function(item) {
////		        	item.formData = angular.toJson(item.file)
//		            console.info('onBeforeUploadItem', item);
//		        };
//		        uploader.onProgressItem = function(fileItem, progress) {
//		            console.info('onProgressItem', fileItem, progress);
//		        };
//		        uploader.onProgressAll = function(progress) {
//		            console.info('onProgressAll', progress);
//		        };
		        uploader.onSuccessItem = function(fileItem, response, status, headers) {
		        	if (response.sucess){
		        		$scope.entriesToImport = response.object;
		        	} else {
		        		console.log('Não foi possível preparar o arquivo para import dos lançamentos. Message: '+ response.message)
		        	}
		        };
//		        uploader.onErrorItem = function(fileItem, response, status, headers) {
//		            console.info('onErrorItem', fileItem, response, status, headers);
//		        };
//		        uploader.onCancelItem = function(fileItem, response, status, headers) {
//		            console.info('onCancelItem', fileItem, response, status, headers);
//		        };
//		        uploader.onCompleteItem = function(fileItem, response, status, headers) {
//		            console.info('onCompleteItem', fileItem, response, status, headers);
//		        };
//		        uploader.onCompleteAll = function() {
//		            console.info('onCompleteAll');
//		        };
	     		
	     		$scope.ok = function ( form ) {
//	     			if (form.$valid){
	     				$modalInstance.close($scope.entriesToImport);
//	     			} else {
//	     				dirtyFormFields(form);
//	     			}
	     		};

	     		$scope.cancel = function () {
	     			$modalInstance.dismiss('cancel');
	     		};
	     	}
	     	
	        function dirtyFormFields(form){
	    		for (var validation in form.$error){
	    			for (var field in form.$error[validation]){
	    				if (form.$error[validation][field].$pristine){
	    					form.$error[validation][field].$pristine = false;
	    				}
	    			}
	    		}
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