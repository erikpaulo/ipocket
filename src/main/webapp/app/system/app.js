define(['angular',
        'layout-core',
        'system/routes',
        'system/components/dependency-resolver',
        'system/components/error-handler',
        'system/components/menu-handler',
        'system/components/auth-handler',
        'system/directives/index',
        'system/filters/index'], 
function(angular, layout, config, dependencyResolverFor, errorHandler, menuHandler, authHandler)
{
    
	// TODO [marcus] app.directives foi iniciada no arquivo 'system/directives/index'. Alterar esse index para retornar o módulo e pegar o nome aqui para evitar hardcoded
	
    var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.grid', 'angularFileUpload', 'angular-loading-bar', 'angularSpinner', 'ngLoadingSpinner', 'highcharts-ng', 'ui.calendar', 'ngResource', 'ngDragDrop', 'ui.select2', 'ui.bootstrap', 'ngCookies', 'tmh.dynamicLocale', 'pascalprecht.translate',  errorHandler.name, menuHandler.name, authHandler.name, 'app.directives', 'app.filters' ]);

    app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$translateProvider',  'tmhDynamicLocaleProvider', 'usSpinnerConfigProvider',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $translateProvider, tmhDynamicLocaleProvider, usSpinnerConfigProvider)
        {
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;
	        app.routeProvider = $routeProvider;
	        app.modules    = [];

	        // Spinner Global Config
	        usSpinnerConfigProvider.setDefaults({
	        	  lines: 7, // The number of lines to draw
	        	  length: 11, // The length of each line
	        	  width: 2, // The line thickness
	        	  radius: 6, // The radius of the inner circle
	        	  corners: 1, // Corner roundness (0..1)
	        	  rotate: 90, // The rotation offset
	        	  direction: 1, // 1: clockwise, -1: counterclockwise
	        	  color: '#000', // #rgb or #rrggbb or array of colors
	        	  speed: 1.7, // Rounds per second
	        	  trail: 23, // Afterglow percentage
	        	  shadow: false, // Whether to render a shadow
	        	  hwaccel: false, // Whether to use hardware acceleration
	        	  className: 'spinner', // The CSS class to assign to the spinner
	        	  zIndex: 2e9, // The z-index (defaults to 2000000000)
	        	  top: '50%', // Top position relative to parent
	        	  left: '50%' // Left position relative to parent
	        	});
	        
            //$locationProvider.html5Mode(true);
            // ==== PUBLIC MODULE ====
	        $routeProvider.when('/', {templateUrl: 'system/views/home.html', resolve:dependencyResolverFor(['system/controllers/home-controller']) });
	        $routeProvider.when('/about', {templateUrl: 'system/views/about.html', resolve:dependencyResolverFor(['system/controllers/about-controller']) });
	        
	        $routeProvider.when('/login', {templateUrl : 'system/views/login.html'});
	        $routeProvider.when('/register', {templateUrl : 'system/views/register.html'});
	        
	        $routeProvider.when('/404', {templateUrl : 'system/views/error/404.html'});
	        $routeProvider.when('/403', {templateUrl : 'system/views/error/403.html'});
	        $routeProvider.when('/500', {templateUrl : 'system/views/error/500.html'});
	        
	        // EXTENSION-POINT: DEMAIS ROTAS PODEM SER ADICIONAS A PARTIS DO $scope.modules
	        
            // Initialize angular-translate
            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });
	        
	        // Redireciona para página default.
	        $routeProvider.otherwise({redirectTo: '/'});
	        
            $translateProvider.preferredLanguage('br');
            $translateProvider.useCookieStorage();
        }
    ]);
    
    app.run(function ($rootScope, $http, AppContext) {
    	
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
        
        // Captura eventos do loading-bar e sensibiliza variável para tratamento nas páginas
        $rootScope.$on('cfpLoadingBar:started', function(event, toState, toParams, fromState, fromParams) {
        	$rootScope.ajaxCompleted = false;
	    });
        
        $rootScope.$on('cfpLoadingBar:completed', function(event, toState, toParams, fromState, fromParams) {
        	$rootScope.ajaxCompleted = true;
	    });
    
//        $rootScope.format = function (value, type){
//        	var formats = [];
//        	formats['currency'] = new StringMask('R$ #.##0,00', {reverse: true}); 
//        	
//			var formatter = formats[type];
//			return formatter.apply(value.toString());
//        }
    });

   return app;
});