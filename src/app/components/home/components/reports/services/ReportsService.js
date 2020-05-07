class ReportsService {

	constructor(kHttpService,kLoadingService) {
		'ngInject';
		this._kHttpService = kHttpService;
		this._baseUrl = 'cliente/';
		this.kLoadingService=kLoadingService;
	}

	generarReporte(params) {
		return this._kHttpService.inventoriesWs.post(`report/data`, params);
	}

	getLocal(typeLocals) {
		return this._kHttpService.inventoriesWs.get(`report/locals`, typeLocals);
	}

	getUsers(params) {
		return this._kHttpService.inventoriesWs.get(`report/users`,params);
	}

	getDetailAlerts(params) {
		return this._kHttpService.inventoriesWs.get(`report/detailAlerts`, params);
	}

}

export default ReportsService;
