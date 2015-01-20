define(['./module'], function (module) {
	
	module.service('DataHoldService', function () {
		var data = [];
        return {
            get:function (parmName) {
            	return data[parmName];
            },
            add:function (parName, parValue) {
            	data[parName] = parValue;
            }
        };
    })
});