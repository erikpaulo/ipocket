define([ './module', './category-resources' ], function(module) {

	module.filter('mapType', function() {
		var typeHash = {
                'F' : 'Despesa Fixa', 
             	'V' : 'Despesa Variável',
             	'I' : 'Despesa Irregular',
             	'E' : 'Entrada',
             	'T' : 'Transferência'
				};
 
				return function(input) {
					if (!input){
						return '';
			} else {
				return typeHash[input];
			}
		};
	});
	
	module.controller('CategoryController', ['$scope', '$log', '$http', 'CategoryResource',
	    function($scope, $log, $http, Category) {
			$scope.selectedCategories = [];
			
			// Recupera as categorias já cadastradas no banco para o usuário.
			$scope.categories = [];
			Category.listAll().$promise.then(function(categories){
				$scope.gridOptions.data = $scope.categories = categories;
			},function(reason){
				$log.error('Não foi possível recuperar as categorias do usuário. Erro: '+ reason);
			});

			$scope.gridOptions = {
					enableColumnMenus: false,
					enableFiltering: true,
					enableSorting: true,
					multiSelect: true,
					minRowsToShow:15,
					enableRowHeaderSelection: true
			};
			$scope.gridOptions.columnDefs = [
			      { name: 'name', 
			    	  displayName: 'Categoria', 
			    	  width: '40%',
			    	  editableCellTemplate: '<div class="ui-grid-cell-custom"><form name="inputForm"><input type="text" ng-class="\'colt\' + col.uid" ui-grid-editor="" ng-model="row.entity[\'name\']"></form></div>'
			      },
			      { name: 'subCategoryName', 
			    	  displayName: 'SubCategoria' , 
			    	  width: '40%', 
			    	  editableCellTemplate: '<div class="ui-grid-cell-custom"><form name="inputForm"><input type="text" ng-class="\'colt\' + col.uid" ui-grid-editor="" ng-model="row.entity[\'subCategoryName\']"></form></div>' },
                  { name: 'type', 
			    	displayName: 'Tipo', 
			    	editableCellTemplate: '<div class="ui-grid-cell-custom"><form name="inputForm"><select ng-class="\'colt\' + col.uid" ui-grid-edit-dropdown="" ng-model="row.entity[\'type\']" ng-options="field[editDropdownIdLabel] as field[editDropdownValueLabel]  for field in editDropdownOptionsArray" class="" style="width: 180px;"></select></form></div>', 
			    	cellFilter: 'mapType',
			    	width: '20%',
                    editDropdownOptionsArray: [
                        {id : 'F', value : 'Despesa Fixa'}, 
                     	{id : 'V', value : 'Despesa Variável'},
                     	{id : 'I', value : 'Despesa Irregular'},
                     	{id : 'E', value : 'Entrada'},
                     	{id : 'T', value : 'Transferência'}
                     	] 
			      }
             ];
			
			$scope.gridOptions.onRegisterApi = function(gridApi){
				$scope.gridApi = gridApi;
				
				// Editable row
				gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
					$scope.save(rowEntity);
				});
			};

			$scope.new = function(){
				$scope.categories.unshift(new Category());
			}
			
			$scope.save = function(category) {
				// Valida se os campos obrigatórios foram preenchidos.
				if (validate(category)){
					category.$new();
				}
			};
			
			// Remove Categoria
			$scope.remove = function() {
				var categories = $scope.gridApi.selection.getSelectedRows();
				$http.post('api/account/category/deleteList', categories).
				  success(function(data, status, headers, config) {
					  
					  // Atualiza a visualização da tabela.
					  for (var iRemoved in categories){
						  for (var iList in $scope.categories){
							  if ( categories[iRemoved].id == $scope.categories[iList].id ){
								  $scope.categories.splice(iList, 1);
								  break;
							  }
						  }
					  }
				  }).
				  error(function(data, status, headers, config) {
					  console.log('Erro ao tentar remover categorias.')
				  });
				
			};
		}
	])
});

function validate(category){
	return category.name && category.subCategoryName && category.type;
}