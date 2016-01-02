define(['./module', '../services/account-resources'], function (app) {

	app.controller('AccountController', ['$rootScope', '$scope', '$location', 'AccountResource',
        function($rootScope, $scope, $location, Account) {
            $rootScope.appContext.contextPage = 'Contas';

            $scope.appContext.contextMenu.actions = [
                {icon: 'playlist_add', tooltip: 'Nova Conta', onClick: 'newAccount()'}
            ];

            //TODO: Recuperar contas do usuário.
            $scope.accountSummary = {
                balance: 77543.89,
                types:[
                    {
                        type: 'CA', // Checking Account
                        balance: 15435.87,
                        accounts:[
                            {
                                id: 1,
                                name: 'CC: Itaú Personalitè',
                                balance: 3456.8
                            },
                            {
                                id: 2,
                                name: 'CC: HSBC Premier',
                                balance: 56.0
                            }
                        ]
                    },
                    {
                        type: 'SA', // Saving Account
                        balance: 61986.02,
                        accounts:[
                            {
                                id: 3,
                                name: 'CC: Itaú Personalitè',
                                balance: 61986.02
                            }
                        ]
                    },
                    {
                        type: 'IA', // Investiment Account
                        balance: 61986.02,
                        accounts:[
                            {
                                id: 3,
                                name: 'CC: Itaú Personalitè',
                                balance: 61986.02
                            }
                        ]
                    },
                    {
                        type: 'CA', // Credit Card Account
                        balance: -12986.02,
                        accounts:[
                            {
                                id: 4,
                                name: 'Itaú Personalitè - Visa Carol',
                                balance: -10000.02
                            },
                            {
                                id: 5,
                                name: 'Itaú Personalitè - Visa Erik',
                                balance: -2986.02
                            }
                        ]
                    }
                ]
            }


	    }
	]);
});