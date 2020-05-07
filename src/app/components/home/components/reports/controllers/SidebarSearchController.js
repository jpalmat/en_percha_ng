let _ = window._;
let scopeCrtl;
class SidebarSearchController {

	constructor(lodash, reportsFactory, reportsModel, kLoadingService, $scope, $timeout, $location, kMessageService, homeModel) {
		'ngInject';

		scopeCrtl = this;
		this.lodash = lodash;
		this.$scope = $scope;
		this.$timeout=$timeout;
		this.homeModel = homeModel;
		this.reportsModel = reportsModel;
		this.iFrameUrl = $location.search();
		this.reportsFactory = reportsFactory;
		this.kLoadingService=kLoadingService;
		this.kMessageService = kMessageService;

		// this.reportsModel._codigoJde = this.iFrameUrl.codigoJde;
		// this.reportsModel._codProvLocal = this.iFrameUrl.localizacion;		    

		this.init();
	}
	init(){
			this.kLoadingService.show();
			this.reportsFactory.getLocal({
				 filter: 'SUPERMAXI,MEGAMAXI,AKI,GRAN AKI,AKI - GRAN AKI,SUPERMAXI71,MAXIS-AKIS,MAXIS,AKIS' })
				 .success((data) => {
			this.reportsModel._locales = data;
			this.kLoadingService.hide();
			this.$scope.$digest();
		});
		this.kLoadingService.show();
		this.filtro = this.homeModel._jdeCode + ',' + this.homeModel._localCodeProv + ',' + this.homeModel._personCodeProv;
		this.reportsFactory.getUsers({filter:this.filtro}).success((data) => {
		this.reportsModel._users = data;
		this.$scope.$digest();
		this.kLoadingService.hide();
	});
		this.reportsFactory.cleanPage();
	}

	/**
	 * inicializar filtros de busqueda
	 */
	clear(){
		this.reportsModel.filters.numeroCaso.clear();
		this.reportsModel.filters.tipoAlerta.clear();
		this.reportsModel.filters.tarea.clear();
		this.reportsModel.filters.local.clear();
		this.reportsModel.filters.usuario.clear();
		this.reportsModel.filters.estado.clear();
		this.reportsModel.filters.fechaGestion.clear();
		this.reportsModel.filters.fechaResolucion.clear();
	}

	/**
	 * buscar reporte
	 */
	reporte($event) {

		if(($event.type === 'keyup' && $event.keyCode === 13) || $event.type === 'click') {

			this.kMessageService.hide();
			this.kLoadingService.show();
			var params = _.clone(this.reportsModel.filters);
			params.codigoJde = this.homeModel._jdeCode;
			params.localizacion = this.homeModel._localCodeProv;
			params.persona = this.homeModel._personCodeProv;
		
			this.reportsFactory.generarReporte(params).success((data)=> {
				if(data.itemsReport != null){
					this.reportsFactory.showGraphic = true;
					this.reportsFactory.showIconExportExcel = true;
					scopeCrtl.reportsModel.filtersTmp = params;
					this.reportsFactory.gridOptions.data = data.itemsReport;
					this.reportsFactory.changeObjectResultToDesignersToExportExcel(data.itemsReportForExcel,this.reportsModel);

					//Asignacion de datos para graficar
					//Número de alertas por tipo
					if(data.dataForAlertByType != null){
						this.reportsModel._dataNumeroAlertasPorTipo = data.dataForAlertByType;
						this.reportsFactory.numeroAlertasPorTipo();
					}

					//Número de alertas por estado
					if(data.dataForAlertByStatus != null){
						this.reportsModel._dataNumeroAlertasPorEstado = data.dataForAlertByStatus;
						this.reportsFactory.numeroAlertasPorEstado();
					}

					//Número de alertas por local
					if(data.dataForAlertByLocal != null){
						this.reportsModel._dataNumeroAlertasPorLocal = data.dataForAlertByLocal;
						this.reportsFactory.numeroAlertasPorLocal();
					}

					//Número de visitas por local
					if(data.dataForAlertByUserByLocal != null){
						this.reportsModel._dataNumeroVisitasPorLocal = this.getPivotArray(data.dataForAlertByUserByLocal, 0, 1, 2);
						this.reportsFactory.numeroVisitasPorLocal();
					}

					if(data.dataForTimeGestionByAlert != null){
						this.reportsModel._dataTiempoGestion = data.dataForTimeGestionByAlert;
						this.reportsFactory.tiempoGestionAlertas();
					}
				}else{
					this.reportsFactory.showGraphic = false;
					this.reportsFactory.showIconExportExcel = false;
					this.reportsFactory.gridOptions.data=[];
					this.reportsModel._dataNumeroAlertasPorTipo=[];
					this.reportsModel._dataNumeroAlertasPorEstado=[];
					this.reportsModel._dataNumeroAlertasPorLocal=[];
					this.reportsModel._dataTiempoGestion=[];
					this.reportsFactory.numeroAlertasPorTipo();
					this.reportsFactory.numeroAlertasPorEstado();
					this.reportsFactory.numeroAlertasPorLocal();
					this.reportsFactory.tiempoGestionAlertas();
					this.kMessageService.add('No se encontraron registros para los filtros ingresados, por favor verifique.');
					this.kMessageService.showInfo();
				}
		
				this.$scope.$apply();
				this.kLoadingService.hide();
				})
			.info(() => {
				alert('info');
			})
			.warning(() => {
				alert('war');
			})
			.error(() => {
				alert('Ocurrio un error al realizar la busqueda');
			});
		}
	}

	verificarOpcion() {
		scopeCrtl.$timeout(() =>{
			//inicializamos la lista de tareas
			this.reportsModel.filters.tarea.clear();
			//clonamos el tipo de alerta seleccionada
			let caseType = this.lodash.clone(scopeCrtl.reportsModel.filters.tipoAlerta.parameterValue);
			this.reportsModel.listaTareasFiltradas = [];
			//se valida si es de tipo cantidad insuficiente (5) para desplegar las mismas tareas de percha vacia (1)
			if(scopeCrtl.reportsModel.filters.tipoAlerta.parameterValue == 5){
				caseType = '1';
			}
			//se valida si la alerta es falta de cenefa de promocion (8) para mostrar la tarea de la falta de cenefa (7)
			if(scopeCrtl.reportsModel.filters.tipoAlerta.parameterValue == 8){
				caseType = '7';
			}
			//filtrar el listado de tareas por el tipo de alerta
			let tareasFiltradas = this.reportsModel.listaTareas.filter((tarea) =>{
				return caseType === tarea.tipoAlerta ;
			});
			this.reportsModel.listaTareasFiltradas = tareasFiltradas;
		}, 100);
	}

/**
 * convierte los datos para mostrar en el chart de reportes
 * Convert a Column to a Row
 * http://techbrij.com/google-chart-dynamic-series-column-javascript-array
 */
	getPivotArray(dataArray, rowIndex, colIndex, dataIndex) {
           var result = {}, ret = [];
           var newCols = [];
		   var nombreProveedor;
		   var nombreLocal;
           for (var i = 0; i < dataArray.length; i++) {
 
			   nombreProveedor = this.titleCase(dataArray[i][rowIndex]);
               if (!result[nombreProveedor]) {
                   result[nombreProveedor] = {};
               }
				
				nombreLocal = this.titleCase(dataArray[i][colIndex]);

               result[nombreProveedor][nombreLocal] = dataArray[i][dataIndex];
 
               //To get column names
               if (newCols.indexOf(nombreLocal) == -1) {
                   newCols.push(nombreLocal);
               }
           }
 
           newCols.sort();
           var item = [];
 
           //Add Header Row
           item.push('Performance');
           item.push.apply(item, newCols);
           ret.push(item);
 
           //Add content 
           for (var key in result) {
               item = [];
               item.push(key);
               for (var i = 0; i < newCols.length; i++) {
                   item.push(result[key][newCols[i]] || 0);
               }
               ret.push(item);
           }
           return ret;
       }

	   /**
		* capitalizar texto
	    */
	   titleCase(str) {
		return str.split(' ').map(function(val){ 
				return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
			}).join(' ');
		}
}

export default SidebarSearchController;
