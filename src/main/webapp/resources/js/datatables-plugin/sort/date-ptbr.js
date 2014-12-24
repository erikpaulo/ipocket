$.extend( $.fn.dataTableExt.oSort, {
	'date-ptbr-pre': function (date){
		if (date == '') return 0;
		 var ptbrDate = date.split("/");
		 return new Date(ptbrDate[2], ptbrDate[1] + 1, ptbrDate[0]).getTime();
	},
	'date-ptbr-asc': function (a, b){
		 return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	},
	'date-ptbr-desc': function (a, b){
		return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	}
});