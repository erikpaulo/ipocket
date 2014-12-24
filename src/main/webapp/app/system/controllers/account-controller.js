define(['app', './account-resource'], 
function (module) {

	module.controller('AccountController', [ '$scope', '$routeParams', 'Account', 'MessageHandler',
	function($scope, $routeParams, Account, MessageHandler) {
		console.log('==>HomeController');
		
		var status = $routeParams.status
		
		MessageHandler.clear();
		
		$scope.messageHandler = MessageHandler;
		
		if (status == "NotConnect") {
			MessageHandler.addError({message: 'Não foi possível conectar ao provider.'})
		}
		
	    $scope.myAccount = Account.overview();
	    
	    $scope.enableEdit = function () {
	    	MessageHandler.clear();
	    	
	    	$scope.editAccount = Account.getProfile();
	    }
	    
	    $scope.cancelEdit = function() {
	    	MessageHandler.clear();
	    	
	    	delete $scope.editAccount;
	    }
	    
	    $scope.updateProfile = function() {
	    	MessageHandler.clear();
	    	
	        $scope.editAccount.$updateProfile(function() {
	        	MessageHandler.addMessage({message: 'Configurações atualizadas com sucesso'});
	            delete $scope.editAccount;
	            $scope.myAccount = Account.overview();
	        });
	
	    };	    
	
	    $scope.connectSocial = function(provider) {
	    	MessageHandler.clear();
	    	
	    	// connect com o provider de autenticacao
	        $http.post('connect/' + provider, {}).success(function(data, status) {
	            console.log('   connect/' + provider + " success.");
	        }).error(function(data, status) {
	            console.log('   connect/' + provider + " error!");
	        });
	    };
	
	    $scope.useSocialImage = function(providerName) {
	    	MessageHandler.clear();
	    	
	    	// altera imagem do usuário
	        Account.useSocialImage({provider : providerName}, function(account) {
	            $scope.myAccount = account;
	        });
	    };
	    
	} ]);
});	