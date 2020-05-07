
class ModalTimeAlertDroolsController{
    /*@ngInject*/
    constructor($scope, $timeout, lodash, droolsConstants, droolsFactory, droolsModel, kLoadingService, kMessageService,
        $uibModalInstance, kModalService) {
        
        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.droolsFactory = droolsFactory;
        this.kModalService = kModalService;
        this.kMessageService = kMessageService;
        this.droolsConstants = droolsConstants;
        this.kLoadingService = kLoadingService;
        this.$uibModalInstance = $uibModalInstance;
        //lista de opciones de tiempo
        this.timesName = { 'Hora(s)' : '300', 'Día(s)' : '301', 'Mes(es)' : '302' };
    }

    /**
     * se guarda el tiempo maximo de solucion de una determinada alerta
     */
    accept(){
        //se obtiene el registro original para modificarlo
        var index = this.droolsModel.gridOptionsDrools.data.indexOf(this.droolsModel.indexGrid.entity);
        //valida si hubo cambios o no en pantalla
        if(!this.lodash.isEqual(this.droolsFactory.typeAlertSelected.setAssignedTime, this.droolsModel.indexGrid.entity.setAssignedTime) ||
            !this.lodash.isEqual(this.droolsFactory.typeAlertSelected.setAssignedUnitTime, 
                this.droolsModel.indexGrid.entity.setAssignedUnitTime)) {
                    this.droolsModel.gridOptionsDrools.data[index].setAssignedTime = 
                        this.droolsFactory.typeAlertSelected.setAssignedTime;
                    this.droolsModel.gridOptionsDrools.data[index].setAssignedUnitTime = 
                        this.droolsFactory.typeAlertSelected.setAssignedUnitTime;
                    this.droolsModel.gridOptionsDrools.data[index].modified = true;
        }
        //cerrar modal
        this.cancel();
   }

    /**
     * cancelar
     */
    cancel() {
		this.$uibModalInstance.dismiss('cancel');
	}

}

export default ModalTimeAlertDroolsController;