define(['./module', '../services/account-resources'], function (app) {

	app.controller('AccountController', ['$rootScope', '$scope', '$modal', '$location', 'AccountResource', 'MessageHandler',
	                                 	function($rootScope, $scope, $modal, $location, Account, MessageHandler) {
//		$scope.account = {};
//		$scope.accountAggregation = [];
//		$scope.typeControl = [];
		
		// Recupera o resumo das contas do usuário.
		Account.summary(function(data){
			$scope.summary = data;
		});
		
		// Aciona o detalhamento da conta, recuperando todos os lançamentos realizados ali.
		$scope.detail = function (account){
			$location.path('/account/'+ account.id +'/entries');
		};
				
		// Insere uma nova conta no sistema a partir dos dados informados na Modal.
		$scope.save = function() {
			
			// Abre a modal.
			var modalInstance = openModal($scope, $modal, ModalInstanceCtrl)
			modalInstance.result.then(function (account) {
				
				// Executa a gravação da conta.
				account.balance = 0;
				Account.new(account).$promise.then(function(accData){
					Account.summary(function(sumData){
						$scope.summary = sumData;
					});
				});
			});
//			$scope.account = {};
		}
		
        // Abre a modal.
        function openModal($scope, $modal, ModalInstanceCtrl){
        	
    		var modalInstance = $modal.open({
    			templateUrl: 'modules/account/views/modal-new-account.html',
    			controller: ModalInstanceCtrl,
    			size: 'md',
    			resolve: {
    				account: function () {
    					return $scope.account;
    				}
    			}
    		});
    		
    		return modalInstance;
        }
        
     	/***********************************************************************
		 * Controlador para tratamento da modal de edição/inserção.
		 **********************************************************************/
     	var ModalInstanceCtrl = function ($scope, $modalInstance, $timeout, account) {

     		$scope.account = account;
     		
     		$scope.ok = function ( form ) {
     			if (form.$valid){
     				$modalInstance.close($scope.account);
     			} else {
     				dirtyFormFields(form);
     			}
     		};

     		$scope.cancel = function () {
     			$modalInstance.dismiss('cancel');
     		};
     	}
     	
        function dirtyFormFields(form){
    		for (var validation in form.$error){
    			for (var field in form.$error[validation]){
    				if (form.$error[validation][field].$pristine){
    					form.$error[validation][field].$pristine = false;
    				}
    			}
    		}
        }
	}]);
});

///**
// * Atualiza direto na referência, o saldo total das contas de acordo com os
// * valores dos lançamentos de cada uma delas.
// * @param accounts Contas que terão suas referências atualizadas com o saldo
// * @returns null
// */
//function updateBalance(accounts){
//	var totalBalance = 0;
//	
//	// Atualiza o saldo após o lançamento em questão.
//	for(var a=0;a<accounts.length;a++){
//		var balance = 0;
//		for (var e=0;e<accounts[a].entries.length;e++){
//			balance += accounts[a].entries[e].amount;
//		}
//		accounts[a].balance = accounts[a].startBalance + balance;
//	}
//}