define(['./module', './account-resources'], function (app) {

	app.controller('AccountController', ['$rootScope', '$scope', '$modal', '$location', 'AccountResource', 'MessageHandler',
	                                 	function($rootScope, $scope, $modal, $location, Account, MessageHandler) {
		
		$scope.appContext.changeCurrentContext($scope.modules[0].id);
		
		$scope.account = {};
		$scope.accountAggregation = [];
		$scope.typeControl = [];
		$scope.fullLoaded = false;
		
		// Lista todas as contas já cadastradas para o uário.
		Account.listAll(function(accounts){
			// A partir das contas recuperadas, agrupa todas elas por tipo de conta.
			$scope.accountAggregation = aggregate($scope.accountAggregation, accounts, $scope.typeControl);
			$scope.fullLoaded = true;
		}, function(err){
			alert('Não foi possível recuperar as contas do usuário. err: '+ err);
		});
		
		// Calcula a soma total de dinheiro do usuário, considerando todas as contas.
		$scope.getTotal = function(){
			var total = 0;
			for (var i in $scope.accountAggregation){
				total += $scope.accountAggregation[i].total;
			}
			return total;
		}
		
		// Aciona o detalhamento da conta, recuperando todos os lançamentos realizados ali.
		$scope.detail = function (account){
			$location.path('/account/'+ account.id +'/entries');
		};
				
		// Insere uma nova conta no sistema a partir dos dados informados na Modal.
		$scope.save = function() {
			
			// Abre a modal.
			var modalInstance = openModal($scope, $modal, ModalInstanceCtrl)
			modalInstance.result.then(function (account) {
				console.log('Gravando conta '+ account.name);
				
				// Executa a gravação da conta.
				account.balance = 0;
				Account.new(account).$promise.then(function(data){
					$scope.accountAggregation = aggregate($scope.accountAggregation, [data], $scope.typeControl);
				}, function(err){
					console.log('Erro na gravação da conta. err: '+ err);
				});
			});
			$scope.account = {};
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

/**
 * Atualiza direto na referência, o saldo total das contas de acordo com os
 * valores dos lançamentos de cada uma delas.
 * @param accounts Contas que terão suas referências atualizadas com o saldo
 * @returns null
 */
function updateBalance(accounts){
	var totalBalance = 0;
	
	// Atualiza o saldo após o lançamento em questão.
	for(var a=0;a<accounts.length;a++){
		var balance = 0;
		for (var e=0;e<accounts[a].entries.length;e++){
			balance += accounts[a].entries[e].amount;
		}
		accounts[a].balance = accounts[a].startBalance + balance;
	}
}