class HomeService {

	constructor(kHttpService) {
		'ngInject';
		this._kHttpService = kHttpService;
	}

    getUsers(params) {
		return this._kHttpService.inventoriesWs.get(`report/users`,params);
	}

	/**
     * obtener datos de sesion
     */
    getSession(params){
        return this._kHttpService.datosCorporativo.jsonp('menu/session.json', params);
    }
}
export default HomeService;