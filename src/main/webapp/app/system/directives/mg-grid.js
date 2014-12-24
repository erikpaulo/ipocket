define(['./module', 'jquery'], function(directives, $)
{
	
	/**
	 * Diretiva que trata o encapsulamento do objeto JQuery Datatables e gera todas as 
	 * tabelas de listagem de dados da aplicação.
	 * 
	 * Uso:
	 *    - columns: As colunas devem ser definidas no controlador no modo: { "sTitle": "nome",   "mData": "atributo" }
	 *    - colReorder: true se deseja que as colunas da tabela sejam organizáveis
	 *    - colVis: true se deseja acrescentar função para acrescentar/remover colunas da visualização do grid.
	 *    - fixedCols: true se deseja que a primeira coluna fique congelada. Nesse caso é preciso informar tableWidth e este
	 *                 precisa ser igual a soma do tamanho das colunas visíveis da tabela. 
	 *    - tableTools: true se deseja acrescentar as operações de download excel/pdf e seleção de linha.
	 * 
	 * @TODO: 
	 *    - Encapsular na diretiva o header com operations no datatable
	 */
	directives.directive('mgGrid', function($compile) {
		return {
			restrict: 'A',
			scope: {
				columns: '=',
				columnsDef: '=',
				'edit': '&onEdit',
				'remove': '&onRemove', 
				'removeAll': '&onRemoveAll',
				colReorder: '=',
				colVis: '=',
				fixedCols: '=',
				tableWidth: '=',
				tableTools: '='
			},
			transclude: true,
			link: function (scope, element, attrs) {
				var options = {};
				var sDom = '<"top"f<"clear"i>>rt<"row"l<"table-bottom"ip>>';
				
				options = {
					fnInitComplete: function(oSettings, json) {
								
						// Altera posição da operação de search da tabela.
						$('#grid_filter').prependTo('#resultGridTools');
						
						// Se acionado com opção de mostrar plugin ColVis.
						if ( scope.colVis ){
							var colVisButton = $('.ColVis_Button.ColVis_MasterButton');
							colVisButton.empty();
							colVisButton.append('<i class="glyphicon glyphicon-list"></i>');
							colVisButton.appendTo("#resultGridTools");
						}
						
						if ( scope.tableTools ){
							$('.DTTT_button.DTTT_button_print span').
								append('<i class="fa fa-print"></i>');
							$('.DTTT_button.DTTT_button_collection span').
							append('<i class="fa fa-cloud-download"></i>');
							$('.DTTT_container').appendTo('#resultGridTools');
						}
						
						// Remove o campo de pesquisa da combo de tamanho da página e adiciona style bootstrap.
						$('.dataTables_length label select').select2({minimumResultsForSearch: -1});
						
						// Altera os botões da paginação.
						$('.icon-chevron-left').addClass('glyphicon glyphicon-chevron-left').removeClass('icon-chevron-left');
						$('.icon-chevron-right').addClass('glyphicon glyphicon-chevron-right').removeClass('icon-chevron-right');
						
						
					},
					fnCreatedRow: function( nRow, aData, iDataIndex ) {
						$compile(nRow)(scope);
					},
					"oLanguage": {
					    "sEmptyTable":     "Nenhum registro encontrado.",
					    "sInfo": "Mostrar _START_ até _END_ de _TOTAL_ registros",
					    "sInfoEmpty": "Mostrar 0 até 0 de 0 Registros",
					    "sInfoFiltered": "(Filtrar de _MAX_ total registros)",
					    "sInfoPostFix":    "",
					    "sInfoThousands":  ".",
					    "sLengthMenu": "Mostrar _MENU_ registros por pagina",
					    "sLoadingRecords": "Carregando...",
					    "sProcessing":     "Processando...",
					    "sZeroRecords": "Nenhum registro encontrado",
					    "sSearch": "Pesquisar: ",
					    "oPaginate": {
					        "sNext": "Proximo",
					        "sPrevious": "Anterior",
					        "sFirst": "Primeiro",
					        "sLast":"Ultimo"
					    },
					    "oAria": {
					        "sSortAscending":  ": Ordenar colunas de forma ascendente",
					        "sSortDescending": ": Ordenar colunas de forma descendente"
					    }
					}
				}
			
				// Define as colunas da tabela, recuperadas da configuração do controlador.           
				if (attrs.columns) {
					options["aoColumns"] = scope.columns;
				}
			
				// aoColumnDefs is dataTables way of providing fine control over column config
				if (attrs.columnsDef) {
					 options["aoColumnDefs"] = scope.columnsDef;
				}
			
				// COLVIS
				if ( scope.colVis ){
					sDom = 'C' + sDom;
					options["oColVis"] = {
						"buttonText": "",
						"sAlign": "right"
					}
				}
			
				// COLREORDER
				if ( scope.colReorder ) {
					sDom = 'R' + sDom;
				}
			
				// FIXEDCOLS
				if (scope.fixedCols && attrs.tableWidth){
					options["sScrollX"] = scope.tableWidth;
					options["bAutoWidth"]= false;
					options["sScrollY"] = "100%";
					options["bScrollCollapse"] =  false;
					
					// Se utilizando fixedColumns, remove a primeira coluna do colVis.
					if (scope.colVis){
						options.oColVis["aiExclude"] = [ 0 ];
					}
					
					// Se utilizando fixedColumns, não permite que a primeira coluna seja organizada.
					if (scope.colReorder){
						options["oColReorder"] = {iFixedColumns: 1}
					}
				} else {
					options["bAutoWidth"]= true;
				}
				
				// TABLETOOLS
				if ( scope.tableTools ){
					sDom = 'T' + sDom;
					options["tableTools"] = {
							"sRowSelect": "single",
							"aButtons": [
							             {
							            	 "sExtends":    "print",
							            	 "sButtonText": ""
							             },
							             {	"sExtends":    "collection",
							            	 "sButtonText": "",
							            	 "aButtons":    [ "copy", "xls", "pdf" ]
							              }]
					}
				}
				
				options["sDom"] = sDom;
			
				// Aplica o script da tabela
				var dataTable = element.dataTable(options);
				var tt = new $.fn.dataTable.TableTools( dataTable, {
					sSwfPath : "resources/lib/datatables-tabletools/swf/copy_csv_xls_pdf.swf"
				});
				
				// watch for any changes to our data, rebuild the DataTable
				scope.$parent.$watch(attrs.model, function(value) {
					var val = value || null;
					if (val) {
						dataTable.fnClearTable();
						if (value.length>0) dataTable.fnAddData(value);

						if ( attrs.fixedCols ){
							var fc = new $.fn.dataTable.FixedColumns( dataTable, {leftColumns: 1} );
						}
					}
				});
			}
		}
	});

});