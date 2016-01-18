define(['./module'], function (app) {

	app.service('Utils', function() {
	    return{
	        currencyToNumber: function(currency){
	            if (!angular.isString(currency)) return currency;
	            var isNegative = currency.search('-') >= 0;

	            var number = currency.replace(/[^0-9\,]+/g,"");
	            number = number.replace(/[^0-9\.]+/g,".");

	            return Number(number * (isNegative ? -1 : 1));
	        }
	    }
	});
});