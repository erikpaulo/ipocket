define([ './module', './category-resources' ], function(module) {

	module.controller('CategoryController', ['$scope','$http','$filter', '$log', 'CategoryResource',
	    function($scope, $http, $filter, $log, Category) {
			
			// Recupera as categorias já cadastradas no banco para o usuário.
			$scope.categories = [];
			Category.listAll().$promise.then(function(categories){
				$scope.categories = categories;
			},function(reason){
				$log.error('Não foi possível recuperar as categorias do usuário. Erro: '+ reason);
			});

			$scope.fixedCosts = [ 
			   {value : 'S', text : 'Sim'}, 
			   {value : 'N', text : 'Não'} 
			];

			$scope.kinds = [ 
			   {value : 'C', text : 'Crédito'}, 
			   {value : 'D', text : 'Débito'} 
			];

			$scope.showKind = function(category) {
				var selected = [];
				if (category.kind) {
					selected = $filter('filter')($scope.kinds, {
						value : category.kind
					});
				}
				return selected.length ? selected[0].text : '-';
			};

				$scope.showFixedCost = function(category) {
					var selected = [];
					if (category.fixedCost != undefined && category.fixedCost != null) {
						selected = $filter('filter')($scope.fixedCosts, {
							value : category.fixedCost
						});
					}
					return selected.length ? selected[0].text : '-';
				};

				$scope.saveCategory = function(data, index) {
					angular.extend(data, {});
					
					// Valida se os campos obrigatórios foram preenchidos.
					if (!validate(data)){
						return "Atributos obrigatórios não foram definidos.";
					} else {
						Category.new(data).$promise.then(function(returned){
							$scope.categories[index] = returned.created;
						},function(reason){$log.error('Não foi possível criar categoria. Motivo: '+ reason)});
					}
				};

				// Remove Categoria
				$scope.removeCategory = function(index) {
					Category.delete({categoryId: $scope.categories[index].id}).$promise.then(function(){
						$scope.categories.splice(index, 1);
					},function(){})
				};

				// Adiciona nova linha
				$scope.addCategory = function() {
					$scope.inserted = {
						name : '',
						subCategoryName : '',
						fixedCost : null,
						kind : null
					};
					$scope.categories.push($scope.inserted);
				};
				
				// Cancela uma operação.
				$scope.cancel = function(index){
					if ( !$scope.categories[index].id ) {
						$scope.categories.splice(index, 1);
					}
				}
			}]);
});

function validate(category){
	return category.name && category.subCategoryName && category.fixedCost && category.kind;
}
