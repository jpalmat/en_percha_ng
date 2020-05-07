class VisitsService {

	constructor(kHttpService, kLoadingService) {
		'ngInject';
		this.kHttpService = kHttpService;
		this.kLoadingService=kLoadingService;
	}

	findVisits(params) {
		return this.kHttpService.inventoriesWs.post(`visit/visitReport`, params);
	}

	getLocal(typeLocals) {
		return this.kHttpService.inventoriesWs.get(`report/locals`, typeLocals);
	}

}

export default VisitsService;
