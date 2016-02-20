define([ './module',
         '../services/category-group-resources'], function(module) {

	module.controller('CategorizationController', ['$scope', '$filter', '$timeout', '$mdDialog', 'CategoryGroupResource',
	    function($scope, $filter, $timeout, $mdDialog, CategoryGroup) {
            $scope.appContext.contextPage = 'Categorização';
            $scope.appContext.contextMenu.setActions([]);

            $scope.expensiveTypes = [
                {id: 'F', name: 'Despesa Fixa'},
                {id: 'V', name: 'Despesa Variável'},
                {id: 'I', name: 'Despesa Irregular'}
            ];

            CategoryGroup.listAll(function (groups){
                $scope.groups = groups;
            });

            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            $scope.collapse = function(category){
                category.open = false;
            }

            $scope.expand = function(category){
                category.open = true;
            }

            $scope.addCategory = function(group){
                openDialog($scope, $filter, $mdDialog, 'C', group);
            }
            $scope.editCategory = function($event, group, category){
                if (!category.edit){ // open for edition
                    category.edit = true;
                    $timeout(function() {
                        angular.element('#inputc_'+category.id).focus()
                    }, 0);
                } else { // send the change to server
                    //TODO: send the change
                    delete category.edit;
                }
            }

            $scope.addSubCategory = function(group){
                openDialog($scope, $filter, $mdDialog, 'S', group);
            }
            $scope.editSubCategory = function($event, subcategory){
                if (!subcategory.edit){ // open for edition
                    subcategory.edit = true;
                    $timeout(function() {
                        angular.element('#inputsc_'+subcategory.id).focus()
                    }, 0);
                } else { // send the change to server
                    //TODO: send the change
                    delete subcategory.edit;
                }
            }
	    }
	])

 function openDialog($scope, $filter, $mdDialog, func, group){
       $mdDialog.show({
           controller: DialogController,
           templateUrl: ( func == 'C' ? 'modules/configuration/views/new-category-template.html' : 'modules/configuration/views/new-subcategory-template.html'),
           parent: angular.element(document.body),
           locals: {
                func: func,
                group: group,
                categories: group.categories
           },
           clickOutsideToClose:true
       }).then(function(data){

            //TODO: Altera categoria no server
            for (var i in $scope.groups){
                if ($scope.groups[i].id == group.id){

                    if (func == 'C'){ // is it including a category?
                        $scope.groups[i].categories.push(data);
                        $scope.groups[i].categories = $filter('orderBy')($scope.groups[i].categories, 'name');
                    } else {
                        for (var j in $scope.groups[i].categories){
                            if ($scope.groups[i].categories[j].id == data.category.id){
                                $scope.groups[i].categories[j].subcategories.push(data);
                                $scope.groups[i].categories[j].subcategories = $filter('orderBy')($scope.groups[i].categories[j].subcategories, 'name');
                            }
                        }
                    }
                }
            }

            $scope.appContext.toast.addWarning((func == 'C' ? 'Categoria':'Subcategoria') +' ('+ data.name +') incluída com sucesso!');
       });
    }

    function DialogController($scope, $mdDialog, func, group, categories) {
//        $scope.func = func;
        $scope.group = group;
        $scope.categories = categories;

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.submit = function() {
            $mdDialog.hide($scope.node);
        };
    }
});