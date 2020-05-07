
class ContentDeviceController {

	constructor(kModalService, deviceFactory, layoutFactory, kLoadingService, kMessageService, homeModel,deviceModel, lodash) {
		'ngInject';
		
		layoutFactory.renderLeft(false);
		this.lodash = lodash;
		this.homeModel = homeModel;
		this.deviceModel = deviceModel;
		this.deviceFactory = deviceFactory;
		this.kModalService = kModalService;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
		this.actualEntity = null;
		this.onGridInit();
	}

	onGridInit() {
		this.kLoadingService.show();
		this.deviceFactory.cleanScreen();
		this.deviceFactory.search(true, this.homeModel._userId);
	}

	editDeviceRegister(entity) {
		this.kMessageService.hide();
		// this.isEdit(entity.dateBeginUserRegister, entity.dateUpdate)
		if (entity.isUpdate || this.homeModel._isFromMax) {
			var params = {
				action: 'edit',
				entity: entity
			}
			this.deviceFactory.callDialog(params);
		} else {
			this.kModalService.showWarning(this, 'Solo podrá actualizar este registro cuando se cumpla el plazo de los ' + this.deviceFactory.dataConstants.DAYS_BY_UPDATE + ' ' + this.deviceFactory.dataConstants.UNIT_TIME_BY_UPDATE, null);
		}
	}

	/**
	 * eliminar dispositivo registrado
	 */
	deleteDeviceRegister(entity){
		this.kMessageService.hide();
		this.row = entity;
		this.kModalService.showConfirm(this, '¿Est\u00E1 seguro que desea eliminar el dispositivo seleccionado?', 
			this.deleteDevice, () => {}, this.kModalService.MODAL_SIZE.SMALL);
	}

	/**
	 * confirmar la eliminacion del dispositivo registrado
	 */
	deleteDevice(){
		this.deviceFactory.deleteDevice(this.row);
	}

	/**
	 * valida cambio de estado del dispositivo
	 */
	changeState(entity) {
		this.kLoadingService.show();
		let device = null;
		if(entity.state == 'INA'){
			this.deviceFactory.findActiveDevice(entity)
				.success((data) => {
					console.log('data',data);
					if(this.lodash.isEmpty(data) || this.lodash.isNull(data)){
						device = null;
					}else{
						device = data;
					}
					this.validateChangeState(entity,device);
				})
				.error((e) => {
					this.kLoadingService.hide();
					this.kMessageService.showError('Hubo un error al actualizar el dispositivo');
				});				
		}else{
			this.validateChangeState(entity,device);
		}
	}

	/**
	* Valida cambio de estado del dispositivo
	*/
	validateChangeState(entity, device){
		this.actualEntity = entity;
		if ((entity.isUpdate || entity.state == 'INA')  || this.homeModel._isFromMax) {
			if(this.homeModel._isFromMax){
				if(device == null){
					this.updateEntity();
				}else{
					this.kMessageService.showError('No se puede activar el dispositivo porque el usuario '
						+ device.userFullName +' ya tiene un dispositivo activo');
					this.kLoadingService.hide();
				}
			}else{
				if(device == null){
					this.kModalService.showConfirm(this, '¿Est\u00E1 seguro que desea cambiar el estado? El estado solo podr\u00E1 ser cambiado en '
						 + this.deviceFactory.dataConstants.DAYS_BY_UPDATE + ' ' 
						 + this.deviceFactory.dataConstants.UNIT_TIME_BY_UPDATE, this.updateEntity, this.cancel);
					this.kLoadingService.hide();
				}else{
					this.kModalService.showWarning(this, 'No se puede activar el dispositivo porque el usuario '
						 + device.userFullName +' ya tiene un dispositivo activo ', this.cancel);
					this.kLoadingService.hide();
				}
			}
		} else {
			this.kModalService.showWarning(this, 'Solo podr\u00E1 actualizar este registro cuando se cumpla el plazo de los ' 
				+ this.deviceFactory.dataConstants.DAYS_BY_UPDATE + ' ' + this.deviceFactory.dataConstants.UNIT_TIME_BY_UPDATE,
				 this.cancel);
			this.kLoadingService.hide();
		}
	}

	/**
	 * actualiza estado del dispositivo
	 */
	updateEntity() {
		this.actualEntity.state = this.actualEntity.state == 'INA' ? 'ACT' : 'INA';
		this.deviceFactory.updateStateDevice(this.actualEntity);
	}

	existActiveDevice(entity) {
		let result = this.lodash.find(this.deviceModel._device,(dev)=>{
			return dev.state === 'ACT' && dev.userFullName === entity.userFullName;
		});
		return result;
	}

	cancel(){
		console.log('notificer');
	}	

}

export default ContentDeviceController;
