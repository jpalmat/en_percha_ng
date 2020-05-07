class ProviderService {

    constructor(kHttpService){
		this.kHttpService = kHttpService;
    }

    /**
     * buscar proveedores
     */
    findProviders(providerModel){
        return this.kHttpService.inventoriesWs.post(`provider/searchProvider`, providerModel);
    }

    /**
     * obtener token corporativo
     */
    getCorpToken(params) {
        return this.kHttpService.datosCorporativo.post('menu/obtenerTokenPorUsuario.json', params);
    }

    /**
     * login de proveedores
     */
    loginProvider(params){
        return this.kHttpService.inventoriesWs.post(`account/loginToken`, params);
    }

}

export default ProviderService;