let _ = window._;
class PopUpDeviceController {

	constructor(lodash, homeModel, kLoadingService, kMessageService, $scope,
		 deviceFactory, $uibModalInstance, params) {
		'ngInject';
		this.lodash = lodash;
		this.homeModel = homeModel;
		this.deviceFactory = deviceFactory;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
		this.$uibModalInstance = $uibModalInstance;
		this.isDisabled = true;
		this.selectUser = null;
		this.init(params);
	}

	/**
	 * valida la modificacion de la informacion del dispositivo
	 */
	changeData() {
		if(!_.isNull(this.selectUser)){
			this.deviceRegister.userId = this.selectUser.userId;
			this.deviceRegister.userFullName = this.selectUser.userCompleteName;
		}
		this.deviceRegister.state = this.selectState.value;

		if(this.action == 'edit') {
			if (!_.isEqual(this.originalEntity, this.deviceRegister)) {
				this.isDisabled = false;
			} else {
				this.isDisabled = true;
			}
		}else{
			this.isDisabled = !this.isAllFieldsNotNulls(this.deviceRegister);
		}
	}

	isAllFieldsNotNulls(jsonObj) {
		let fields = Object.keys(jsonObj);
		let flag = true;
		if (!_.isNull(fields)) {
			fields.forEach((field) => {
				if (!_.isBoolean(jsonObj[field]) && (_.isNull(jsonObj[field]) || jsonObj[field] == '')) {
					flag = false;
					return flag;
				}
			});
		}
		return flag;
	}

	init(params) {
		if (!_.isUndefined(params) && params != null) {
			this.selectUser;
			this.action = params.action;
			this.providerUsers = params.users;
			let providerAdmId = params.providerAdmId;
			let userAdm = providerAdmId.split('B2BPROADM');

			if (this.action == 'edit') {
				this.deviceRegister = _.clone(params.entity);
				delete this.deviceRegister.isUpdate;
				delete this.deviceRegister.timeByUpdate;
				this.deviceRegister.userUpdate = params.providerAdmId;
				this.selectState = _.find(this.deviceFactory.constStates, { 'value': this.deviceRegister.state });
				this.selectUser = _.find(this.providerUsers, { 'userId': this.deviceRegister.userId });
			} else if (this.action == 'new') {
				this.deviceRegister = this.createDefaultEntity();
				this.deviceRegister.providerCode = this.homeModel._providerCode;
				this.deviceRegister.userRegister = params.providerAdmId;
				this.selectState = this.deviceFactory.constStates[0];
			}
			this.originalEntity = _.clone(this.deviceRegister);
		}
	}

	createDefaultEntity() {
		let entity = {
			imei: null,
			model: null,
			providerCode: null,
			so: null,
			state: 'ACT',
			tradeMark: null,
			userFullName: null,
			userId: null,
			userRegister: null,
			versionSO: null
		};
		return entity;
	}
	
	/**
	 * edita la informacion del dispositivo seleccionado
	 */
	update() {
		this.kLoadingService.show();
		this.deviceRegister.state = this.selectState.value;
		this.deviceRegister.userId = this.selectUser.userId;
		this.deviceRegister.userFullName = this.selectUser.userCompleteName;
		this.deviceFactory.updateDeviceRegister(this.deviceRegister);
		this.$uibModalInstance.close();
	}

	/**
	 * agregar nuevo dispositivo
	 */
	accept() {
		// valida si existe un registro activo en pantalla del usuario seleccionado
		let result = this.lodash.find(this.deviceFactory.gridOptions.data, (dev)=>{
			return dev.state === 'ACT' && dev.userId === this.selectUser.userId;
		});
		// si no existe un dispositivo activo puede guardar
		if(this.lodash.isEmpty(result)){
			this.deviceRegister.state = this.selectState.value;
			this.deviceRegister.userId = this.selectUser.userId;
			this.deviceRegister.userFullName = this.selectUser.userCompleteName;
			if (!_.isNull(this.deviceRegister.userRegister) && !_.isNull(this.deviceRegister.tradeMark) 
				&& !_.isNull(this.deviceRegister.model) && !_.isNull(this.deviceRegister.so) 
				&& !_.isNull(this.deviceRegister.imei) && !_.isNull(this.deviceRegister.versionSO)) {
					this.deviceFactory.createDeviceRegister(this.deviceRegister);
					this.selectUser = null;
					this.selectState = this.deviceFactory.constStates[0];
					this.deviceRegister = this.createDefaultEntity();
					this.deviceRegister.providerCode = this.originalEntity.providerCode;
					this.deviceRegister.userRegister = this.originalEntity.userRegister;
					this.selectState = this.deviceFactory.constStates[0];
					this.isDisabled = true;
			}
		} else {
			this.kMessageService.showError('No se puede crear el dispositivo porque el usuario '
				+ this.selectUser.userCompleteName +' ya tiene un dispositivo activo');
		}
	};

	cancel() {
		this.$uibModalInstance.dismiss('cancel');
	};
}

export default PopUpDeviceController;