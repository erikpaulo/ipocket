define(['./module'], function(module){
	module.filter('currencybr', function() {
		return function(value) {
			if (angular.isNumber(value)){
				var isNegative = value < 0;
				var strValue = (value*100).toFixed(0);
				var formatter = new StringMask('#.##0,00', {reverse: true}); 
				return 'R$ ' + (isNegative ? "-" : "") + formatter.apply(strValue);
			} else {
				return value;
			}
		};
	});

});