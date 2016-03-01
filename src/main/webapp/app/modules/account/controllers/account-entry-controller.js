define(['./module', '../services/account-resources',
        '../../configuration/services/category-resources'], function (app) {

	
	app.controller('AccountEntryController', ['$scope', '$http', '$window', '$filter', '$routeParams', 'AccountResource', 'CategoryResource',
        function($scope, $http, $window, $filter, $routeParams, Account, Category) {
            $scope.appContext.contextPage = 'Contas: Conta Tralala';
            $scope.appContext.contextMenu.actions = [];

            $scope.editEntry = undefined;

            // Get the account being detailed
            new Account({id: $routeParams.accountID}).$get(function(account){
                $scope.account = account;
            });

            //TODO: Recuperar as categorias definidas no sistema.
            $scope.categories = [
                {id: 1, name: 'Household: Diarista'},
                {id: 2, name: 'Household: Cemig'},
                {id: 3, name: 'House: Financiamento Santander'},
                {id: 4, name: 'Alimentação: Alimentação'},
                {id: 5, name: 'Transporte: Gasolina'},
                {id: 6, name: 'Transporte: IPVA'},
                {id: 7, name: 'Transporte: Seguro'},
                {id: 8, name: 'Income: Salário CI&T - Erik'},
                {id: 9, name: 'Education: Escola de Inglês'}
            ]

            //TODO: recuperar as contas do usuário.
            $scope.accounts = [
                {id: 1,name: 'CC: Itaú Personalitè',balance: 3456.8},
                {id: 2,name: 'CC: HSBC Premier',balance: 56.0},
                {id: 3,name: 'Poupança Personalitè',balance: 61986.02},
                {id: 3,name: 'Maximime DI',balance: 986.02},
                {id: 4,name: 'Itaú Personalitè - Visa Carol',balance: -10000.02},
                {id: 5,name: 'Itaú Personalitè - Visa Erik',balance: -2986.02}
            ]

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
                }
            }

            // Cancels some edit or create process.
            $scope.cancel = function(){
                $scope.editEntry = undefined;
                $scope.entryForm.$setUntouched();
                $scope.entryForm.$setPristine();
                unselectAll();
            }

            // Unselect all entries in this account.
            function unselectAll(){
                angular.forEach($scope.account.entries, function(entry){
                    entry.selected = false;
                });
            }

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
		
			// Recupera a lista de categorias disponível no sistema.
//			Category.listAll(function(data){
//				$scope.categories = data;
//			});
			
			// Atualiza o extrato de acordo com o período selecionado.
//			$scope.getStatement = function(){
//				// Recupera a conta selecionada com seu extrato.
//				Account.statement({	id: $routeParams.accountID,
//									start: $scope.periodOptions[$scope.Selected.period].start(),
//									end: $scope.periodOptions[$scope.Selected.period].end()}).$promise.then(function(data){
//					$scope.account = data;
//				});
//			}
//			$scope.getStatement();
			
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
	}]);


    app.controller('UploadFileController', ['$scope', 'Upload', '$mdDialog',
        function($scope, Upload, $mdDialog) {

            // upload on file select or drop
            $scope.upload = function (file) {
                if (file){
//                    Upload.upload({
//                        url: 'upload/url',
//                        data: {file: file, 'username': $scope.username}
//                    }).then(function (resp) {
//                        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
//                    }, function (resp) {
//                        console.log('Error status: ' + resp.status);
//                    }, function (evt) {
//                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
//                    });
                    //TODO: Enviar arquivo para servidor
                    var entriesToImport = [
                        {id: 1, date: new Date(), amount:-345.8, exists:true},
                        {id: 2, date: new Date(), amount:34566.8, exists:false},
                        {id: 3, date: new Date(), amount:-45.8, exists:false},
                        {id: 4, date: new Date(), amount:-4345.8, exists:false}
                    ]
                    openDialog($scope, $mdDialog, entriesToImport).then(function(entries){
                        $scope.appContext.toast.addWarning('('+ entries.length +') lançamentos importados com sucesso.')
                    });

                } else {
                    $scope.appContext.toast.addError('Tipo de arquivo inválido');
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
                categories: $scope.categories,
                entries: entriesToImport
            }
   });
}

function DialogController($scope, $mdDialog, categories, entries) {
    $scope.entries = entries;
    $scope.categories = categories;

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