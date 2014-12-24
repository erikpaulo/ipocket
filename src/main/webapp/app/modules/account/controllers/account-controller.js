define(['./module', './account-resources'], function (app) {

	app.controller('AccountController', ['$scope', '$http', '$log', '$modal', 'AccountResource', 'MessageHandler', 
	                                 	function($scope, $http, $log, $modal, Account, MessageHandler) {
		
		$scope.appContext.changeCurrentContext($scope.modules[0].id);
		$scope.account = {};
		$scope.accountAggregation = [];
		$scope.typeControl = [];
		
		// Lista todas as contas já cadastradas para o uário.
		Account.listAll(function(accounts){
		    // A partir das contas recuperadas, agrupa todas elas por tipo de conta.
			$scope.accountAggregation = aggregate($scope.accountAggregation, accounts, $scope.typeControl);
		}, function(err){
		    alert('request failed');
		});
		
        /**
		 * MODAL: Permite a inserção de uma nova conta.
		 */
        $scope.insert = function() {
        	MessageHandler.clear();
        	
        	// Abre a modal.
    		var modalInstance = openModal($scope, $modal, ModalInstanceCtrl)
    		modalInstance.result.then(function (account) {
    			console.log('Gravando conta '+ account.name);
    			
    			// Executa a gravação da conta.
    			Account.new(account).$promise.then(function(){
    				$scope.account = {};
    				$scope.accountAggregation = aggregate($scope.accountAggregation, [account], $scope.typeControl);
    			});
    			
    			
    		}, function () {
    		});
        }
        
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

/**
 * Dada uma lista de contas do usuário, agrega todas elas por tipo de conta,
 * armazenando a soma total do saldo de cada uma.
 * @param aggregation
 * @param accounts
 */
function aggregate(accountAggregation, accounts, typeControl){
	var TYPES = [];
	TYPES["CH"] = "Corrente";
	TYPES["CR"] = "Crédito";
	TYPES["SA"] = "Poupança";
	TYPES["IN"] = "Investimento";
    
    // Itera pelas contas agregando.
    for ( var index=0;index < accounts.length;index++ ) {
    	if ( typeControl[accounts[index].type] == undefined ){
    		typeControl[accounts[index].type] = accountAggregation.length;
    		accountAggregation.push({name: TYPES[accounts[index].type], total: 0, accounts: []});
    	}
    	accountAggregation[typeControl[accounts[index].type]].total += accounts[index].balance;
    	accountAggregation[typeControl[accounts[index].type]].accounts.push(accounts[index]);
    }
    
    return accountAggregation;
}