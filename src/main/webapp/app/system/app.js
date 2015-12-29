define(['angular',
        'layout-core',
        'system/routes',
        'system/components/dependency-resolver',
        'system/components/error-handler',
//        'system/components/menu-handler',
        'system/components/auth-handler',
        'system/components/index-handler',
        'system/directives/index',
        'system/filters/index'],
function(angular, layout, config, dependencyResolverFor, errorHandler, authHandler, indexHandler)
{
    
	// TODO [marcus] app.directives foi iniciada no arquivo 'system/directives/index'. Alterar esse index para retornar o módulo e pegar o nome aqui para evitar hardcoded
	
    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ngResource',
        'ngCookies',

        'ngMessages',

        'ngMaterial', 'ngAria', 'ngMdIcons',
        errorHandler.name,
//        menuHandler.name,
        authHandler.name,
        indexHandler.name,
        'app.directives',
        'app.filters'
    ]);

    app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
        {
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;
	        app.routeProvider = $routeProvider;
	        app.modules    = [];

            //$locationProvider.html5Mode(true);
            // ==== PUBLIC MODULE ====
	        $routeProvider.when('/', {templateUrl: 'system/views/dashboard.html', resolve:dependencyResolverFor(['modules/dashboard/controllers/dashboard-controller']) });
//	        $routeProvider.when('/about', {templateUrl: 'system/views/about.html', resolve:dependencyResolverFor(['system/controllers/about-controller']) });
	        
	        $routeProvider.when('/login', {templateUrl : 'system/views/login.html'});
//	        $routeProvider.when('/register', {templateUrl : 'system/views/register.html'});
	        
	        $routeProvider.when('/404', {templateUrl : 'system/views/error/404.html'});
	        $routeProvider.when('/403', {templateUrl : 'system/views/error/403.html'});
	        $routeProvider.when('/500', {templateUrl : 'system/views/error/500.html'});
	        
	        // EXTENSION-POINT: DEMAIS ROTAS PODEM SER ADICIONAS A PARTIS DO $scope.modules

	        // Redireciona para página default.
	        $routeProvider.otherwise({redirectTo: '/'});

        }
    ]);
    
    app.run(function ($rootScope, $http) {
    	
    	app.modules = $rootScope.modules;
    	app.context = $rootScope.appContext;
        
        $rootScope.loadRoutes = function(modules) {
        	// rotas padrão da system
    		if(config.routes !== undefined) {
  			  angular.forEach(config.routes, function(route, path){
  				  app.routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
  			  });
    		}	        
        	
        	// rotas de cada módulo
        	angular.forEach(modules, function(module){
        		  if (module.originalPath != undefined) {
        			  app.routeProvider.when(module.originalPath, {templateUrl:module.templateUrl, resolve:dependencyResolverFor(module.dependencies)});
        		  }
	              angular.forEach(module.items, function(item){
	            	app.routeProvider.when(item.originalPath, {templateUrl:item.templateUrl, resolve:dependencyResolverFor(item.dependencies)});
	              });
        	});
        }
        
        // carrega as rotas
        $rootScope.loadRoutes($rootScope.modules);
        
/*        // Captura eventos do loading-bar e sensibiliza variável para tratamento nas páginas
        $rootScope.$on('cfpLoadingBar:started', function(event, toState, toParams, fromState, fromParams) {
        	$rootScope.ajaxCompleted = false;
	    });
        
        $rootScope.$on('cfpLoadingBar:completed', function(event, toState, toParams, fromState, fromParams) {
        	$rootScope.ajaxCompleted = true;
	    });
*/
    
    });

   return app;
});