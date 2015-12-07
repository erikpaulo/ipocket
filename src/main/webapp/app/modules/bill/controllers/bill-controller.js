define(['./module', '../services/bill-resources', '../services/bill-entry-resources', '../services/bill-service', '../../configuration/services/category-resources', '../../account/services/account-resources'], function (app) {

	app.controller('BillController', ['$scope', '$q', '$compile', '$modal', '$filter', 'BillService', 'BillResource', 'BillEntryResource', 'CategoryResource', 'AccountResource', 'uiCalendarConfig',
        function($scope, $q, $compile, $modal, $filter, BillService, Bill, BillEntry, Category, Account, uiCalendarConfig) {
		$scope.appContext.changeCurrentContext($scope.modules[0].id);
		
		$scope.events = [];
		$scope.bill = null;
		$scope.categories = null;
		$scope.accounts = null;
		
		//*********** DATA ****************//
		// Recupera a lista de categorias disponível no sistema.
		Category.listAll(function(data){
			$scope.categories = data;
		});
		
		// Lista todas as contas já cadastradas para o usuário.
		Account.listAll(function(accounts){
			$scope.accounts = accounts
		});
		
		// Recupera os lançamentos programados.
		Bill.listAll(function(data){
			$scope.bills = data;
			loadEvents($scope.events, data);
		});
		$scope.eventSources = [$scope.events];
		
		// Atualiza os dados de projeção do gráfico.
		updateChart()
		
	  //*************** CALENDAR *****************//
	    $scope.uiConfig = {
	      calendar:{
	        editable: true,
	        timezone: 'local',
	        ignoreTimezone: false,
	        header:{
	          left: 'title',
	          center: '',
	          right: 'today prev,next'
	        },
	        dayClick: function(date, jsEvent, view) {
	        	date.add(3, 'hours'); // workaround para ignorar timezone;
	        	create(date);
		    },
		    eventRender: function(event, element) {    
		    	// Customiza reinderização do evento.
		    	element.find('.fc-title').attr('ng-click', 'edit('+ event._id +')');
		    	element.find('.fc-content').append( "<span class='fc-value'>"+ $filter('currencybr')(event.amount) +"</span>" );
		    	element.find('.fc-content').append( "<span class='fc-tools'>" +
		    	 		"<a href ng-click='register("+ event._id +")'><i class='glyphicon glyphicon-save'></i></a>" +
		    	 		"<a href ng-click='skip("+ event._id +")'><i class='glyphicon glyphicon-new-window'></i></a></span>" );
		    	$compile(element)($scope);
		    },
		    eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) { 
		    	changeDate(event, revertFunc);
		    }
	      }
	    };
	    
		//*********** CHART **************//
		$scope.chartConfig = {
				options: {
			        chart: {
			            type: 'areaspline'
			        },
			        plotOptions: {
			            areaspline: {
			                fillOpacity: 0.5
			            },
			            lineWidth: 1,
			            series: {
			                marker: {
			                    radius: 2
			                },
			                states: {
			                	hover: {
			                		lineWidthPlus: 0
			                	}
			                }
			            }
			        },
			        tooltip: {
			            shared: true,
			            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>R$ {point.y: ,.2f}</b><br/>'
			        }
				},
		        title: {
		            text: ''
		        },
		        subtitle: {
		            text: ''
		        },
		        xAxis: {
		            categories: []
		        },
		        yAxis: {
		            title: {
		                text: ''
		            }
		        },
		        series: [],
                "credits": {"enabled": false},
 	           	"loading": false,
 	           	"size": {
 	        	   "width": "",
 	        	   "height": "250"
 	           	}
		    }
	    
	    /***
	     * Cria um novo pagamento no sistema e o representa no calendário.
	     ***/
	    function create(day){
	    	var bill = new Bill();
	    	bill.date = day._d;
	    	
	    	// Registra o pagamento no sistema.
	    	save(bill).then(function (newBill){
				// Atualiza os pagamentos no calendário.
				updateBillOnCalendar(newBill, event);
				
				// Atualiza gráfico.
				updateChart();
	    	});
	    }
	    
	    /***
	     * Edita um pagamento existente no pagamento no sistema e o representa no calendário.
	     ***/
	    $scope.edit = function (eventId){
	    	// Localiza o pagamento que contém essa entrada.
	    	var event = findEvent($scope.events, eventId);
	    	
	    	// Registra o pagamento no sistema.
	    	save(event.b).then(function(newBill){
				// Atualiza os pagamentos no calendário.
				updateBillOnCalendar(newBill, event);
				
				// Atualiza gráfico.
				updateChart();
	    	});
	    	
	    }
	    
	    /***
	     * Edita um lançamento alterando somente sua data.
	     ***/
	    function changeDate(event, revertFunc){
	    	var billEntry = new BillEntry(event.e);
	    	billEntry.date = event.start._d;
	    	billEntry.$save(function(newBill){
				// Atualiza os pagamentos no calendário.
				updateBillOnCalendar(newBill, event);
				
				// Atualiza gráfico.
				updateChart();
	    	}, function(err){
	    		revertFunc();
	    	});
	    }
	    
	    /***
	     * Remove uma das entradas da conta.
	     ***/
		$scope.skip = function(eventId){
			var event = findEvent($scope.events, eventId);
			
			new BillEntry(event.e).$skip(function(newBill){
				// Atualiza os pagamentos no calendário.
				updateBillOnCalendar(newBill, event);
				
				// Atualiza gráfico.
				updateChart();
			});
		}
		
		/***
	     * Registra em conta corrente.
	     ***/
		$scope.register = function(eventId){
			var event = findEvent($scope.events, eventId);
			
			new BillEntry(event.e).$register(function(newBill){
				// Atualiza os pagamentos no calendário.
				updateBillOnCalendar(newBill, event);
				
				// Atualiza gráfico.
				updateChart();
			});
		}
	    
    	// *************************** FUNÇÕES INTERNAS ***************************
		/*** Cria ou atualiza um pagamento no sistema, acionando modal para entrada de dados ***/
    	function save (bill){
    		var deferred = $q.defer();
    		
    		var modalInstance = openModal($scope, $modal, ModalInstanceCtrl, BillEntry, (bill.id ? "edit" : "new"), bill);
    		modalInstance.result.then(function (newBill) {
    			// Formatação é feita sobre texto.
    			if (newBill.amount){
    				if (!angular.isNumber(newBill.amount))
    				newBill.amount = parseFloat(newBill.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
    			} else {
    				for (var i in newBill.billEntries){
    					if (!angular.isNumber(newBill.billEntries[i].amount))
    						newBill.billEntries[i].amount = parseFloat(newBill.billEntries[i].amount.replace('R$ ', '').replace('.', '').replace(',', '.')); 
    				}
    			}
    			// Salvao o pagamento
    			newBill.$save(function(data){
    				deferred.resolve(data);
    			});
    		});
    		
    		return deferred.promise;
    	}
    	
    	/*** Atualiza um pagamento e suas entradas no calendário ***/
    	function updateBillOnCalendar(bill, event){
			var billToRem = (bill.billEntries ? bill : event.b);
			
    		// Representa o evento no calendário
    		removeBillFromCal(billToRem);
    		
    		// Adiciona o lançamento como eventos no calendário.
    		if(bill.billEntries) addBillToCal(bill);
    	}
    	
    	/*** Adiciona um pagamento e suas entradas no calendário ***/
    	function addBillToCal(bill){
    		angular.forEach(bill.billEntries, function(entry){
    			$scope.events.push(transformToEvent(bill, entry));
    		});
    	}
    	
    	/*** Remove um pagamento e suas entradas no calendário ***/
    	function removeBillFromCal(bill){
    		// Se está editando, remove eventos antigos.
    		for (var i=0;i<$scope.events.length;i++){
    			if ($scope.events[i].b.id == bill.id){
    				$scope.events.splice(i,1);
    				i--;
    			}
    		}
    	}
    	
    	/*** Localiza um evento a partir do id do lançamento ***/
		function findEvent(events, eventId){
			for (var i=0;i<events.length;i++){
				if (eventId == events[i]._id){
					break;
				}
			}
			return events[i];
		}
		
		/*** Cria um evento de calendário a partir de um lançamento programado ***/
		function transformToEvent(bill, entry){
			if (!angular.isDate(entry.date)) entry.date = new Date(entry.date);
			return {title: bill.category.fullName, start: entry.date, end:entry.date, amount: entry.amount, b:bill, e:entry, stick: true};
		}

		/*** Transforma um lançamento em um evento de calendário ***/
		function loadEvents(events, bills){
			angular.forEach(bills, function(bill){
				angular.forEach(bill.billEntries, function(entry){
					events.push(transformToEvent(bill, entry))
				})
			})
		}
	    
		
		/**
		 * Atualiza o gráfico de acordo com as contas programadas que foram atualizadas.
		 */
		function updateChart(){
			var beginDate = new Date();
			var endDate = new Date();
			
//			beginDate.setMonth(beginDate.getMonth());
			beginDate.setDate(1);
			endDate.setMonth(endDate.getMonth()+5);
			endDate.setDate(-0);
			
			new Bill({startDate: beginDate, endDate: endDate, groupBy: "Day"}).$cashFlowProjection(function(cashFlow){
				$scope.chartConfig.xAxis.categories = cashFlow.labels;
				$scope.chartConfig.series = cashFlow.series;
			});
			
		}
		
		
		/*****************
		 * Modal
		 ****************/
        function openModal($scope, $modal, ModalInstanceCtrl, BillEntry, action, b){
        	
    		var modalInstance = $modal.open({
    			templateUrl: (action == 'new' ? 'modules/bill/views/modal-new-bill.html' : 'modules/bill/views/modal-edit-bill.html'),
    			controller: ModalInstanceCtrl,
    			size: 'md',
    			resolve: {
    				BillEntry: function(){
    					return BillEntry;
    				},
    				bill: function () {
    					return b;
    				},
    				categories: function(){
    					return $scope.categories;
    				},
    				accounts: function(){
    					return $scope.accounts;
    				}
    			}
    		});
    		
    		return modalInstance;
        }
        
     	var ModalInstanceCtrl = function ($scope,  $modalInstance, BillEntry, bill, categories, accounts) {
     		$scope.categories = categories;
     		$scope.bill = (bill ? bill : {});
     		$scope.accounts = accounts;
     		$scope.types = [
     		       {id: 'F', value: 'Valor Fixo'}, 
     		       {id: 'A', value: 'Valor Médio'}
     		];
     		
     		$scope.ok = function ( form ) {
     			if (form.$valid){
     				$modalInstance.close($scope.bill);
     			} else {
     				dirtyFormFields(form);
     			}
     		};
     		
     		$scope.cancel = function () {
     			$modalInstance.dismiss('cancel');
     		};
     		
     		$scope.deleteEntry = function (entry) {
    			new BillEntry(entry).$skip();
     		}
     	}
	}]);
});

function dirtyFormFields(form){
	for (var validation in form.$error){
		for (var field in form.$error[validation]){
			if (form.$error[validation][field].$pristine){
				form.$error[validation][field].$pristine = false;
			}
		}
	}
}