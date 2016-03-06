define([ './module',
         '../services/category-group-resources',
         '../services/category-resources',
         '../services/subcategory-resources',
         '../../shared/services/app-filters'], function(module) {

	module.controller('CategorizationController', ['$scope', '$filter', '$timeout', '$mdDialog', 'CategoryGroupResource', 'CategoryResource', 'SubCategoryResource',
	    function($scope, $filter, $timeout, $mdDialog, CategoryGroup, Category, SubCategory) {
            $scope.appContext.contextPage = 'Categorização';
            $scope.appContext.contextMenu.setActions([]);

            $scope.expensiveTypes = [
                {id: 'FC', name: 'FC'},
                {id: 'VC', name: 'VC'},
                {id: 'IC', name: 'IC'}
            ];

            CategoryGroup.listAll(function (groups){
                $scope.groups = groups;
            });

            $scope.openMenu = function($mdOpenMenu, ev) {
                originatorEv = ev;
                $mdOpenMenu(ev);
            };

            $scope.addCategory = function(group){
                openDialog('C', group);
            }
            $scope.editCategory = function($event, group, category){
                if (!category.edit){ // open for edition
                    category.edit = true;
                    $timeout(function() {
                        angular.element('#inputc_'+category.id).focus()
                    }, 0);
                } else { // send the change to server
                    var categoryResource = new Category(category);
                    delete categoryResource.open;
                    delete categoryResource.edit;
                    categoryResource.$save(function(categ){
                        addWarning($scope, 'Categoria alterada com sucesso!');
                        delete category.edit;
                    }, function(err){
                        addError($scope, 'Não foi possível alterar a Categoria.', err)
                        $timeout(function() {
                            angular.element('#inputc_'+category.id).focus()
                        }, 0);
                    });
                }
            }

            $scope.addSubCategory = function(group){
                openDialog('S', group);
            }
            $scope.editSubCategory = function($event, category, subcategory){
                if (!subcategory.edit){ // open for edition
                    subcategory.edit = true;
                    $timeout(function() {
                        angular.element('#inputsc_'+subcategory.id).focus()
                    }, 0);
                } else { // send the change to server
                    saveSubCategory(category, subcategory)
                }
            }
            $scope.changeStatus = function(category, subcategory){
                 saveSubCategory(category, subcategory);
            }
            function saveSubCategory(category, subcategory){
                var subcategoryResource = new SubCategory(subcategory);
                subcategoryResource.categoryId = category.id;
                delete subcategoryResource.edit;

                subcategoryResource.$save(function(subcateg){
                    addWarning($scope, 'Subcategoria alterada com sucesso!');
                    delete subcategory.edit;
                }, function(err){
                    addError($scope, 'Não foi possível alterar a Subcategoria.', err)
                    $timeout(function() {
                        angular.element('#inputsc_'+subcategory.id).focus();
                    }, 0);
                });
            }


            function openDialog(func, group){
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: ( func == 'C' ? 'modules/categorization/views/new-category-template.html' : 'modules/categorization/views/new-subcategory-template.html'),
                    parent: angular.element(document.body),
                    locals: {
                        func: func,
                        group: group,
                        categories: group.categories
                    },
                    clickOutsideToClose:true
                }).then(function(data){

                    // Tests if its a Category or a SubCategory being included.
                    if (func == 'C'){
                        new Category(data).$new(function(category){
                            for (var i in $scope.groups){
                                if ($scope.groups[i].id == group.id){
                                    $scope.groups[i].categories.push(category);
                                    $scope.groups[i].categories = $filter('orderBy')($scope.groups[i].categories, 'name');
                                }
                            }
                            addWarning($scope, 'Categoria' +' ('+ data.name +') incluída com sucesso!');
                        }, function(err){
                            addError($scope, 'Não foi possível incluir Categoria!', err);
                        });
                    } else {
                        new SubCategory(data).$new(function(subcategory){
                            for (var i in $scope.groups){
                                if ($scope.groups[i].id == group.id){
                                    for (var j in $scope.groups[i].categories){
                                        if ($scope.groups[i].categories[j].id == data.categoryId){
                                            $scope.groups[i].categories[j].subcategories.push(subcategory);
                                            $scope.groups[i].categories[j].subcategories = $filter('orderBy')($scope.groups[i].categories[j].subcategories, 'name');
                                        }
                                    }
                                }
                            }
                            addWarning($scope, 'Subcategoria' +' ('+ data.name +') incluída com sucesso!');
                        }, function(err){
                            addError($scope, 'Não foi possível incluir SubCategoria!', err);
                        });
                    }
                });
            }
	    }
	])


    function DialogController($scope, $mdDialog, func, group, categories) {
        $scope.group = group;
        $scope.categories = categories;
        $scope.node = (func == 'C'? {type: group.id} : {});

        $scope.expensiveTypes = [
            {id: 'FC', name: 'Despesa Mensal Fixa'},
            {id: 'VC', name: 'Despesa Mensal Variável'},
            {id: 'IC', name: 'Despesa Irregular'}
        ];

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