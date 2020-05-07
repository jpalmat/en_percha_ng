/**
 * Created by jpalma on 17/04/2017.
 */

class DroolsService {
    constructor($http, kHttpService, droolsModel) {
        this.$http = $http;
        this.droolsModel = droolsModel;
        this.kHttpService = kHttpService;
    }

    /**
     * buscar opciones tipos de alerta
     */
    getDroolsData(typeAlert){
        if(typeAlert == 0){
            return this.kHttpService.inventoriesWs.post(`drools/dataTime`, typeAlert);
        }if(typeAlert == 22){
            return this.kHttpService.inventoriesWs.get(`drools/getCauses`);
        }else{
            return this.kHttpService.inventoriesWs.post(`drools/data`, {typeAlert: typeAlert});
        }
    }

    /**
     * metodo para guardar nuevos registros
     */
    saveDrools(typeAlert, modelDrools){
        if(typeAlert == 0){
            return this.kHttpService.inventoriesWs.post(`drools/saveTime`, modelDrools);
        }else if(modelDrools[0].typeAlert == 30 || modelDrools[0].typeAlert == 40){
            return this.kHttpService.inventoriesWs.post(`/drools/saveSpecial`, modelDrools);
        }if(typeAlert == 22){
            return this.kHttpService.inventoriesWs.post(`drools/saveCauses`,modelDrools);
        }else {
            return this.kHttpService.inventoriesWs.post(`drools/save`, modelDrools);
        }
    }

    /**
     * buscar lineas comerciales
     */
    getComercialLines(){
        return this.kHttpService.inventoriesWs.post(`droolsWS/comercialLinesData`);
    }

    /**
     * buscar proveedores
     */
    findProviders(filterProviderModel){
        return this.kHttpService.inventoriesWs.post(`droolsWS/providersData`, filterProviderModel);
    }

    /**
     * buscar usuarios
     */
    findUsers(url, parameters){
        return this.$http.post(url, parameters);
    }
}

export default DroolsService;