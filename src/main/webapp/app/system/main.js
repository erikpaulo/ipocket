require.config({
    baseUrl: '/ipocket',
    waitSeconds: 30,
    paths: {
    	// === ANGULAR CORE E MODULES
		'angular': 'resources/lib/angular/angular',
		'angular-resource': 'resources/lib/angular-resource/angular-resource.min',
		'angular-route': 'resources/lib/angular-route/angular-route',
		'angular-dragdrop': 'resources/lib/angular-dragdrop/src/angular-dragdrop.min',
		'angular-ui-select2': 'resources/lib/angular-ui-select2/src/select2',
		'angular-file-upload': 'resources/lib/angular-file-upload/angular-file-upload.min',
		'ui-bootstrap-tpls': 'resources/lib/angular-bootstrap/ui-bootstrap-tpls.min',
		'domReady': 'resources/lib/requirejs-domready/domReady',
		'angular-cookies': 'resources/lib/angular-cookies/angular-cookies.min', 
		
		'angular-translate': 'resources/lib/angular-translate/angular-translate',
		'angular-translate-storage-cookie': 'resources/lib/angular-translate-storage-cookie/angular-translate-storage-cookie',
		'angular-translate-loader-static-files': 'resources/lib/angular-translate-loader-static-files/angular-translate-loader-static-files',
		'angular-dynamic-locale': 'resources/lib/angular-dynamic-locale/src/tmhDinamicLocale',
		
		'jquery': 'resources/lib/jquery/jquery.min',
		'jquery-ui': 'resources/legacy/jquery-ui/jquery-ui-1.10.1.custom.min',
		'bootstrap': 'resources/lib/bootstrap/dist/js/bootstrap.min',
		'breakpoints': 'resources/legacy/breakpoints',
		'jquery-unveil': 'resources/legacy/jquery-unveil/jquery.unveil.min',
		
		'pane': 'resources/legacy/pace/pace.min',
		
		'jquery-slimscroll': 'resources/legacy/jquery-slimscroll/jquery.slimscroll.min',
		'jquery-slider': 'resources/legacy/jquery-slider/jquery.sidr.min',
		'jquery-block-ui': 'resources/legacy/jquery-block-ui/jqueryblockui',
		// TODO [marcus] versao que mostra a combo com o icone correto.
		'select2': 'resources/legacy/bootstrap-select2/select2',
		
		'jquery-validation': 'resources/legacy/jquery-validation/dist/jquery.validate.min',
		'jquery-validation-add-methods': 'resources/legacy/jquery-validation/dist/additional-methods.min',
		
		// == FULL CALENDAR
		'fullcalendar': 'resources/legacy/fullcalendar/fullcalendar.min',
		'qtip': 'resources/legacy/qtip/jquery.qtip.min',
		
		// == ANGULAR CHARTS
		'angular-chart': 'resources/lib/angular-chart.js/dist/angular-chart',
		'chart': 'resources/lib/Chart.js/Chart.min',
		
		//	==== DATATABLES
		'datatables': 'resources/lib/datatables/media/js/jquery.dataTables',
		// TODO [marcus]; versao 1.1.0 tem bug quando utilizado com requirejs. Foi versionado uma versao correta em /legacy
		'datatables-colreorder': 'resources/legacy/datatables-colreorder/dataTables.colReorder',
		'datatables-colvis': 'resources/lib/datatables-colvis/js/dataTables.colVis',
		'datatables-fixedcolumns': 'resources/lib/datatables-fixedcolumns/js/dataTables.fixedColumns',
		// TODO [erik]: código foi alterado a partir da versão 2.2.0 p/ resolver problema do export para tabela invisivel
		'datatables-tabletools': 'resources/legacy/datatables-tabletools/dataTables.tableTools',
		'datatables-responsive': 'resources/legacy/datatables-responsive/js/datatables.responsive', 
		'datatables-lodash': 'resources/legacy/datatables-responsive/js/lodash.min',
		'angular-ui-grid': 'resources/lib/angular-ui-grid/ui-grid',

		// === NG CURRENCY
		'ng-currency': 'resources/lib/ng-currency/dist/ng-currency.min',
		
//		'xeditable': 'resources/lib/angular-xeditable/dist/js/xeditable',
		
		'layout-core': 'system/layout-core',
		'layout-form': 'system/layout-form',
		'app': 'system/app'
    },
	shim: {
        'angular': {
            exports: 'angular'
        },
		'angular-route': ['angular'],
 		'angular-resource': ['angular'],
 		'angular-dragdrop': ['angular'],
 		'angular-ui-select2': ['angular', 'select2'],
 		'angular-file-upload': ['angular'],
 		'ui-bootstrap-tpls': ['angular'],	
 		'angular-cookies': { deps: ['angular', 'angular-route', 'angular-resource']},
 		'angular-chart': ['angular', 'chart'],
 		
		'angular-translate': ['angular'],
		'angular-translate-storage-cookie': ['angular-translate'],
		'angular-translate-loader-static-files' : ['angular-translate'],
		'angular-dynamic-locale': ['angular', 'angular-cookies', 'angular-translate', 'angular-translate-storage-cookie', 'angular-translate-loader-static-files'],

 		'datatables-fixedcolumns': {deps: ['jquery', 'datatables']},
 		'angular-ui-grid': ['angular'],
//		'bootstrap-datepicker-pt-BR': ['jquery', 'bootstrap-datepicker'],
//		'bootstrap-datepicker': ['jquery'], 
		'bootstrap': ['jquery'],
		'breakpoints': ['jquery'],
		'jquery-unveil': ['jquery'],
		'core': ['jquery'],
		'jquery-ui': ['jquery'],
		'pane': ['jquery'],
		'jquery-slimscroll': ['jquery'],
		'jquery-slider': ['jquery'],
		'jquery-block-ui': ['jquery'],
		'select2' : ['jquery'],
		'jquery-validation': ['jquery'],
		'jquery-validation-add-methods': ['jquery-validation'],
//		'xeditable': ['angular'],
 		
        'layout-core': {
			deps: ['jquery-ui', 'bootstrap', 'breakpoints', 'jquery-unveil', 'pane', 'jquery-slimscroll', 'jquery-block-ui', 'jquery-slider'/*, 'bootstrap-datepicker-pt-BR'*/, 'angular-ui-grid', 'angular-file-upload', 'angular-chart']
		},
		
		'layout-form': ['layout-core', 
		                'select2',  
		                'datatables', 
		                'datatables-colreorder', 
		                'datatables-colvis', 
		                'datatables-fixedcolumns', 
		                'datatables-tabletools',
		                'ng-currency',
		                'datatables-responsive', 
		                'datatables-lodash'],
		
		'app': {
			deps: ['layout-core', 'angular', 'angular-route', 'angular-dragdrop', 'angular-ui-select2', 'ui-bootstrap-tpls', 'angular-cookies', 'angular-dynamic-locale', 'angular-file-upload']
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