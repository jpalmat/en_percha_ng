//import {ResponseTypeEnum} from 'kCommon/lib';
class HeaderDeviceController {
	constructor($state, deviceFactory, homeModel) {
		'ngInject';
		this.$state = $state
		this.deviceFactory = deviceFactory;
		this.homeModel = homeModel;
	}

	newDeviceRegister(entity) {
		this.deviceFactory.kMessageService.hide();
		let params = {
			action: 'new'
		}
		this.deviceFactory.callDialog(params);
	}

	/**
	 * retorna a la pantalla de proveedores
	 */
	return(){
		this.deviceFactory.kMessageService.hide();
		this.$state.go('ini.home.provider');
	}

	/**
	 * valida la visualizacion del boton de registrar
	 */
	validateRegistry(){
		let showButton = false;
		if(this.homeModel._isFromMax){
			showButton = true;
		}
		return showButton;
	}

	// goTo(){
	// 	this.$state.go('ini.home.reports');
	// }	

}

export default HeaderDeviceController;
