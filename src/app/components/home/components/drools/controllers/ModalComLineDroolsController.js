/**
 * Created by gnolivos on 15/05/2017.
 */

class ModalComLineDroolsController{
    /*@ngInject*/
    constructor($scope, $timeout, lodash, kMessageService, droolsFactory, comercialLineFactory, $uibModalInstance) {
        
        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsFactory = droolsFactory;
        this.kMessageService = kMessageService;
        this.$uibModalInstance = $uibModalInstance;
        this.comercialLineFactory = comercialLineFactory;
    }

    /**
     * guarda la informacion de la linea comercial seleccionada
     */
    selected(row){
        //se une el codigo y nombre de la linea comercial
        this.droolsFactory.optionSelected = row.entity.codLinCom + '-' + row.entity.nombre;
        this.kMessageService.hide();
        this.cancel();
    }

    /**
     * cancelar
     */
    cancel() {
		this.$uibModalInstance.dismiss('cancel');
	}

    getGridOptions(){
        return this.comercialLineFactory.getGridOptions();
    }
}
export default ModalComLineDroolsController;