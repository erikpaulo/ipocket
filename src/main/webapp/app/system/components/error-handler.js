define([], function () {


    var ErrorModule = angular.module('ErrorModule', []);

    /**
     * Provider que pode ser injetado nos controllera. Armazena informações de mensagens, como erro, alerta ou aviso.
     * É utilizado pela diretiva mg-message-box para exibir as mensagens aos usuários
     */
	ErrorModule.provider('MessageHandler', function() {

		var errorList = [];

		this.getErrorList = function() {
			return errorList;
		};

		this.$get = function() {
			var errors = errorList;
			return {
				addError : function(item) {
					item.error = true;
					item.style = "alert-error";
					errors.push(item);
				},
				
				addWarn : function(item) {
					item.warn = true;
					errors.push(item);
				},

				addMessage : function(item) {
					item.sucess = true;
					item.style = "alert-success";
					errors.push(item);
				},
				
				removeError : function(index) {
					errors.splice(index, 1);
				},
				
				clear : function(item) {
					if (errors.length > 0) {
	 					errors.splice(0, errors.length);
					}
				},			

				getErrors : function() {
					return errors;
				}
			};
		};
	});
	
	ErrorModule.factory('errorInterceptor', ['$q', '$rootScope', '$location', 'MessageHandler', 
             function ($q, $rootScope, $location, MessageHandler) {
                 return {
                     request: function (config) {
                         return config || $q.when(config);
                     },
                     requestError: function(request){
                         return $q.reject(request);
                     },
                     response: function (response) {
     					// if there is a successful response on POST, UPDATE or DELETE we must addMessage
     					if ( (response.headers()['content-type'] == 'application/json;charset=UTF-8') && (response.config.method.toUpperCase() != 'GET') ) {
     						// clear error handler
     						MessageHandler.addMessage({message: 'Operação realizada com sucesso.'});
     					}

     					return successResponse;
                     },
                     responseError: function (response) {
     					if ( errorResponse.headers()['content-type'] == 'application/json;charset=UTF-8' ) {
    						switch (errorResponse.status) {
    							case 400: // if the status is 400 we return the error
    								if (errorResponse.data.type == "FormValidationError") {
    									// if we have found validation error messages we will loop through and display them
    									if (errorResponse.data.fieldErrors.length > 0) {
    										for (var i = 0; i < errorResponse.data.fieldErrors.length; i++) {
    											MessageHandler.addError(errorResponse.data.fieldErrors[i]);
    										}
    									}
    								} else {
    									MessageHandler.addError(errorResponse.data);
    								}
    								break;
    							case 401:
    								console.log('Wrong email address or password!' + errorResponse.config.url);
    								MessageHandler.addError(errorResponse.data);
    								break;
    							case 403:
    								console.log('You have insufficient privileges to do what you want to do!' + errorResponse.config.url);
    								MessageHandler.addError(errorResponse.data);
    								break;
    							case 500: 
    								console.log('Internal server error: ' + errorResponse.config.url)
    								MessageHandler.addError(errorResponse.data);
    								break;
    							default: 
    								console.log('Business error: ' +errorResponse.config.url);
    								MessageHandler.addError(errorResponse.data);
    						}
    						return $q.reject(errorResponse);
    					} else {
    						switch (errorResponse.status) {
    							case 404: 
    								$location.path ('/404');
    								break;
    							case 403: 	
    								console.log("Acesso negado na url: " + errorResponse.config.url)
    								$location.path ('/403');
    								break;
    							default:
    								$location.path ('/500');
    								
    						}
    						return $q.reject(errorResponse);
    					}
    					return errorResponse;	                                        	 
                     }
                 };
         }]);	

	
	return ErrorModule;
});