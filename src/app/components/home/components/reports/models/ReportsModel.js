import {BaseSearchTemplate} from 'kSearch/lib';

class ReportsModel {

	constructor(reportsService) {
		this.reportsService = reportsService;
		this.filters = new BaseSearchTemplate(
			'numeroCaso',
			'tipoAlerta',
			'tarea',
			'local',
			'usuario',
			'estado',
			'fechaGestion',
			'fechaResolucion',
			'codigoJde',
			'localizacion',
			'persona'
		);
		
		this.listaTipoAlertas = [
			{'@id': {tipoAlerta: 1}, label: 'Percha vac\u00EDa'}, // 1,2,3,4
			{'@id': {tipoAlerta: 2}, label: 'Incosistencia inventario'}, //5
			{'@id': {tipoAlerta: 3}, label: 'Inconsistencia precios'}, //6
			{'@id': {tipoAlerta: 4}, label: 'Falta material POP'}, //7
			{'@id': {tipoAlerta: 5}, label: 'Cantidad insuficiente'}, //9,10,11,12
			{'@id': {tipoAlerta: 6}, label: 'Vigencia de producto'}, //13
			{'@id': {tipoAlerta: 7}, label: 'Falta cenefa'}, //14
			{'@id': {tipoAlerta: 8}, label: 'Falta cenefa de promoci\u00F3n'}, //15
		];

		this.listaTareas = [
			{'@id': {tarea: 1}, label: 'Cambio cenefa', tipoAlerta:'3'},
			{'@id': {tarea: 2}, label: 'Pedido bodega', tipoAlerta:'1'},
			{'@id': {tarea: 3}, label: 'Pedido proveedor', tipoAlerta:'1'},
			{'@id': {tarea: 4}, label: 'Revisi\u00F3n inventario', tipoAlerta:'2'},
			{'@id': {tarea: 5}, label: 'Surtir percha', tipoAlerta:'1'},
			{'@id': {tarea: 6}, label: 'Colocar material POP', tipoAlerta:'4'},
			{'@id': {tarea: 7}, label: 'Cambio producto', tipoAlerta:'6'}, //13
			{'@id': {tarea: 8}, label: 'Colocar cenefa', tipoAlerta:'7'}, //14 y 15
		];

		this.listaEstadoAlerta = [
			{'@id': {estado: 3}, label: 'Finalizado'},
			{'@id': {estado: 1}, label: 'En progreso'}
		];

		this._locales = [];
		this._users = [];
		this._listaTareasFiltradas = [];
		this._dataNumeroAlertasPorTipo = [];
		this._dataNumeroAlertasPorEstado = [];
		this._dataNumeroAlertasPorLocal = [];
		this._dataNumeroVisitasPorLocal = [];
		this._dataTiempoGestion = [];

		// guarda la informacion de la alerta seleccionada
		this._detailAlert = null;
		
		this.filtersTmp = {};
		//informacion de alertas para archivo excel
		this.reportExcel = ({
			data : []
		});
		
	}


	get locales() {
		return this._locales;
	}

	set locales(locales) {
		this._locales = locales;
	}

	get users() {
		return this._users;
	}

	set users(users) {
		this._users = users;
	}
	get dataNumeroAlertasPorTipo(){
		return this._dataNumeroAlertasPorTipo;
	}
	set dataNumeroAlertasPorTipo(dataNumeroAlertasPorTipo){
		this._dataNumeroAlertasPorTipo = dataNumeroAlertasPorTipo;
	}

	get dataNumeroAlertasPorEstado(){
		return this._dataNumeroAlertasPorEstado;
	}
	set dataNumeroAlertasPorEstado(dataNumeroAlertasPorEstado){
		this._dataNumeroAlertasPorEstado = dataNumeroAlertasPorEstado;
	}

	get dataNumeroAlertasPorLocal(){
		return this._dataNumeroAlertasPorLocal;
	}
	set dataNumeroAlertasPorLocal(dataNumeroAlertasPorLocal){
		this._dataNumeroAlertasPorLocal = dataNumeroAlertasPorLocal;
	}
	
	get dataTiempoGestion(){
		return this._dataTiempoGestion;
	}
	set dataTiempoGestion(dataTiempoGestion){
		this._dataTiempoGestion = dataTiempoGestion;
	}

	// get codigoJde(){
	// 	return this._codigoJde;
	// }
	// set codigoJde(codigoJde){
	// 	this._codigoJde = codigoJde;
	// }

	// get codProvLocal(){
	// 	return this._codProvLocal;
	// }
	// set codProvLocal(codProvLocal){
	// 	this._codProvLocal = codProvLocal;
	// }

	get showIconExportExcel(){
		return this._showIconExportExcel;
	}
	set showIconExportExcel(showIconExportExcel){
		this._showIconExportExcel = showIconExportExcel;
	}

	clean(){
		if(!_.isUndefined(this.filters)){
			Object.keys(this.filters).forEach((item)=>{
				this.filters[item].parameterValue = null;
			});
		}
		
		//Settear fechas por defecto
		/*this.filters.fechaGestion.setDefaultParameterValue( (new Date()).getTime());
		this.filters.fechaResolucion.setDefaultParameterValue( (new Date()).getTime());*/

		this._listaTareasFiltradas = [];
		this._dataNumeroAlertasPorTipo = [];
		this._dataNumeroAlertasPorEstado = [];
		this._dataNumeroAlertasPorLocal = [];
		this._dataTiempoGestion = [];
	}

	static instance(reportsService) {
		return new ReportsModel(reportsService);
	}

}

export default ReportsModel;