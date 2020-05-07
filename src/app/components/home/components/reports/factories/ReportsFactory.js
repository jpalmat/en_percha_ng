import DetailAlertTemplate from '../views/modalDetailAlert.tpl';

let scopeFactory;
class SearchGridFactory {

	constructor($uibModal, homeService, $timeout, kConstantFactory, reportsService, reportsModel) {
		
		scopeFactory = this;
		this.$timeout = $timeout;
		this._reportsService = reportsService;
		this.homeService = homeService;

		this._kConstantFactory = kConstantFactory;
		this.reportsModel = reportsModel;
		this.getTareasGeneral();
		this.showGraphic = false;
		this.showIconExportExcel = false;

		this.$uibModal = $uibModal;

		this.gridOptions = {
			appScope: this,
			init: (gridCtrl, gridScope) => {
				gridScope.$on('ngGridEventData', () => {
				});
			},
			showGridFooter: false,
			onRegisterApi: (gridApi) => {
				this.gridApi = gridApi;
			},
			columnDefs: [
				{
					displayName: 'No. caso',
					field: 'nCase',
					width: '6%',
					minWidth: 75,
					cellTooltip: true,
					headerTooltip: 'N\u00FAmero de caso',
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Tipo de alerta',
					field: 'typeCase',
					width: '14%',
					minWidth: 100,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Tarea',
					field: 'task',
					width: '12%',
					minWidth: 100,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Local',
					field: 'localCompleteName',
					width: '13%',
					minWidth: 100,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Usuario',
					field: 'registerUser',
					width: '16%',
					minWidth: 100,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Generaci\u00F3n caso',
					field: 'dateGenerationCase',
					cellTemplate: `<div class="ui-grid-cell-contents" style="text-align:center;">
						{{row.entity.dateGenerationCase | date:"yyyy/MM/dd  h:mma"}}</div>`,
					width: '10%',
					minWidth: 100,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Art\u00EDculos',
					field: 'detalle',
					width: '6%',
					minWidth: 45,
					cellTooltip: true,
					headerTooltip: true,
					cellTemplate: `<div title="Ver art\u00EDculos" class="classButtonDetail btn btn-default" 
						ng-click="grid.appScope.contentSearch.openModalDetailAlert(row)"><span class="fa fa-list-alt" 
						style="color: #146E8F; cursor:pointer; font-size:20px;"></span></div>`,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Estado',
					field: 'statusCase',
					width: '8%',
					minWidth: 75,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'
				},
				{
					displayName: 'Resoluci\u00F3n caso',
					field: 'dateSolutionCase',
					cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.dateSolutionCase}}</div>',
					width: '10%',
					minWidth: 80,
					cellTooltip: true,
					headerTooltip: true,
					headerCellClass: 'classHeaderCell'

				},
				{
					name: 'Tiempo gesti\u00F3n',
					field: 'timeManagement',
					width: '10%',
					minWidth: 80,
					cellTooltip: true,
					headerTooltip: 'Tiempo de gesti\u00F3n',
					headerCellClass: 'classHeaderCell'
				}
			],
			data: [],
			rowHeight: 30,
			enableSorting: true,
			enableColumnResizing: true,
			autoResize: true,
			enableColumnMenus: false,
			enableRowSelection: true,
			enableRowHeaderSelection: false,
			enableFullRowSelection: false,
			expandableRowHeight: 150,
		};
	}

	static instance($uibModal, homeService, $timeout, kConstantFactory, reportsService, reportsModel) {
		'ngInject';
		return new SearchGridFactory($uibModal, homeService, $timeout, kConstantFactory, reportsService, reportsModel);
	}

	/**
     * realiza la busqueda de lineas comerciales
     */
    callModalDetailAlert(){
        // abrir modal
        let modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: DetailAlertTemplate.name,
            controller: 'modalDetailAlertController',
            controllerAs: 'modalDetailAlertController',
            size: 'detail',
            resolve: {
                targetEvent: function () {
                    return event;
                }
            }
        });
        modalInstance.result.then(function (answer) {
            console.log('answer', answer);
        }, function () {

        });
    }

	showDiff(initDate, endDate) {
		// var date1 = new Date();
		// var date2 = new Date("2015/07/30 21:59:00");
		//Customise date2 for your required future time
		let time = '-';
		if (!_.isUndefined(endDate) && !_.isNull(endDate)) {
			let diff = (endDate - initDate) / 1000;
			diff = Math.abs(Math.floor(diff));

			let days = Math.floor(diff / (24 * 60 * 60));
			let leftSec = diff - days * 24 * 60 * 60;

			let hrs = Math.floor(leftSec / (60 * 60));
			leftSec = leftSec - hrs * 60 * 60;

			let min = Math.floor(leftSec / (60));
			leftSec = leftSec - min * 60;

			time = days + ' d, ' + hrs + ' h, ' + min + ' m, ' + leftSec + ' s';
		}
		return time;
	}

	cleanPage() {
		this.reportsModel.clean();
		this.gridOptions.data = [];
	}
	guardarCodigosParametros(codigojde, localizacion) {
		this.codigoJde = codigojde;
		this.localizacion = localizacion;
	}

	generarReporte(params) {
		return this._reportsService.generarReporte(params);
	}

	/**
	 * Transformar la respuesta de la busqueda a otro tipo de estructura para exportar a excel
	 */
	changeObjectResultToDesignersToExportExcel(objectResult, reportsModel) {
		reportsModel.reportExcel.data = [];
		//estructura que se debe armar para crear reporte en excel
		//id, nombre, tipo dato, ancho, alineacion
		reportsModel.reportExcel.columns = {
			'nro': ['NRO.', 'String', '29.5', 'center'],
			'numeroCaso': ['NUMERO DE CASO', 'String', '100', 'left'],
			'tipoAlerta': ['TIPO DE ALERTA', 'String', '180.5', 'left'],
			'tarea': ['TAREA', 'String', '180.5', 'left'],
			'local': ['LOCAL', 'String', '180.5', 'left'],
			'usuario': ['USUARIO', 'String', '180.5', 'left'],
			'estado': ['ESTADO', 'String', '105', 'center'],
			'codigoBarras': ['CODIGO BARRAS', 'String', '100', 'rigth'],
			'nombreArticulo': ['NOMBRE ARTICULO', 'String', '240.5', 'left'],
			'tamanio': ['TAMAÑO', 'String', '80', 'left'],
			'fechaRegistro': ['FECHA REGISTRO', 'String', '105', 'center'],
			'fechaSolucion': ['FECHA SOLUCION', 'String', '105', 'center'],
			'tiempoGestion': ['TIEMPO GESTION', 'String', '105', 'center'],
		};

		for (let i = 0; i < objectResult.length; i++) {
			let estadoNegociacionProveedor = {
				'nro': i + 1, 
				'numeroCaso': objectResult[i].nCase === null ? '-' : objectResult[i].nCase,
				'tipoAlerta': objectResult[i].typeCase === null ? '-' : objectResult[i].typeCase,
				'tarea': objectResult[i].task === null ? '-' : objectResult[i].task,
				'local': objectResult[i].localCompleteName === null ? '-' : objectResult[i].localCompleteName,
				'usuario': objectResult[i].registerUser === null ? '-' : objectResult[i].registerUser,
				'estado': objectResult[i].statusCase === null ? '-' : objectResult[i].statusCase,
				'codigoBarras': objectResult[i].articleCodeBar === null ? '-' : objectResult[i].articleCodeBar,
				'nombreArticulo': objectResult[i].articleName === null ? '-' : objectResult[i].articleName,
				'tamanio': objectResult[i].articleSize === null ? '-' : objectResult[i].articleSize,
				'fechaRegistro': objectResult[i].dateRegisteredCase === null ? '-' : objectResult[i].dateRegisteredCase,
				'fechaSolucion': objectResult[i].dateSolutionCase === null ? '-' : objectResult[i].dateSolutionCase,
				'tiempoGestion': objectResult[i].timeManagement === null ? '-' : objectResult[i].timeManagement,
			};
			reportsModel.reportExcel.data.push(estadoNegociacionProveedor);
		}
	}

	//Obtener Lista de Locales
	//filter=SUPERMAXI,MEGAMAXI,AKI,GRAN AKI,AKI - GRAN AKI,SUPERMAXI71,MAXIS-AKIS,MAXIS,AKIS
	getLocal(params) {
		return this._reportsService.getLocal(params);
	}

	//Obtener Lista de usuarios proveedores
	getUsers(params) {
		return this.homeService.getUsers(params);
	}

	//Inicializar filtros de busqueda
	getTareasGeneral() {
		this.reportsModel.listaTareasFiltradas = this.reportsModel.listaTareas;
	}

	numeroAlertasPorTipo() {
		this.chart1 = {};
		this.chart1.type = 'ColumnChart';
		this.chart1.options = {
			title: 'Tipo de Alertas',
			width: 500,
			height: 250,
			backgroundColor: 'transparent',
			legend: { position: 'none' },
			hAxis: {
				slantedText: true, slantedTextAngle: 30
			},
			bar: { groupWidth: '90%' }
		};
		scopeFactory.chart1.data = [];
		scopeFactory.chart1.data = scopeFactory.reportsModel.dataNumeroAlertasPorTipo;
	}

	//CONFIGURACION DEL GRAFICO NUMERO DE ALERTAS POR ESTADO
	numeroAlertasPorEstado() {
		this.chart2 = {};
		this.chart2.type = 'PieChart';
		this.chart2.options = {
			title: 'Estado de las Alertas',
			is3D: false,
			width: 500,
			height: 250,
			chartArea: { left: 10, top: 50, bottom: 0 },
			legend: { textStyle: { fontSize: 9 } },
			backgroundColor: 'transparent',
			slices: {
				0: { color: '#DFD43A' },
				1: { color: '#6cc644' }
			},
		};
		scopeFactory.chart2.data = [];
		scopeFactory.chart2.data = scopeFactory.reportsModel.dataNumeroAlertasPorEstado;
	}

	//CONFIGURACION DEL GRAFICO TIEMPO GESTION TARES DE ALERTAS
	tiempoGestionAlertas() {
		this.chart3 = {};
		this.chart3.type = 'ColumnChart';
		this.chart3.options = {
			title: 'Tiempo promedio de gestión por tarea (horas)',
			width: 500,
			height: 250,
			backgroundColor: 'transparent',
			legend: { position: 'none' },
			/*axes: {
				x: {
					0: { side: 'top', label: 'White to move'} // Top x-axis.
				}
			},*/
			hAxis: {
				slantedText: true, slantedTextAngle: 30
			},
			bar: { groupWidth: '90%' }
		};
		scopeFactory.chart3.data = [];
		scopeFactory.chart3.data = scopeFactory.reportsModel.dataTiempoGestion;
	}

	//CONFIGURACION DEL GRAFICO NUMERO DE ALERTAS POR LOCAL
	numeroAlertasPorLocal() {
		this.chart4 = {};
		this.chart4.type = 'ColumnChart';
		this.chart4.options = {
			title: 'Número de alertas/visita por Local',
			width: 500,
			height: 250,
			backgroundColor: 'transparent',
			legend: { position: 'none' },
			hAxis: {
				slantedText: true, slantedTextAngle: 30
			},
			bar: { groupWidth: '90%' }
		};
		scopeFactory.chart4.data = [];
		scopeFactory.chart4.data = scopeFactory.reportsModel.dataNumeroAlertasPorLocal;
	}

	//CONFIGURACION DEL GRAFICO NUMERO DE VISITAS POR LOCAL
	numeroVisitasPorLocal() {
		this.columnchart_provider = {};
		this.columnchart_provider.type = 'ColumnChart';
		this.columnchart_provider.options = {
			title: 'Número de visitas de proveedores por Local',
			width: 1350,
			height: 250,
			backgroundColor: 'transparent',
			legend: { position: 'rigth' },
			vAxis: {
				title: 'Cantidad visitas'
			},
			hAxis: {
				slantedText: true, 
				slantedTextAngle: 30,
			},
			bar: { groupWidth: '90%' }
		};
		scopeFactory.columnchart_provider.data = [];
		scopeFactory.columnchart_provider.data = scopeFactory.reportsModel._dataNumeroVisitasPorLocal;
	}
}
export default SearchGridFactory;
