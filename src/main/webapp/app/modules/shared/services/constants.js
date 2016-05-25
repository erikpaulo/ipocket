define(['./module'], function (app) {

	app.service('Constants', function() {
	    return{
	        ACCOUNT: {
	            TYPE: {
	                CHECKING_ACCOUNT: {
	                    id: 'CKA',
	                    name: 'Conta Corrente'
	                },
	                SAVING_ACCOUNT: {
	                    id: 'SVA',
	                    name: 'Conta Poupança'
	                },
	                INVESTMENT: {
	                    id: 'INV',
	                    name: 'Conta Investmento'
	                },
	                CREDIT_ACCOUNT: {
	                    id: 'CCA',
	                    name: 'Cartão de Crédito'
	                }
	            }
	        },
	        INVESTMENT: {
	            TYPE: {
	                FUNDO_CURTO_PRAZO: {
	                    id: 'FCP',
	                    name: 'Fundo de Curto Prazo'
	                },
                    FUNDO_REFERENCIADO: {
                        id: 'FRD',
                        name: 'Fundo Referenciado'
                    },
                    FUNDO_RENDA_FIXA: {
                        id: 'FRF',
                        name: 'Fundo de Renda Fixa'
                    },
                    FUNDO_ACOES: {
                        id: 'FAC',
                        name: 'Fundo de Ações'
                    },
                    FUNDO_CAMBIAL: {
                        id: 'FCB',
                        name: 'Fundo Cambial'
                    },
                    FUNDO_DIVIDA_EXTERNA: {
                        id: 'FDE',
                        name: 'Fundo Dívida Externa'
                    },
                    FUNDO_MULTIMERCADO: {
                        id: 'FMM',
                        name: 'Fundo Multimercado'
                    }
	            }
	        },
	        MONTHS: [
	            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
	        ]
	    }
	});
});