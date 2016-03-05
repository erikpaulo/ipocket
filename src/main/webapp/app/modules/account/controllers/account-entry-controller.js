define(['./module',
        '../services/account-resources',
        '../../categorization/services/subcategory-resources',
        '../services/account-entry-resources',
        '../../shared/services/utils-service.js'], function (app) {


	app.controller('AccountEntryController', ['$scope', '$http', '$window', '$filter', '$routeParams', 'AccountResource', 'SubCategoryResource', 'AccountEntryResource', '$mdDialog', 'Utils',
        function($scope, $http, $window, $filter, $routeParams, Account, SubCategory, AccountEntry, $mdDialog, Utils) {
            $scope.appContext.contextMenu.actions = [];

            resetEditingEntry();

			var end = new Date();
			end.setMonth(end.getMonth()+1);
			end.setDate(-0)
			$scope.period = {selected: 0};
			$scope.period.options = [
			    {id:0 , name:"Ultimos 03 meses" , start: function(){
		           	 var date = new Date(end);
		        	 date.setMonth(end.getMonth()-2);
		        	 date.setDate(1);
		        	 return date;
				    }, end: function(){
				    	return end;
				    }},
			    {id:1 , name:"Ultimos 06 meses" , start: function(){
		           	 var date = new Date(end);
		        	 date.setMonth(end.getMonth()-5);
		        	 date.setDate(1);
		        	 return date;
				    }, end: function(){
				    	return end;
				    }},
			    {id:2 , name:"Ultimos 12 meses" , start: function(){
		           	 var date = new Date(end);
		        	 date.setMonth(end.getMonth()-11);
		        	 date.setDate(1);
		        	 return date;
				    }, end: function(){
				    	return end;
				    }},
			    {id:3 , name:"Todos" , start: function(){
		           	 var date = new Date(1900,0,1);
		        	 return date;
			    }, end: function(){
			    	return end;
			    }},
			]

            // Get the account being detailed
//            new Account({id: $routeParams.accountID}).$get(function(account){
//                $scope.account = account;
//            });

            SubCategory.listAll(function(data){
                $scope.subCategories = data;
            });

			// gets the account statement for the selected period.
			$scope.getStatement = function(){
				Account.statement({	id: $routeParams.accountID,
									start: $scope.period.options[$scope.period.selected].start(),
									end: $scope.period.options[$scope.period.selected].end()}).$promise.then(function(data){
					$scope.account = data;
                    $scope.appContext.contextPage = 'Contas: '+ $scope.account.name;
				});
			}
			$scope.getStatement();

            // Gets all user baking accounts.
            Account.listAll(function(accounts){
                $scope.accounts = accounts;
            })

            // Select one entry, signaling it to user
            $scope.select = function(entry){
                if (entry.selected) {
                    entry.selected = false;
                    $scope.editEntry = undefined;
                    $scope.entryForm.$setUntouched();
                    $scope.entryForm.$setPristine();
                } else {
                    unselectAll();
                    entry.selected = true;
                    $scope.editEntry = angular.copy(entry);
                    if (!angular.isDate($scope.editEntry.date))
                        $scope.editEntry.date = new Date($scope.editEntry.date);
                }
            }

            // Unselect all entries in this account.
            function unselectAll(){
                angular.forEach($scope.account.entries, function(entry){
                    entry.selected = false;
                });
            }

            // Cancels some edit or create process.
            $scope.cancel = function(){
                resetEditingEntry();
                $scope.entryForm.$setUntouched();
                $scope.entryForm.$setPristine();
                unselectAll();
            }

            // Create a new entry in current account
            $scope.new = function(){
                if (!angular.isNumber($scope.editEntry.amount))
                    $scope.editEntry.amount = Utils.currencyToNumber($scope.editEntry.amount)
                new AccountEntry($scope.editEntry).$new(function(data){
                    resetEditingEntry();
                    $scope.getStatement();
                    addWarning($scope, 'Lançamento incluído com sucesso.')
                }, function (err){
                    addError($scope, 'Problemas ao incluir o lançamento', err);
                });
            }

			// Save an existing entry
			$scope.save = function(){
				if (!angular.isNumber($scope.editEntry.amount))
			        $scope.editEntry.amount = Utils.currencyToNumber($scope.editEntry.amount)

                new AccountEntry($scope.editEntry).$save(function(data){
                    resetEditingEntry();
                    $scope.getStatement();
                    addWarning($scope, 'Lançamento alterado com sucesso.')
                }, function (err){
                    addError($scope, 'Problemas ao alterar o lançamento.', err);
                });
			};

			// Removes this entry from the current account
			$scope.remove = function (){

                new AccountEntry($scope.editEntry).$delete(function(data){
                    resetEditingEntry();
                    $scope.getStatement();
                    addWarning($scope, 'Lançamento excluído com sucesso.')
                }, function (err){
                    addError($scope, 'Problemas ao excluir o lançamento.', err);
                });

			}


			// Recupera a lista de categorias disponível no sistema.
//			Category.listAll(function(data){
//				$scope.categories = data;
//			});


//			// Sensibiliza um dos lançamentos da conta como selecionado pelo usuário.
//			$scope.selectEntry = function(entry){
//				if (!angular.isDate(entry.date)) entry.date = new Date(entry.date);
//				if (!entry.selected) entry.selected = false;
//
//				entry.selected = !entry.selected;
//				if (selectedEntry && entry.id != selectedEntry.id ){
//					selectedEntry.selected = false;
//				}
//
//				if (entry.selected){
//					selectedEntry = entry;
//					angular.extend($scope.accountEntry, entry);
//				} else {
//					selectedEntry = null;
//					$scope.accountEntry = {};
//				}
//			}

//			// Salva um novo ou já existente lançamento na conta selecionada.
//			$scope.save = function(form){
//				if (!angular.isNumber($scope.accountEntry.amount))
//					$scope.accountEntry.amount = parseFloat($scope.accountEntry.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
//				if (form.$valid){
//					for (var i in $scope.categories){
//						if ($scope.categories[i].id == $scope.accountEntry.category.id){
//							$scope.accountEntry.category =  $scope.categories[i];
//						}
//					}
//					$scope.accountEntry.type = $filter('filter')($scope.tabs, {active: true})[0].type;
//
//					var entry = new AccountEntry({accountId: $scope.account.id});
//					angular.extend(entry, $scope.accountEntry);
//
//					// Salva
//					entry.$save(function(data){
//						// Recupera o extrato atualizado.
//						$scope.getStatement();
//						$scope.clear(form);
//					},function(err){
//						console.log('Não foi possível salvar o lançamento da conta. err: '+ err);
//					});
//				} else {
//					dirtyFormFields(form);
//				}
//			};

//			// Remove o lançamento selecionado na tabela.
//			$scope.remove = function (form){
//				if ($scope.accountEntry.id){
//					new AccountEntry({accountId: $scope.account.id, id: $scope.accountEntry.id}).$delete(function(data){
//						// Recupera o extrato atualizado.
//						$scope.getStatement();
//						$scope.clear(form);
//					},function(err){
//						console.log('Não foi possível remover o lançamento selecionado. err: '+ err);
//					});
//				} else {
//					$scope.clear(form);
//				}
//
//			}

//			// Limpa o form e remove seleção no grid.
//			// Cancela a operação de edição ou inclusão de um novo lançamento na conta.
//			$scope.clear = function(form){
//				if (selectedEntry) {
//					selectedEntry.selected = false;
//					selectedEntry = null;
//				}
//				$scope.accountEntry = {};
//				form.$setPristine();
//			}

//			$scope.uploadFile = function() {
//				// Abre a modal.
//				var modalInstance = openModal($scope, $filter, $modal, ModalInstanceCtrl)
//				modalInstance.result.then(function (entries) {
//					var entriesToImport = [];
//					angular.forEach(entries, function(row){
//						if (row.ok)	entriesToImport.push(row);
//					})
//					$http.post('api/account/'+ $scope.account.id +'/entries/import', entriesToImport).
//					  success(function(data, status, headers, config) {
//						  // Recupera o extrato atualizado.
//						  $scope.getStatement();
//					  }).
//					  error(function(data, status, headers, config) {
//						  console.log('NOK')
//					  });
//				});
//			}


//	        // Abre a modal.
//	        function openModal($scope, $filter, $modal, ModalInstanceCtrl){
//
//	    		var modalInstance = $modal.open({
//	    			templateUrl: 'modules/account/views/modal-upload-entries.html',
//	    			controller: ModalInstanceCtrl,
//	    			size: 'lg',
//	    			resolve: {
//	    				file: function () {
//	    					return $scope.fileWithEntries;
//	    				},
//	    				categories: function(){
//	    					return $scope.categories;
//	    				},
//	    				accountId: function(){
//	    					return $routeParams.accountID;
//	    				}
//	    			}
//	    		});
//
//	    		return modalInstance;
//	        }

//	     	/***********************************************************************
//			 * Controlador para tratamento da modal de edição/inserção.
//			 **********************************************************************/
//	     	var ModalInstanceCtrl = function ($scope, $filter, $modalInstance, FileUploader, file, accountId, categories) {
//
//	     		$scope.file = file;
//	     		$scope.entriesToImport = [];
//	     		$scope.categories = categories;
//
//	     		$scope.getConflictsText = function(conflicts){
//	     			var text = "";
//
//	     			angular.forEach(conflicts, function(row){
//	     				var date = $filter('date')(row.date, 'dd/MM/yyyy', 'GMT+3');
//	     				var amount = $filter('currency')(row.amount, 'R$ ', 2)
//	     				text += (text.length>0 ? '\n\n' : '') + '('+ date +' - '+ row.description +' - '+ amount +')';
//	     			});
//
//	     			return text;
//	     		}
//
//	     		 var uploader = $scope.uploader = new FileUploader({
//	 	        	url: 'api/account/'+ accountId +'/entries/upload'
//	     		 });
//
//		        uploader.onSuccessItem = function(fileItem, response, status, headers) {
//		        		$scope.entriesToImport = response;
//		        };
//
//	     		$scope.ok = function ( form ) {
//	     			$modalInstance.close($scope.entriesToImport);
//	     		};
//
//	     		$scope.cancel = function () {
//	     			$modalInstance.dismiss('cancel');
//	     		};
//	     	}

            // open a modal with the file entries to be complemented.
            $scope.import = function(entriesToComplement){
                openDialog($scope, $mdDialog, entriesToComplement).then(function(entries){
                    var entriesToImport = [];
                    angular.forEach(entries, function(entry){
                        if (!entry.exists){
                            this.push(entry);
                        }
                    }, entriesToImport);

                    $http.post('api/account/'+ $scope.account.id +'/entries/import', entriesToImport)
                        .success(function(data, status, headers, config) {
                            $scope.getStatement();
                            addWarning($scope, '('+ entries.length +') lançamentos importados com sucesso!');
                        })
                        .error(function(data, status, headers, config) {
                            addError($scope, 'Não foi possível importar os lançamentos', {data:{error: data.status, message: data.message}});
                        }
                    );
                });
            }

            function resetEditingEntry(){
                $scope.editEntry = {accountId: $routeParams.accountID};
            }
	}]);


    app.controller('UploadFileController', ['$scope', 'Upload',
        function($scope, Upload) {

            // upload on file select or drop
            $scope.upload = function (file) {
                if (file){
                    Upload.upload({
                        url: 'api/account/'+ $scope.account.id +'/entries/upload',
                        data: {file: file}
                    }).then(function (resp) {
                        // start the import process.
                        $scope.import(resp.data);
                    }, function (resp) {
                        addError($scope, 'Error status: ' + resp.status, '');
                    }, function (evt) {
                    });
                } else {
                    addError($scope, 'Tipo de arquivo inválido');
                }
            };
        }
    ]);
});

function openDialog($scope, $mdDialog, entriesToImport){

   return $mdDialog.show({
            controller: DialogController,
            templateUrl: 'modules/account/views/csv-import-template.html',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            locals: {
                subCategories: $scope.subCategories,
                entries: entriesToImport
            }
   });
}

function DialogController($scope, $mdDialog, subCategories, entries) {
    $scope.entries = entries;
    $scope.subCategories = subCategories;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        var entriesToImport = []
        angular.forEach($scope.entries, function(entry){
            if (!entry.exists){
               this.push(entry);
            }
        }, entriesToImport)
        $mdDialog.hide(entriesToImport);
    };
}