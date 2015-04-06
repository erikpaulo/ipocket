define([ './module', '../services/category-group-resources', '../services/category-service', '../services/category-resources' ], function(module) {

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
	
	module.controller('CategoryController', ['$rootScope', '$scope', '$http', 'CategoryGroupResource', 'CategoryResource',
	    function($rootScope, $scope, $http, CategoryGroup, Category) {
			var draginCategory;
			var catChanged = false;
			
			$scope.catChanged = false;
		
			$scope.types = [
	            {id: 'F', name: 'Despesa Fixa'}, 
	            {id: 'V', name: 'Despesa Variável'},
	            {id: 'I', name: 'Despesa Irregular'},
	            {id: 'E', name: 'Entrada'},
	            {id: 'T', name: 'Transferência'}
			];
			
			
			// Recupera os grupos com suas categorias.
			CategoryGroup.listAll(function(data){
				$scope.groups = data;
			});
			
			$scope.newGroup = function(){
				var group = new CategoryGroup();
				group.$status = 'pending';
				
				$scope.groups.unshift(group);
			}
			
			$scope.saveGroup = function(group){
				delete group.$status;
				group.$save(function(data){
					
				})
			}
			
			$scope.delGroup = function(group){
				new CategoryGroup({groupId: group.id}).$delete(function (){
					for (var i in $scope.groups){
						if ($scope.groups[i].id == group.id){
							$scope.groups.splice(i,1);
						}
					}
				});
			}
			
			// Adiciona um objeto vazio no grupo informado no parâmetro.
			$scope.addCategoryIn = function(group){
				if (!group.categories){
					group.categories = [];
				}
				group.categories.push(new Category({type: 'N'}));
			}
			
			$scope.saveCategory = function(cat, group){
				var category = new Category(cat);
				
				// Define o grupo
				var newGroup = {id:group.id};
				category.group = newGroup;
				
				delete category.$status;
				
				category.$save(function(data){
					category = data;
					
					for (var i in group.categories){
						if (group.categories[i].name == data.name && group.categories[i].type == data.type){
							group.categories[i] = data;
						}
					}
				});
			}
			
			// Remove uma categoria do sismeta.
			$scope.removeCategory = function(category, group){
				new Category({categoryId: category.id}).$delete(function(data){
					// Remove a categoria da listagem.
					for (var i in group.categories){
						if (group.categories[i].id == category.id){
							group.categories.splice(i,1);
						}
					}
				})
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
		
		}
	])
});