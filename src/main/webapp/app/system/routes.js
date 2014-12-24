define([], function()
{
    return {
        defaultRoutePath: '/',
        routes: {
            // ==== ACCOUNT MODULE ====
            '/account': {
                templateUrl: 'system/views/account-overview.html',
                dependencies: [
                    'system/controllers/account-controller'
                ]
            },
            '/account/:status': {
                templateUrl: 'system/views/account-overview.html',
                dependencies: [
                    'system/controllers/account-controller'
                ]
            },             
            '/tasks': {
                templateUrl: 'system/views/account-tasks.html',
                dependencies: []
            },         
            
            // ==== ADMIN MODULE ====
            '/admin': {
                templateUrl: 'system/views/user-list.html',
                dependencies: [
                    'system/controllers/manage-user-controller'
                ]
            },
            '/logs': {
                templateUrl: 'system/views/logs.html',
                dependencies: [
                    'system/controllers/logs-controller'
                ]
            },
            '/metrics': {
                templateUrl: 'system/views/metrics.html',
                dependencies: [
                    'system/controllers/metrics-controller'
                ]
            },            
            '/docs-api': {
                templateUrl: 'system/views/docs.html',
                dependencies: [ ]
            }
            
        }
    };
});