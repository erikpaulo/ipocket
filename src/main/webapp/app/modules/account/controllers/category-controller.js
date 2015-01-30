define([ './module', './category-resources' ], function(module) {

	module.filter('mapType', function() {
		var typeHash = {
                'F' : 'Despesa Fixa', 
             	'V' : 'Despesa Variável',
             	'I' : 'Despesa Irregular',
             	'E' : 'Entrada'
				};
 
				return function(input) {
					if (!input){
						return '';
			} else {
				return typeHash[input];
			}
		};
	});
	
	module.controller('CategoryController', ['$scope', '$log', 'CategoryResource',
	    function($scope, $log, Category) {
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
                     	{id : 'E', value : 'Entrada'}
                     	] 
			      }
             ];
			
			$scope.gridOptions.onRegisterApi = function(gridApi){
				$scope.gridApi = gridApi;
				
				// Editable row
				gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
					$scope.save(rowEntity);
				});
				
				// Row Selection
				gridApi.selection.on.rowSelectionChanged($scope,function(row){
					if (row.isSelected){
						$scope.selectedCategories.push(row);
					} else {
						for (i in $scope.selectedCategories){
							if ($scope.selectedCategories[i].id = row.entity.id){
								$scope.selectedCategories.splice(i, 1);
								break;
							}
						}
					}
				});
			};

			$scope.save = function(data, index) {
				angular.extend(data, {});
				
				// Valida se os campos obrigatórios foram preenchidos.
				if (!validate(data)){
					return "Atributos obrigatórios não foram definidos.";
				} else {
					Category.new(data).$promise.then(function(returned){
						$scope.categories[index] = returned.object;
					},function(reason){
						$log.error('Não foi possível criar categoria. Motivo: '+ reason)
					});
				}
			};
		}
	])
});

function validate(category){
	return category.name && category.subCategoryName && category.type && category.kind;
}

//
//// Remove Categoria
//$scope.removeCategory = function(index) {
//	Category.delete({categoryId: $scope.categories[index].id}).$promise.then(function(){
//		$scope.categories.splice(index, 1);
//	},function(){
//		
//	});
//};

//// Adiciona nova linha
//$scope.addCategory = function() {
//	$scope.inserted = {
//		name : '',
//		subCategoryName : '',
//		type : null,
//		kind : null
//	};
//	$scope.categories.push($scope.inserted);
//};

//// Cancela uma operação.
//$scope.cancel = function(index){
//	if ( !$scope.categories[index].id ) {
//		$scope.categories.splice(index, 1);
//	}
//}