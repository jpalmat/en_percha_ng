class DeviceService {

	constructor(kHttpService) {
		'ngInject';
		this._kHttpService = kHttpService;
		this._baseUrl = 'deviceRegister/';		
	}

	update(params){
		let url = this._baseUrl + 'update';
		return this._kHttpService.inventoriesWs.post(url, params);
	}

	updateState(params) {
		let url = this._baseUrl + 'updateState';
		return this._kHttpService.inventoriesWs.post(url, params);
	}

	create(params) {
		let url = this._baseUrl + 'new';
		return this._kHttpService.inventoriesWs.post(url,params);
	}

	loginByToken(params) {
		let url = this._baseUrl + 'loginByToken';
		return this._kHttpService.inventoriesWs.post(url,params);
	}
	
	findByProvider(params) {
		let url = this._baseUrl + 'findByProvider';
		return this._kHttpService.inventoriesWs.post(url,params);
	}

	deleteDevice(params){
		let url = this._baseUrl + 'deleteDevice';
		return this._kHttpService.inventoriesWs.post(url,params);
	}

	findActiveDevice(entity){
		let url = this._baseUrl + 'findActiveDevice';
		return this._kHttpService.inventoriesWs.post(url,entity);
	}
}

export default DeviceService;