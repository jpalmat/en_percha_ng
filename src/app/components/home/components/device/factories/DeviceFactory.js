import DeviceRegisterTemplate from '../views/deviceRegister.tpl';
let _ = window._;
class DeviceFactory {

	constructor(lodash, homeService, deviceService, kLoadingService, uiGridConstants, kMessageService, deviceModel, 
		$uibModal, $timeout, homeModel, kConstantFactory) {
		
		this.lodash = lodash;
		this.windowModal = null;
		this.$timeout = $timeout;
		this.homeModel = homeModel;
		this.$uibModal = $uibModal;
		this.deviceModel = deviceModel;
		this.homeService = homeService;
		this.deviceService = deviceService;
		this.kLoadingService = kLoadingService;
		this.uiGridConstants = uiGridConstants;
		this.kMessageService = kMessageService;

		this.gridOptions = {
			data:[],
			rowHeight: 30,
			enableSorting: true,
			enableFiltering: true,
			enableColumnMenus: false,
			enableColumnResizing: true,
			autoResize: true,
			onRegisterApi: (gridApi) => {
				this.gridApi = gridApi;
			},
		};
		
		// params to bind in grid
		this.models = [];
		this.tradeMarks = [];
		this.states = [];

		this.deviceModel._device = null;
		this.so = [];
		this.constStates = [
			{
				value: 'ACT',
				label: 'ACTIVO'
			},
			{
				value: 'INA',
				label: 'INACTIVO',
			}
		];
		this.dataConstants = null;
		kConstantFactory.$getConstant('mobile').then((data) => {
			this.dataConstants = data;			
		});
		//this.init();
		//this.loadDataGrid([]);
	}

	static instance(lodash, homeService, deviceService, kLoadingService, uiGridConstants, kMessageService, deviceModel, 
		$uibModal, $timeout, homeModel,kConstantFactory) {
		'ngInject';

		return new DeviceFactory(lodash, homeService, deviceService, kLoadingService, uiGridConstants, kMessageService, 
			deviceModel, $uibModal, $timeout, homeModel,kConstantFactory);
	}

	/**
	 * limpiar valores de la pantalla
	 */
	cleanScreen(){
		this.gridOptions.columnDefs = [];
		this.gridOptions.data = [];
	}

	/**
	 * inicializar grid
	 */
	init() {
		let columns = [
			{
				displayName: 'No.',
				name: 'no',  
				width: '3%', 
				cellTooltip: true,
				headerTooltip: 'N\u00FAmero de registro',
				enableFiltering: false,
				enableSorting: false,
				headerCellClass: 'classHeaderCell headerNoFilter',
				cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
			},
			{
				displayName: 'Nombre completo',
				field: 'userFullName',
				minWidth: 150,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell'
			},
			{
				displayName: 'Marca',
				title: 'Prueba',
				field: 'tradeMark',
				filter: {
					type: this.uiGridConstants.filter.SELECT,
					selectOptions: this.tradeMarks,
					placeholder: 'Todos'
				},
				width: 150,
				minWidth: 150,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell',
				cellClass: 'device-grid-cell-center',
			},
			{
				displayName: 'Modelo',
				field: 'model',
				filter: {
					type: this.uiGridConstants.filter.SELECT,
					selectOptions: this.models,
					placeholder: 'Todos'
				},
				width: 150,
				minWidth: 150,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell',
				cellClass: 'device-grid-cell-center'
			},
			{
				displayName: 'Versi\u00F3n',
				field: 'versionSO',
				width: 100,
				minWidth: 100,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell'
			},
			{
				displayName: 'S.O.',
				filter: {
					type: this.uiGridConstants.filter.SELECT,
					selectOptions: this.so
				},
				field: 'so',
				width: 100,
				minWidth: 100,
				cellClass: 'device-grid-cell-center',
				cellTooltip: true, 
				headerTooltip: 'Sistema operativo',
				headerCellClass: 'classHeaderCell'
			},
			{
				displayName: 'Estado',
				filter: {
					type: this.uiGridConstants.filter.SELECT,
					selectOptions: this.states,
					placeholder: 'Todos'
				},
				cellTemplate: `<div> <span style="{{row.entity.state == 'ACT' ? 'color:#2aae0f;' : 'color:#f62b00'}}"  
					class="iconState {{row.entity.state == 'ACT' ? 'fa fa-check-circle' : 'fa fa-minus-circle'}}"></span>
					<a href ng-click="grid.appScope.contentDevice.changeState(row.entity)" style="margin-left:5px;">
					{{row.entity.state == 'ACT' ? 'Activo' : 'Inactivo'}}</a> </div>`,
				field: 'state',
				width: 100,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell'
			},
			{
				displayName: 'Fecha inicial de uso',
				field: 'dateBeginUserUse',
				width: '10%',
				cellTemplate: `<div class="ui-grid-cell-contents" style="text-align:center;">
					{{row.entity.dateBeginUserUse | date:"yyyy/MM/dd  h:mma"}}</div>`,
				enableFiltering: false,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell headerNoFilter'
			},
			{
				displayName: 'Fecha inicial de registro',
				field: 'dateBeginUserRegister',
				width: '11%',
				cellTemplate: `<div class="ui-grid-cell-contents" style="text-align:center;">
					{{row.entity.dateBeginUserRegister | date:"yyyy/MM/dd  h:mma"}}</div>`,
				enableFiltering: false,
				cellTooltip: true, 
				headerTooltip: true,
				headerCellClass: 'classHeaderCell headerNoFilter'
			}
		];
		// si la pantalla se abre desde el max se edita
		if(this.homeModel._isFromMax){

			//columna editar dispositivo
			columns.push({
				field: 'edit',
				displayName: '',
				width: '3%',
				cellTemplate: `<div><i ng-click="grid.appScope.contentDevice.editDeviceRegister(row.entity)" 
					title="Editar registro" class="iconEdit fa fa-pencil-square-o" style="color: #3e79d2;"></i></div>`,
				enableFiltering: false,
				enableSorting: false,
				headerCellClass: 'classHeaderCell headerNoFilter'
			});
			//columna eliminar dispositivo
			columns.push({
				field: 'delete',
				displayName: '',
				width: '3%',
				cellTemplate: `<div><i ng-click="grid.appScope.contentDevice.deleteDeviceRegister(row.entity)" 
					title="Eliminar registro" class="iconEdit fa fa-times" style="color: #E74C3C;"></i></div>`,
				enableFiltering: false,
				enableSorting: false,
				headerCellClass: 'classHeaderCell headerNoFilter'
			});
		}
		// se agrega las columnas en el grid
		this.gridOptions.columnDefs = columns;
	}

	/**
	 * Load all params to show in grid columns
	 * @param {*} data 
	 */
	loadParamsToBind(data) {
		// load the models
		let model = [];
		let tradeMark = [];
		let states = [];
		let so = [];
		data.forEach((item) => {
			let modelItem = {
				value: item.model,
				label: item.model
			};

			let tradeMarkItem = {
				value: item.tradeMark,
				label: item.tradeMark
			};

			let stateItem = {
				value: item.state,
				label: item.state == 'ACT' ? 'Activo' : 'Inactivo'
			};

			let soItem = {
				value: item.so,
				label: item.so
			};


			if (!_.some(model, { 'value': modelItem.value })) {
				model.push(modelItem);
			}
			if (!_.some(tradeMark, { 'value': tradeMarkItem.value })) {
				tradeMark.push(tradeMarkItem);
			}
			if (!_.some(states, { 'value': stateItem.value })) {
				states.push(stateItem);
			}
			if (!_.some(so, { 'value': soItem.value })) {
				so.push(soItem);
			}
			// isUpdate entity
			// console.log('conts: ', this.dataConstants);
			// var updateObject = this.showDiff(item.dateUpdate, new Date().getTime(), this.dataConstants.DAYS_BY_UPDATE);
			// item.isUpdate = updateObject.isUpdate;
			// item.timeByUpdate = updateObject.text;
		});
		this.models = model;
		this.tradeMarks = tradeMark;
		this.states = states;
		this.so = so;
	}

	/**
	 * 
	 * @param {*} data 
	 */
	loadDataGrid(data) {
		let gridOptions = this.gridOptions;
		let autoSizeGridFun = this.autoSizeGrid;
		this.$timeout(function () {
			gridOptions.data = data;
			autoSizeGridFun(data.length);
		}, 100);
	}
	/**
	 * Return the selected rows
	 */
	getSelectedRows() {
		return this.gridApi.selection.getSelectedRows();
	}
	/**
	 * 
	 */
	getUsers() {
		let localCodeProv = this.lodash.isUndefined(this.homeModel._localCodeProv) ? null : this.homeModel._localCodeProv;
		let personCodeProv = this.lodash.isUndefined(this.homeModel._personCodeProv) ? null : this.homeModel._personCodeProv;
		var params = { filter: this.homeModel._jdeCode + ',' + localCodeProv + ',' + personCodeProv };
		return this.homeService.getUsers(params);
	}

	/**
	 * actualiza el estado del dispositivo seleccionado
	 */
	updateStateDevice(param) {
		this.deviceService.updateState(param)
			.success((data) => {
				this.search(false);
			})
			.error((e) => {
				this.kMessageService.showError('Hubo un error al actualizar el estado del dispositivo');
				this.kLoadingService.hide();
			});
	}

	/**
	 * actualiza la informacion del registro seleccionado
	 */
	updateDeviceRegister(param) {
		this.kLoadingService.show();
		this.deviceService.update(param)
			.success((data) => {
				this.search(false);
			})
			.error((e) => {
				this.kMessageService.showError('Hubo un error al actualizar los datos del dispositivo');
				this.kLoadingService.hide();
			});
	}

	/**
	 * busca dispositivos registrados 
	 * @init Indica si es la busqueda inicial para mostrar mensaje
	 */
	search(init, userId) {
		//login al proyecto de control acceso
		this.loginToken = {userId : userId};
		this.deviceService.loginByToken(this.loginToken)
			.success((data) => {
				if(!this.lodash.isEmpty(data)){
					this.params = { providerCode: this.homeModel._jdeCode, sysId: 'EPM' };
					this.deviceService.findByProvider(this.params)
						.success((res) => {
							if(!this.lodash.isEmpty(res)){
								this.loadData(res, init);
							}else{
								this.kMessageService.showInfo('No se encontraron dispositivos registrados.');
								this.kLoadingService.hide();
							}
						})
						.error((e) => {
							this.kMessageService.showError('Hubo un error al buscar los dispositivos');
							this.kLoadingService.hide();
						});
				} else {
					this.kMessageService.showError('Problemas de autenticacion');
					this.kLoadingService.hide();
				}
			})
			.error((e) => {
				console.log('Servicio no disponible, problemas de autenticacion');
				this.kMessageService.showError('Servicio no disponible, problemas de autenticacion');
				this.kLoadingService.hide();
			});

		/*************************** */
		
		// this.models = [];
		// this.params = { providerCode: this.homeModel._jdeCode };
		// this.deviceService.findByProvider(this.params)
		// 	.success((data) => {
		// 		if(!this.lodash.isEmpty(data)){
		// 			this.loadData(data, init);
		// 		}else{
		// 			this.kMessageService.showInfo('No existen dispositivos registrados.');
		// 			this.kLoadingService.hide();
		// 		}
		// 	})
		// 	.error((e) => {
		// 		this.kMessageService.showError('Hubo un error al buscar los dispositivos');
		// 		this.kLoadingService.hide();
		// 	});
	}

	/**
	 * Valida si existe un dispositivo activo
	 */
	findActiveDevice(entity){
		return this.deviceService.findActiveDevice(entity);
	}

	/**
	 * 
	 * @param {*} data 
	 */
	loadData(data, init) {
		this.loadParamsToBind(data);
		this.deviceModel._device = data;
		this.init();
		this.loadDataGrid(data);
		this.deviceModel._device = data;
		if(!init){
			this.kMessageService.showInfo('La informaci&#243;n se registr&#243; correctamente.');
			this.kLoadingService.hide();
		}
		this.$timeout(() => {
			this.kLoadingService.hide();
		}, 10);
	}

	/**
	 * registra nuevo dispositivo
	 * @param {*} param 
	 */
	createDeviceRegister(param) {
		this.deviceService.create(param)
			.success((data) => {
				this.search();
			})
			.error((e) => {
				this.kMessageService.showError('Error al registrar el dispositivo.');
				this.kLoadingService.hide();
			});
	}
	/**
	 * 
	 * @param {*} size 
	 * @param {*} templateUrl 
	 * @param {*} controller 
	 * @param {*} controllerAs 
	 * @param {*} params 
	 */
	openModal(size, templateUrl, controller, controllerAs, params) {
		this.windowModal = this.$uibModal.open({
			animation: true,
			templateUrl: templateUrl,
			controller: controller,
			controllerAs: controllerAs,
			size: 'device',
			backdrop: 'static',
			resolve: {
				params: function () {
					return params;
				}
			}
		});
	}
	/**
	 * 
	 * @param {*} initDate 
	 * @param {*} endDate 
	 * @param {*} timeToUpdate 
	 */
	showDiff(initDate, endDate, timeToUpdate) {
		// var date1 = new Date();
		// var date2 = new Date("2015/07/30 21:59:00");
		//Customise date2 for your required future time
		var days = 0;
		var isUpdate = true;
		var text = 'Aun no se ha actualizado.';
		if (!_.isUndefined(endDate) && !_.isNull(endDate)) {
			var diff = (endDate - initDate) / 1000;
			var diff = Math.abs(Math.floor(diff));

			var days = Math.floor(diff / (24 * 60 * 60));
			var leftSec = diff - days * 24 * 60 * 60;

			var hrs = Math.floor(leftSec / (60 * 60));
			var leftSec = leftSec - hrs * 60 * 60;

			var min = Math.floor(leftSec / (60));
			var leftSec = leftSec - min * 60;

			text = days + ' d, ' + hrs + ' h, ' + min + ' m, ' + leftSec + ' s';
			isUpdate = days >= timeToUpdate;
		}
		var result = {
			isUpdate: isUpdate,
			text: text
		}
		return result;
	}
	/**
	 * 
	 * @param {*} params 
	 */
	callDialog(params) {
		this.kLoadingService.show();
		let providerAdmId;
		this.getUsers().success((data) => {
			if(data.length > 1){
				_.remove(data, (item) => {
					var flag = false;
					if (item.userCompleteName.includes('ADMINISTRADOR')) {
						providerAdmId = item.userId;
						flag = true;
					}
					return flag;
				});
				params.users = data;
				params.providerAdmId = providerAdmId;
				this.kLoadingService.hide();
				this.openModal(null, DeviceRegisterTemplate.name, 'popUpDeviceController', 'popUpDevice', params);
			}else{
				this.kMessageService.showInfo('No existen usuarios asignados para el proveedor ' + this.homeModel._providerCode + '.');
				this.kLoadingService.hide();
			}
		}).error((e) => {
			this.kMessageService.showError('Hubo un error al buscar los usuarios');
			this.kLoadingService.hide();
			console.log('Hubo un error al buscar: ' + e);
		});
	}

	/**
	 * elimina dispositivo de la base
	 */
	deleteDevice(row){
		this.kLoadingService.show();
		let device = {
			id : row.id,
			userId : row.userId
		};
		//elimar dispositivo
		this.deviceService.deleteDevice(device)
		.success((data) => {
			this.refreshScreen(row);
			this.kMessageService.showInfo('El dispositivo se ha eliminado correctamente.');
			this.kLoadingService.hide();
		})
		.error((e) => {
			this.kMessageService.showError('Hubo un error al eliminar el dispositivo seleccionado');
			this.kLoadingService.hide();
		})
	}

	/**
	 * refresca la pantalla para visualizar cambios
	 */
	refreshScreen(row){
		let index = this.gridOptions.data.indexOf(row);
		this.gridOptions.data.splice(index, 1);
		this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
	}

	/**
	 * 
	 * @param {*} rowsSize 
	 */
	autoSizeGrid(rowsSize){
		var rowsHeigth = rowsSize*30+60;
		var centerHeight = angular.element('.kl-center').height();
		var different = centerHeight - rowsHeigth;
		if(different > 30){
			rowsHeigth = centerHeight-60;
		}else {
			rowsHeigth = centerHeight-60;
		}
		angular.element('#gridDeviceRegister').css('height', rowsHeigth+'px');
	}

}
export default DeviceFactory;
