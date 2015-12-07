define(['./module', '../services/account-resources', './account-entry-resources', '../../configuration/services/category-resources'], function (app) {

	
	app.controller('AccountEntryController', ['$scope', '$http', '$modal', '$window', '$filter', '$routeParams', 'AccountResource', 'AccountEntryResource', 'CategoryResource', 'MessageHandler', 'uiGridConstants', 'FileUploader',
        function($scope, $http, $modal, $window, $filter, $routeParams, Account, AccountEntry, Category, MessageHandler, uiGridConstants, FileUploader) {
			var selectedEntry = null;
			$scope.accountEntry = {};
		  	$scope.tabs = [
		  	             { title:'Direto', type: 'D', active: true },
		                 { title:'Transferência', type: 'T', active: false }
		    ];
		  	
			var end = new Date();
			end.setMonth(end.getMonth()+1);
			end.setDate(-0)
			$scope.Selected = {period: 0};
			$scope.periodOptions = [
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
			Category.listAll(function(data){
				$scope.categories = data;
			});
			
			// Atualiza o extrato de acordo com o período selecionado.
			$scope.getStatement = function(){
				// Recupera a conta selecionada com seu extrato.
				Account.statement({	id: $routeParams.accountID, 
									start: $scope.periodOptions[$scope.Selected.period].start(), 
									end: $scope.periodOptions[$scope.Selected.period].end()}).$promise.then(function(data){
					$scope.account = data;
				});
			}
			$scope.getStatement();
			
			// Sensibiliza um dos lançamentos da conta como selecionado pelo usuário.
			$scope.selectEntry = function(entry){
				if (!angular.isDate(entry.date)) entry.date = new Date(entry.date);
				if (!entry.selected) entry.selected = false;
				
				entry.selected = !entry.selected;
				if (selectedEntry && entry.id != selectedEntry.id ){
					selectedEntry.selected = false;
				}
				
				if (entry.selected){
					selectedEntry = entry;
					angular.extend($scope.accountEntry, entry);
				} else {
					selectedEntry = null;
					$scope.accountEntry = {};
				}
			}
			
			// Salva um novo ou já existente lançamento na conta selecionada.
			$scope.save = function(form){
				if (!angular.isNumber($scope.accountEntry.amount))
					$scope.accountEntry.amount = parseFloat($scope.accountEntry.amount.replace('R$ ', '').replace('.', '').replace(',', '.')); 
				if (form.$valid){
					for (var i in $scope.categories){
						if ($scope.categories[i].id == $scope.accountEntry.category.id){
							$scope.accountEntry.category =  $scope.categories[i];
						}
					}
					$scope.accountEntry.type = $filter('filter')($scope.tabs, {active: true})[0].type;
					
					var entry = new AccountEntry({accountId: $scope.account.id});
					angular.extend(entry, $scope.accountEntry);
					
					// Salva
					entry.$save(function(data){
						// Recupera o extrato atualizado.
						$scope.getStatement();
						$scope.clear(form);
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
						// Recupera o extrato atualizado.
						$scope.getStatement();
						$scope.clear(form);
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
				if (selectedEntry) {
					selectedEntry.selected = false;
					selectedEntry = null;
				}
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
						  // Recupera o extrato atualizado.
						  $scope.getStatement();
					  }).
					  error(function(data, status, headers, config) {
						  console.log('NOK')
					  });
				});
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
	     		 });
	     		 
		        uploader.onSuccessItem = function(fileItem, response, status, headers) {
		        		$scope.entriesToImport = response;
		        };
	     		
	     		$scope.ok = function ( form ) {
	     			$modalInstance.close($scope.entriesToImport);
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