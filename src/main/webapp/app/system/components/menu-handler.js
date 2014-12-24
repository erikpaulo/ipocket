/* Menu Module */
define(['angular-resource', 'jquery'], function (resource, $) {

    var MenuModule = angular.module('MenuModule', ['ngResource', 'tmh.dynamicLocale', 'pascalprecht.translate']);
    
	/*
	 * AppContext que pode ser injetado nos controlladores para recuperar informações sobre:
	 * currentUser: 
	 * registerModules: 
	 * ??
	 */
    MenuModule.factory('AppContext', 
	function() { 
		
		var context = {};
		
		context.modules = {dashboard:false, rebanho:false};
		
		var itemAnterior = '';
		
		context.changeCurrentContext = function(pr) {
			context.modules[itemAnterior] = false;
			context.modules[pr] = true; 
	        itemAnterior = pr;
	    };
	    
	    return context;
	});
    
	/**
	 * Configura as variaveis e comportamento default do módulo. 
	 * 
	 */
	MenuModule.run(function ($rootScope, AppContext) {
		$rootScope.modules = [];
		
        $.ajax({dataType: "json", url: 'modules/routes.json', async: false}).done( function(json) {
      		$rootScope.modules = json;
      	});
		
	    // adiciona o contexto o $scope
	    $rootScope.appContext = AppContext;
	});

	/**
	 * Resource para com.softb.system.security.webAccountRestService
	 */
	MenuModule.factory('User', 
	function($resource) {
	    return $resource('public/user/current');
	});
    
    MenuModule.controller('IndexController', [ '$scope', '$rootScope', 'User', '$translate', 
     function($scope, $rootScope, User, $translate) {
    		
    	console.log('==>AdminMenuController');

    	$scope.adminMenu = {};
    	$scope.adminMenu.items = [];
                                           		
    	$scope.currentUser = User.get( function(user) {
    		$rootScope.authToken = user.token
    		
			console.log('==>AdminMenuCtrl: get Current User, user is '+user.displayName);
			if (user.authenticated) {
				console.log('  user authenticated, is '+(user.admin? '' : 'NOT ')+ 'admin');
				$scope.adminMenu.iconClass = 'icon-user';
				$scope.adminMenu.title = ' ' + user.displayName;
				var index = 0;

				//Account menu
				$scope.adminMenu.items[index++] = {menu : true, url : '#/account/', title : ' Profile', iconClass : "fa fa-wrench"};
				$scope.adminMenu.items[index++] = {menu : true, url : '#/tasks', title : ' Tarefas', iconClass : "fa fa-tasks"};
							
				if (user.admin) {
					$scope.adminMenu.items[index++] = {menu : false, dividerClass : 'divider'};
					$scope.adminMenu.items[index++] = {menu : true, url : '#/admin/', title : ' Admin', iconClass : "fa fa-cogs"};
					$scope.adminMenu.items[index++] = {menu : true, url : '#/logs/', title : ' Logs', iconClass : "fa fa-archive"};
					$scope.adminMenu.items[index++] = {menu : true, url : '#/metrics/', title : ' Metrics', iconClass : "fa fa-clock-o"};
					$scope.adminMenu.items[index++] = {menu : true, url : '#/docs-api/', title : ' API', iconClass : "fa fa-book"};
					$scope.adminMenu.items[index++] = {menu : false, dividerClass : 'divider'};
				}
				
			} else {
				console.log('  user is not authenticated, add social signin menu.');
				
			}
		});
    	
        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);
        };
		
		$scope.handleMenuClick = function($event, id) {
			$scope.clickMenu($event, $('#menu-'+id));
		};
		
		$scope.handleSubMenuClick = function($event, id) {
			$scope.clickMenu($event, $('#submenu-'+id));
		};

		$scope.clickMenu = function (event, e) {
			var grupoMenu = e;
			var isSubMenu = false;
			
		    if (grupoMenu.hasClass('item-menu') == true) {
		    	grupoMenu = grupoMenu.parent().parent().parent().children();
		    	isSubMenu = true;
		    }
		    
		    // caso não tenha submenu, pode retornar
		    if (grupoMenu.next().children().length == 0) {
		        return;
		    }

		    var parent = grupoMenu.parent().parent();

	        parent.children('li.open').children('a').children('.arrow').removeClass('open');
	        parent.children('li.open').children('.sub-menu').slideUp(200);
	        parent.children('li.open').removeClass('open');

	        var sub = jQuery(grupoMenu).next();
	        if (sub.is(":visible")) {
	            jQuery('.arrow', jQuery(grupoMenu)).removeClass("open");
	            jQuery(grupoMenu).parent().removeClass("open");
	            sub.slideUp(200, function () {
	                $scope.handleSidenarAndContentHeight();
	            });
	        } else {
	            jQuery('.arrow', jQuery(grupoMenu)).addClass("open");
	            jQuery(grupoMenu).parent().addClass("open");
	            sub.slideDown(200, function () {
	                $scope.handleSidenarAndContentHeight();
	            });
	        }

	        if (isSubMenu) {
	        	return;
	        } else {
	        	event.preventDefault();
	        }
	    };

		$scope.handleSidenarAndContentHeight = function () {
	        var content = $('.page-content');
	        var sidebar = $('.page-sidebar');

	        if (!content.attr("data-height")) {
	            content.attr("data-height", content.height());
	        }

	        if (sidebar.height() > content.height()) {
	            content.css("min-height", sidebar.height() + 120);
	        } else {
	            content.css("min-height", content.attr("data-height"));
	        }
	    };
	    
	} ]);
    
	// TODO [marcus]: Esse filtro é utilizado para esconder o menu de modulos se o usuário não estiver authenticated. Solução precisa
	// ser incrementada quando tiver controle de acesso no nível de módulo
	MenuModule.filter('hasPermission', function(){

		return function(arr, currentUser){

			var result = [];
			
			if(!currentUser){
				return result;
			}

			if (!currentUser.authenticated) {
				return result;
			}
			
			return arr;
		};
	});
	
    return MenuModule;
});