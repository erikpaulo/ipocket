define(['./module'], 
function (module) {
	
	module.factory('BudgetResource', function($resource) {
//	    return $resource(
//	        'api/budget/:id',
//	        {id: '@id'},
//	        {
//	            listAll:	{ method:'GET',  params: {}, isArray: true },
//	            save:		{ method:'POST', params: {}, isArray: false},
//	            get:		{ method:'GET',  params: {}, isArray: false}
//	        }
//	    );

        return {
            listAll: function (callBack){

                callBack([
                    {
                        id: 2,
                        year: 2016,
                        status: 'active',
                    },
                    {
                        id: 1,
                        year: 2015,
                        status: 'inactive'
                    }
                ]);
            },

            getDashboard: function(callBack){
                callBack({
                    track:{
                        entry: {
                            id: 2,
                            year: 2016,
                            status: 'active',
                        },
                        totalPlanned: 2467.98,
                        perMonthPlanned: [411.33,411.33,411.33,411.33,411.33,411.33,411.33,411.33,411.33,411.33,411.33,411.33],
                        totalExecuted: 1348.65,
                        perMonthExecuted: [224.775,224.775,224.775,224.775,224.775,224.775],
                        deviation: 54.64,
                        isPositive: true,
                        track: [{
                            entry:{
                                id: 1,
                                name: 'Entradas'
                            },
                            totalPlanned: 18375.68,
                            perMonthPlanned: [3062.61,3062.61,3062.61,3062.61,3062.61,3062.61,3062.61,3062.61,3062.61,3062.61,3062.61,3062.61],
                            totalExecuted: 19697.3,
                            perMonthExecuted: [3282.88,3082.88,3382.88,3482.88,3382.88,3182.88],
                            deviation: 107.19,
                            isPositive: true,
                            track: [
                                {
                                    entry: {
                                        id: 3,
                                        name: 'Salário Erik'
                                    },
                                    totalPlanned: 18375.68,
                                    perMonthPlanned: [1431.31,1431.31,1431.31,1431.31,1431.31,1431.31,1431.31,1431.31,1431.31,1431.31,1431.31,1431.31],
                                    totalExecuted: 19697.3,
                                    perMonthExecuted:[1541.44,1541.44,1541.44,1541.44,1541.44,1541.44],
                                    deviation: 107.19,
                                    isPositive: true,
                                    track: [
                                        {

                                        }
                                    ]
                                },
                                {
                                    entry: {
                                        id: 3,
                                        name: 'Salário Carol'
                                    },
                                    totalPlanned: 9787.84,
                                    perMonthPlanned: [1631.31,1631.31,1631.31,1631.31,1631.31,1631.31,1631.31,1631.31,1631.31,1631.31,1631.31,1631.31],
                                    totalExecuted: 10448.65,
                                    perMonthExecuted: [1741.44,1741.44,1741.44,1741.44,1741.44,1741.44],
                                    deviation: 107.19,
                                    isPositive: true,
                                    track: [
                                        {

                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            entry: {
                                id: 4,
                                name: 'Despesas'
                            },
                            totalPlanned: 15907.70,
                            perMonthPlanned: [2651.28,2651.28,2651.28,2651.28,2651.28,2651.28,2651.28,2651.28,2651.28,2651.28,2651.28,2651.28],
                            totalExecuted: -18348.65,
                            perMonthExecuted: [3258.11,2858.11,3058.11,4058.11,3058.11,2058.11],
                            deviation: 115.34,
                            isPositive: false,
                            track: [
                                {
                                    entry: {
                                        id: 1,
                                        name: 'Household'
                                    },
                                    totalPlanned: 9840,
                                    perMonthPlanned: [1650,1650,1650,1650,1650,1650,1650,1650,1650,1650,1650,1650],
                                    totalExecuted: 11524,
                                    perMonthExecuted:[1650,1650,2056,2056,2056,2056],
                                    deviation: 117,
                                    isPositive: false,
                                    track: [
                                        {
                                            entry:{
                                                id: 1,
                                                name: 'Household: Diarista'
                                            },
                                            totalPlanned: 2400,
                                            perMonthPlanned: [400,400,-00,400,400,400,400,400,400,400,400,400],
                                            totalExecuted: 2400,
                                            perMonthExecuted:[400,400,400,400,400,400],
                                            deviation: 100,
                                            isPositive: false,

                                        },
                                        {
                                            entry:{
                                                id: 2,
                                                name: 'Household: Condomínio'
                                            },
                                            totalPlanned: 7440,
                                            perMonthPlanned: [1250,1250,1250,1250,1250,1250,1250,1250,1250,1250,1250,1250],
                                            totalExecuted: 9124,
                                            perMonthExecuted:[1250,1250,1656,1656,1656,1656],
                                            deviation: 122,
                                            isPositive: false,

                                        }
                                    ]
                                },
                                {
                                    entry: {
                                        id: 1,
                                        name: 'Transporte'
                                    },
                                    totalPlanned: 9900,
                                    perMonthPlanned: [1650,1650,1650,1650,1650,1650,1650,1650,1650,1650,1650,1650],
                                    totalExecuted: 10124,
                                    perMonthExecuted:[1650,1650,2056,2056,2056,2056],
                                    deviation: 102,
                                    isPositive: false,
                                    track: [
                                        {
                                            entry:{
                                                id: 5,
                                                name: 'Transporte: Gasolina'
                                            },
                                            totalPlanned: 0,
                                            perMonthPlanned: [0,0,0,0,0,0,0,0,0,0,0,0],
                                            totalExecuted: 10,
                                            perMonthExecuted:[10,0,0,0,0,0],
                                            deviation: 100,
                                            isPositive: false,
                                        },
                                        {
                                            entry:{
                                                id: 6,
                                                name: 'Transporte: IPVA'
                                            },
                                            totalPlanned: 700,
                                            perMonthPlanned: [700,0,0,0,0,0,0,0,0,0,0,0],
                                            totalExecuted: 750,
                                            perMonthExecuted:[250,250,250,0,0,0],
                                            deviation: 107,
                                            isPositive: false,
                                        },
                                        {
                                            entry:{
                                                id: 7,
                                                name: 'Transporte: Seguro'
                                            },
                                            totalPlanned: 7440,
                                            perMonthPlanned: [0,0,0,0,0,0,0,0,0,300,300,300],
                                            totalExecuted: 0,
                                            perMonthExecuted:[0,0,0,0,0,0],
                                            deviation: 0,
                                            isPositive: false,

                                        }
                                    ]
                                }
                            ]
                        }]
                    },
                    mainDeviations: [
                        {
                            category: {
                                name: 'Household'
                            },
                             totalPlanned: 9840,
                             totalExecuted: 11524,
                             deviation: 117
                        },
                        {
                            category:{
                                name: 'Transporte'
                            },
                            totalPlanned: 9900,
                            totalExecuted: 10124,
                            deviation: 102
                        },
                        {
                            category:{
                                name: 'Entretenimento'
                            },
                            totalPlanned: 8000,
                            totalExecuted: 16000,
                            deviation: 150
                        }
                    ]
                });
            }
        }
	});

});	