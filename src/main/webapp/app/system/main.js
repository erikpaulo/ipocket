require.config({
    baseUrl: '/ipocket',
    waitSeconds: 30,
    paths: {
    	'jquery': 'resources/lib/jquery/jquery.min',
    	'jquery-ui': 'resources/legacy/jquery-ui/jquery-ui-1.10.1.custom.min',
    	'bootstrap': 'resources/lib/bootstrap/dist/js/bootstrap.min',
    	'breakpoints': 'resources/legacy/breakpoints',
    	'jquery-unveil': 'resources/legacy/jquery-unveil/jquery.unveil.min',
    	
    	'select2': 'resources/legacy/bootstrap-select2/select2',
    	
    	// === ANGULAR CORE E MODULES
		'angular': 'resources/lib/angular/angular',
		'angular-resource': 'resources/lib/angular-resource/angular-resource.min',
		'angular-route': 'resources/lib/angular-route/angular-route',
		'angular-dragdrop': 'resources/lib/angular-dragdrop/src/angular-dragdrop.min',
		'angular-file-upload': 'resources/lib/angular-file-upload/angular-file-upload.min',
		'ui-bootstrap-tpls': 'resources/lib/angular-bootstrap/ui-bootstrap-tpls.min',
		'domReady': 'resources/lib/requirejs-domready/domReady',
		'angular-cookies': 'resources/lib/angular-cookies/angular-cookies.min', 
		
		'angular-translate': 'resources/lib/angular-translate/angular-translate',
		'angular-translate-storage-cookie': 'resources/lib/angular-translate-storage-cookie/angular-translate-storage-cookie',
		'angular-translate-loader-static-files': 'resources/lib/angular-translate-loader-static-files/angular-translate-loader-static-files',
		'angular-dynamic-locale': 'resources/lib/angular-dynamic-locale/src/tmhDinamicLocale',
		'angular-locale-br': 'https://cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.15/angular-locale_pt-br',
		
		'string-masks': 'resources/lib/string-mask/src/string-mask',
//		'angular-input-masks-dep': 'resources/lib/angular-input-masks/angular-input-masks-dependencies',
//		'angular-input-masks-salonne': 'resources/lib/angular-input-masks/angular-input-masks-standalone',
//		'angular-input-masks': 'resources/lib/angular-input-masks/angular-input-masks',
//		'br-validations': 'resources/lib/br-validations/releases/br-validations.min',
		
		'angular-loading-bar': 'resources/lib/angular-loading-bar/build/loading-bar',
		'spin': 'resources/lib/spin.js/spin',
		'angular-spinner':'resources/lib/angular-spinner/angular-spinner.min',
		'angular-loading-spinner':'resources/lib/angular-loading-spinner/angular-loading-spinner',
		
		'angular-animate':'resources/lib/angular-animate/angular-animate.min',
		
		'jquery-slimscroll': 'resources/legacy/jquery-slimscroll/jquery.slimscroll.min',
		'jquery-slider': 'resources/legacy/jquery-slider/jquery.sidr.min',
		'jquery-block-ui': 'resources/legacy/jquery-block-ui/jqueryblockui',
		// TODO [marcus] versao que mostra a combo com o icone correto.
		
		'jquery-validation': 'resources/legacy/jquery-validation/dist/jquery.validate.min',
		'jquery-validation-add-methods': 'resources/legacy/jquery-validation/dist/additional-methods.min',
		
		// == ANGULAR UI-CALENDAR
		'moment': 'resources/legacy/fullcalendar/lib/moment.min',
		'fullcalendar': 'resources/legacy/fullcalendar/fullcalendar.min',
		'qtip': 'resources/legacy/qtip/jquery.qtip.min',
		'angular-ui-calendar': 'resources/lib/angular-ui-calendar/src/calendar',
		
		// == ANGULAR CHARTS
		'highcharts-drilldown': 'resources/js/highcharts/drilldown',
		'highcharts-ng': 'resources/lib/highcharts-ng/dist/highcharts-ng.min',
		'highcharts': 'resources/js/highcharts/highcharts',
		
		
		'angular-ui-grid': 'resources/lib/angular-ui-grid/ui-grid',

		// === NG CURRENCY
		'ng-currency': 'resources/lib/ng-currency/dist/ng-currency.min',
		
//		'xeditable': 'resources/lib/angular-xeditable/dist/js/xeditable',
		'angular-ui-select2': 'resources/lib/angular-ui-select2/src/select2',
		
		'layout-core': 'system/layout-core',
		'layout-form': 'system/layout-form',
		'app': 'system/app'
    },
	shim: {
        'angular': {
            exports: 'angular'
        },
        'core': ['jquery'],
        'jquery-ui': ['jquery'],
        'jquery-slimscroll': ['jquery'],
        'jquery-slider': ['jquery'],
        'jquery-block-ui': ['jquery'],
        'jquery-validation': ['jquery'],
        'jquery-validation-add-methods': ['jquery-validation'],
        'bootstrap': ['jquery'],
        'breakpoints': ['jquery'],
        'jquery-unveil': ['jquery'],
        'select2' : ['jquery'],
        'highcharts':['jquery'],
//		'xeditable': ['angular'],
        
        'angular-cookies': { deps: ['angular', 'angular-route', 'angular-resource']},
		'angular-route': ['angular'],
		'angular-resource': ['angular'],
		'angular-dragdrop': ['angular'],
//		'angular-input-masks-salonne': ['angular'],
//		'angular-input-masks': ['angular', 'angular-locale-br', 'angular-input-masks-dep', 'angular-input-masks-salonne'],
 		'angular-file-upload': ['angular'],
 		'ui-bootstrap-tpls': ['angular'],	
 		'highcharts-drilldown': ['highcharts'],
 		'highcharts-ng': ['angular', 'highcharts', 'highcharts-drilldown'],
 		
 		'angular-loading-bar': ['angular'],
 		'angular-loading-spinner': ['angular', 'angular-spinner', 'spin'],
 		'angular-spinner': ['angular', 'spin'],
		'angular-translate': ['angular'],
		'angular-translate-storage-cookie': ['angular-translate'],
		'angular-translate-loader-static-files' : ['angular-translate'],
		'angular-dynamic-locale': ['angular', 'angular-cookies', 'angular-translate', 'angular-translate-storage-cookie', 'angular-translate-loader-static-files'],
		'angular-locale-br': ['angular'],
		
		'angular-animate': ['angular'],
		
		'angular-ui-select2': ['select2', 'angular'],
		
		'fullcalendar': ['jquery', 'moment'],
		'angular-ui-calendar': ['fullcalendar', 'angular'],

 		'angular-ui-grid': ['angular'],
        'layout-core': {
			deps: ['jquery', 'jquery-ui', 'bootstrap', 'breakpoints', 'jquery-unveil'/*, 'pane'*/, 'jquery-slimscroll', 'jquery-block-ui', 'jquery-slider'/*, 'bootstrap-datepicker-pt-BR'*/, 'angular-ui-grid', 'angular-file-upload', 'highcharts-ng', 'angular-loading-bar', 'angular-spinner','angular-loading-spinner', 'angular-animate', 'angular-ui-calendar']
		},
		
		'layout-form': ['layout-core', 
		                'ng-currency'
		                ],
		
		'app': {
			deps: ['layout-core', 'angular', 'angular-route', 'angular-dragdrop', 'select2', 'ui-bootstrap-tpls', 'angular-cookies', 'angular-dynamic-locale', 'angular-file-upload', 'angular-ui-select2']
		},
	}
});

define(['layout-core', 
        'app'], function(app) {
        // angular.bootstrap(document, ['app']);
	    /*
	     * place operations that need to initialize prior to app start here
	     * using the `run` function on the top-level module
	     */

	    require(['domReady!'], function (document) {
    		angular.bootstrap(document, ['app']);
	    });

    }
);