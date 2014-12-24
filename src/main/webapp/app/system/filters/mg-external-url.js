define(['./module'], function(module)
{

	/**
	 * Verifica padrão de formação de uma URL externa. Caso não tenha, o filtro adiciona
	 * o 'http://' na url e retorna a string com esse novo formato.
	 */
	module.filter('ExternalURL', function() {
		return function(url) {
			if (typeof url == 'undefined') {
				return '';
			}
			if (url == null) {
				return '';
			}
			if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
				return url;
			}
			return 'http://' + url;
		};
	});

});