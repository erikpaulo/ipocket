define(['angular','jquery', 'fullcalendar', 'qtip'], function (angular, $) {

//	$(document).ready(function() {
	angular.element(document).ready(function () {	

		/**
		 * Inicia modal para tooltip do calendario
		 */
		var tooltip = $('<div/>').qtip({
			id : 'fullcalendar',
			prerender : true,
			content : {
				text : ' ',
				title : {
					button : true
				}
			},
			position : {
				my : 'bottom center',
				at : 'top left',
				target : 'mouse',
				viewport : $('#calendar'),
				adjust : {
					mouse : false,
					scroll : false
				}
			},
			show : false,
			hide : false,
			style : 'qtip-light'
		}).qtip('api');
		
		/**
		 * Inicializa o calendário.
		 */
		$('#calendar').fullCalendar(
				$.extend({
					editable: true,
					eventClick: function( event, jsEvent, view ) {
						
						var content = '<h3>'+event.title+'</h3><hr>' + 
							'<p><b>Início:</b> '+event.start+'<br />' + 
							(event.end && '<p><b>Fim:</b> '+event.end+'</p>' || '<br>' ) +
							 '<textarea style="width:100%;height:100%" readonly>'+ (event.description != null ? event.description : '') +' </textarea>' +
							 '<br><br>' +
							 '<button type="button" class="btn btn-small btn-mini btn-info pull-right" onclick="callApiRemove('+ event.id +')">Remover</button>';

						tooltip.set({'content.text': content}).reposition(jsEvent).show(jsEvent);
					},
					dayClick: function() {
						tooltip.hide() 
					},
					eventResizeStart: function() {
						tooltip.hide() 
					},
					eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 
						
						//Aciona API para atualizar o evento na base de dados.
						callApiUpdate( event );
					},
					viewDisplay: function() { 
						tooltip.hide() 
					},
					eventDragStart: function() {
						tooltip.hide() 
					},
					eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ) {
						
						//Aciona API para atualizar o evento na base de dados.
						callApiUpdate( event );
					},
					eventDestroy: function( event, element, view ) {
						tooltip.hide() 
					},
					header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay'
					},
					events: function(start, end, callback) {
				        $.ajax({
				            url: 'api/test/event/listRange',
				            dataType: 'json',
				            data: {
				                start: Math.round(start.getTime()),
				                end: Math.round(end.getTime())
				            },
				            success: function(doc) {
				                var events = [];
				                $(doc).each(function() {
				                	$(this)[0]["color"] = getEventColor($(this)[0].eventType);
				                	events.push( $(this)[0] );
				                });
				                callback(events);
				            }
				        });
				    } 
				}, 
				localizeCalendar()
		));		
		
		
	});
	
	
	/**
	 * Localiza a formatação e língua do calendário.
	 */
	function localizeCalendar(){
		//TODO: Faz algum código para a localização do client e assim recuperar os nomes corretos.
		return{
			monthNames: ['Janeiro', 'Fevereiro', 'Março'    , 'Abril'  , 'Maio'    , 'Junho', 
			             'Julho'  , 'Agosto'   , 'Setembro' , 'Outubro', 'Novembro', 'Dezembro'],
			             
			monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
					          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
					          
			dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
			
			dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
		}
		
	}
	
	function getEventColor( color ){
		var colors = [];
		colors["B"] = "#38761d";
		colors["I"] = "#0b5394";
		
		return colors[color];
	}
	
	function callApiUpdate( event ){
		event.start = event.start.getTime();
		event.end = (event.end != null? event.end.getTime() : null);
		
		$.ajax({
            url: 'api/event/update',
            type: 'PUT',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify( event, ["id", "title", "description", "owner", "allDay", "start", "end", "eventType"] ),
            success: function(data){
            	$('#calendar').fullCalendar('refetchEvents');
            },
            error: function() {
            	revertFunc();
            }
        });
	}
	
	function callApiRemove(eventId){
		
		$('#calendar').fullCalendar('removeEvents', eventId);
		$('#qtip-fullcalendar').qtip('api').hide();
		
		$.ajax({
            url: 'api/event/remove/'+ eventId,
            type: 'DELETE',
            dataType: "json",
            contentType: "application/json",
            success: function(data){
            	//$('#calendar').fullCalendar('refetchEvents');
            },
            error: function() {
            	revertFunc();
            }
        });
	}	
	
});