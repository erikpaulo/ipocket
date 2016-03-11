define([ './module' ], function(module) {
	module.service('CategoryService', ['$scope', '$filter',
	    function($scope, $filter) {
		    return {
		        searchInFullName = function(query){
		            $filter('filter')(array, query, comparator)
		        }
		    }
		}
	])
});