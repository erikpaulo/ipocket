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

            SubCategory.listAll(function(data){
                $scope.subCategories = data;
            });
            $scope.querySearch = function(query){
                return $filter('filter')($scope.subCategories, query);
            }

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
                    resetEditingEntry();
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
                $scope.searchText = undefined;
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
                $scope.searchText = "";
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

function DialogController($scope, $mdDialog, $filter, subCategories, entries) {
    $scope.entries = entries;
    $scope.subCategories = subCategories;


    $scope.querySearch = function(query){
        return $filter('filter')($scope.subCategories, query);
    }

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