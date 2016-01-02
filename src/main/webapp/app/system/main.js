require.config({
    baseUrl: '/ipocket',
    waitSeconds: 30,
    paths: {
    	'jquery': 'resources/lib/jquery/jquery.min',
		'jquery-validation': 'resources/legacy/jquery-validation/dist/jquery.validate.min',
		'jquery-validation-add-methods': 'resources/legacy/jquery-validation/dist/additional-methods.min',

        // REQUIREJS PLUING MODULES
		'domReady': 'resources/lib/requirejs-domready/domReady',
		async: 'resources/lib/requirejs-plugins/src/async',

    	// ANGULAR CORE E MODULES
		'angular': 'resources/lib/angular/angular',
		'angular-resource': 'resources/lib/angular-resource/angular-resource.min',
		'angular-animate':'resources/lib/angular-animate/angular-animate.min',
		'angular-route': 'resources/lib/angular-route/angular-route',
		'angular-cookies': 'resources/lib/angular-cookies/angular-cookies.min',
		'angular-i18n-ptbr': 'resources/js/angular-locale_pt-br',

		// ANGULAR PLUGINS MODULES
		'angular-messages': 'resources/lib/angular-messages/angular-messages.min',

        // ANGULAR MATERIAL
        'material-design': 'resources/lib/material-design-lite/material.min',
        'angular-aria': 'resources/lib/angular-aria/angular-aria.min',
        "svg-morpheus": "resources/lib/svg-morpheus/compile/minified/svg-morpheus",
        'angular-material-icons': 'resources/lib/angular-material-icons/angular-material-icons.min',
        'angular-material': 'resources/lib/angular-material/angular-material.min',

        // CHARTS
        'highcharts': 'resources/lib/highcharts/highcharts',
        'highcharts-more': 'http://code.highcharts.com/highcharts-more',
        'highcharts-solidgauge': 'http://code.highcharts.com/modules/solid-gauge.src',
        'highcharts-ng': 'resources/lib/highcharts-ng/dist/highcharts-ng.min',

        // APP CORE MODULES
		'layout-core': 'system/layout-core',
		'layout-form': 'system/layout-form',
		'app': 'system/app'
    },
	shim: {
        'angular': {
            exports: 'angular'
        },

        'jquery-validation-add-methods': ['jquery', 'jquery-validation'],

        'angular-cookies': { deps: ['angular', 'angular-route', 'angular-resource']},
		'angular-route': ['angular'],
		'angular-resource': ['angular'],
		'angular-animate': ['angular'],

        'angular-i18n-ptbr': ['angular'],
		'angular-messages': ['angular'],

        'angular-aria': ['angular'],
        'angular-material-icons': ['angular'],
		'angular-material': ['angular', 'angular-aria', 'angular-animate'],

        'highcharts-more': ['jquery', 'highcharts'],
        'highcharts-solidgauge': ['highcharts', 'highcharts-more'],
		'highcharts-ng': ['jquery','angular', 'highcharts'],

        'layout-core': {
			deps: ['jquery',
                'angular-animate'
			]
		},
		
		'layout-form': [
		    'layout-core'
		],
		
		'app': {
			deps: [
			    'layout-core',

			    'angular',
			    'angular-route',
                'angular-cookies',
                'angular-i18n-ptbr',

                'angular-messages',

                'material-design',
                'angular-material-icons',
                'svg-morpheus',
                'angular-material',

                'highcharts-ng',
                'highcharts-solidgauge',
                'highcharts-more'
		    ]
		},
	}
});

define(['layout-core', 'app'], function(app) {
    // angular.bootstrap(document, ['app']);
    /*
     * place operations that need to initialize prior to app start here
     * using the `run` function on the top-level module
     */
    require( ['material-design']);

    require(['domReady!'], function (document) {
        angular.bootstrap(document, ['app']);

            require( ['https://apis.google.com/js/platform.js'], function(){

                window.gapi.signin2.render('google-signin', {
                    'scope': 'https://www.googleapis.com/auth/plus.login',
                    'width': 2000,
                    'height': 36,
                    'longtitle': true,
                    'theme': 'dark',
                    'onsuccess': function(googleUser){
                        angular.element(document.getElementById('AuthController')).scope()
                        .googleAuthenticate({token: googleUser.getAuthResponse().id_token});

                        var auth2 = window.gapi.auth2.getAuthInstance();
                        auth2.signOut();
                    },
                    'onfailure': function(fail){
                        console.log('fail');
                    }
                });
            });

    });

});