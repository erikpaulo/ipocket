define([ './module', '../services/category-group-resources', '../services/category-kind-resources', '../services/category-service', '../services/category-resources' ], function(module) {

	module.filter('mapType', function() {
		var typeHash = {
                'F' : 'Despesa Fixa', 
             	'V' : 'Despesa Variável',
             	'I' : 'Despesa Irregular',
             	'E' : 'Entrada',
  	            'RF': 'Renda Fixa',
  	            'RV': 'Renda Variável',
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
	
	module.controller('CategoryController', ['$rootScope', '$scope', '$modal', '$http', 'CategoryKindResource', 'CategoryGroupResource', 'CategoryResource',
	    function($rootScope, $scope, $modal, $http, CategoryKind, CategoryGroup, Category) {
			var draginCategory;
//			var catChanged = false;
//			
//			$scope.catChanged = false;
		
			// Recupera os grupos com suas categorias.
			CategoryKind.listAll(function(data){
				$scope.categoryKinds = data;
			});
			
			$scope.createGroup = function(kind){
				var group = new CategoryGroup({kind: kind});
				
				// Salva
				save(null, group).then(function (data1) {
					var group = data1;
					group.$new(function (data2){
						for (var i in $scope.categoryKinds){
							if ($scope.categoryKinds[i].kind == kind){
								$scope.categoryKinds[i].groups.unshift(data2);
								break;
							}
						}
					});
				});
			}
			
			// Adiciona uma categoria no grupo.
			$scope.createCategory = function(group){
				
				// Se existe uma categoria selecionada. remove a seleção.
				if ($scope.selectedCategory) {
					$scope.selectedCategory.selected = false;
					$scope.selectedCategory = null;
				}
				
				// Abre a modal para entrada dos valores.
				save(new Category(), group).then(function (data1) {
					delete data1.$status;
					delete data1.selected;
					
					var category = data1;
					category.group = {id: group.id, name: group.name, categories: null, userId: group.userId};
					
					// Grava no sistema
					category.$new(function(data2){
						group.categories.push(data2);
						$scope.selectedCategory = data2;
						$scope.selectedCategory.selected = true;
					});
				});

			}
			
			function save(category, group){
				var modalInstance = openModal($scope, $modal, ModalInstanceCtrl, category, group)
				return modalInstance.result;
			}
			
			$scope.edit = function(group){
				// Verifica se alguma categoria está selecionada.
				if ($scope.selectedCategory){
					save($scope.selectedCategory, group).then(function (data1) {
						delete data1.$status;
						delete data1.selected;
						var newGroup = {};
						angular.extend(newGroup, group);
						newGroup.categories = null;
						data1.group = newGroup;
						
						new Category(data1).$save(function(data2){
							data2.selected = true;
							for (var i in group.categories){
								if (group.categories[i].id == data2.id){
									group.categories[i] = data2;
								}
							}
							$scope.selectedCategory = data2;
						});
					});
				} else {
					save(null, group).then(function (data1) {
						new CategoryGroup(group).$save(function (data2){
						});
					});
				}
			}
			
			$scope.remove = function(group, categoryKinds){

				// Verifica se alguma categoria está selecionada.
				if ($scope.selectedCategory){
					new Category({id: $scope.selectedCategory.id}).$delete(function(data){
						// Remove a categoria da listagem.
						for (var i in group.categories){
							if (group.categories[i].id == data.id){
								group.categories.splice(i,1);
							}
						}
						$scope.selectedCategory = null;
					});
				} else {
					new CategoryGroup({id: group.id}).$delete(function (){
						for (var i in categoryKinds.groups){
							if (categoryKinds.groups[i].id == group.id){
								categoryKinds.groups.splice(i,1);
							}
						}
					});
				}
			}
			
			// Altera uma categoria de grupo.
			$scope.changeToGroup = function (a, b, group){
				// atualiza a movimentação da categoria.
				$scope.saveCategory(draginCategory, group);
			}
			
			// Acionando quando o dragndrop se inicia
			$scope.startDrag = function (event, ui, category, group) {
				draginCategory = category;
			}
			
			// Seleciona uma categoria para se aplicar alguma operação
			$scope.selectCategory = function(category){
				if (!$scope.selectedCategory){
					$scope.selectedCategory = category
					$scope.selectedCategory.selected = true;
				} else {
					if ($scope.selectedCategory.id == category.id){
						$scope.selectedCategory.selected = false;
						$scope.selectedCategory = null;
					} else {
						$scope.selectedCategory.selected = false;
						$scope.selectedCategory = category
						$scope.selectedCategory.selected = true;
					}
				}
			}
			
			/*****************
			 * Modal
			 ****************/
	        function openModal($scope, $modal, ModalInstanceCtrl, category, group){
	        	
	    		var modalInstance = $modal.open({
	    			templateUrl: 'modules/configuration/views/modal-save-category.html',
	    			controller: ModalInstanceCtrl,
	    			size: 'md',
	    			resolve: {
	    				category: function (){
	    					return category;
	    				},
	    				group: function (){
	    					return group;
	    				}
	    			}
	    		});
	    		return modalInstance;
	        }
	        
	     	var ModalInstanceCtrl = function ($scope,  $modalInstance, category, group) {
	     		$scope.category = category;
	     		$scope.group = group;
	     		
				$scope.expenseTypes = [
       	            {id: 'F', name: 'Despesa Fixa'}, 
       	            {id: 'V', name: 'Despesa Variável'},
       	            {id: 'I', name: 'Despesa Irregular'}
       			];
				
				$scope.investTypes = [
	  	            {id: 'RF', name: 'Renda Fixa'}, 
	  	            {id: 'RV', name: 'Renda Variável'}
	  			];
	     		
	     		$scope.ok = function ( form ) {
	     			if (form.$valid){
	     				if (category){
	     					$modalInstance.close($scope.category);
	     				} else {
	     					$modalInstance.close($scope.group);
	     				}
	     			} else {
	     				dirtyFormFields(form);
	     			}
	     		};
	     		
	     		$scope.cancel = function () {
	     			$modalInstance.dismiss('cancel');
	     		};
	     	}

		}
	])
});