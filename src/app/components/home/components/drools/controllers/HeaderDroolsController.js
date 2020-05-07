class HeaderDroolsController {
	/*@ngInject*/
    constructor($scope, $timeout, droolsConstants, droolsFactory, validationFactory, droolsModel, kLoadingService, 
        kMessageService, lodash, kModalService) {
        
        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.droolsFactory = droolsFactory;
        this.kModalService = kModalService;
        this.MessageService = kMessageService;
        this.droolsConstants = droolsConstants; 
        this.kLoadingService = kLoadingService;
        this.validationFactory = validationFactory;
    }

	/**
     * confirma los cambios en pantalla
     */
    save(){
        this.MessageService.hide();
        //valida si existe al menos un registro en pantalla
        if(this.lodash.isEmpty(this.droolsModel.gridOptionsDrools.data) && this.droolsModel.typeAlert.id != 20){
            this.MessageService.showError(this.droolsConstants.MESSAGES.ERROR_SAVE);
        }
        // valida si no hay nuevas causas
        else if(this.lodash.isEmpty(this.droolsModel.newCausesList) && this.droolsModel.typeAlert.id == 22){
            this.MessageService.showInfo(this.droolsConstants.MESSAGES.NO_NEW_CAUSE);
        }else if(this.droolsModel.typeAlert.id == 0){
            this.kModalService.showConfirm(this, this.droolsConstants.MESSAGES.CONFIRM_SAVE, this.confirmSave, this.cancel);
        }else{
            if(this.droolsModel.stage !== undefined){
                this.droolsModel.gridOptionsDrools.data[0].typeAlert = this.droolsModel.stage.id;
            }
            //valida inconsistencias de informacion para guardar
            let respValidate = this.validationFactory.dataValidate(this.droolsModel.gridOptionsDrools.data, 
                this.droolsModel.radioToCc);
            
            if (!this.lodash.isEmpty(respValidate)) {
                for (var i = 0; i < respValidate.length; i++) {
                    this.MessageService.add(respValidate[i].descripcion);
                }
                this.MessageService.showError();
            } else {
                console.log('this.droolsModel.newCausesList',this.droolsModel.newCausesList);
                this.kModalService.showConfirm(this, this.droolsConstants.MESSAGES.CONFIRM_SAVE, this.confirmSave, this.cancel);
            }
        }
    }

    /**
     * guarda los cambios en el archivo drools
     */
    confirmSave() {
        let dataClone = null;
        if(!this.lodash.isEmpty(this.droolsModel.newCausesList)){
            angular.forEach(this.droolsModel.newCausesList, (cause) => {
                delete cause.modified;
            });
            dataClone = this.droolsModel.newCausesList;
        }else{
            //clona informacion
            dataClone = this.lodash.clone(this.droolsModel.gridOptionsDrools.data);
            
            //valida si envian un unico proveedor para registro en drools 
            if(this.lodash.isEmpty(dataClone) && this.droolsModel.typeAlert.id == 20){
                let provider = {};
                provider.typeAlert = this.droolsModel.typeAlert.id;
                dataClone.push(provider);
            }

            angular.forEach(dataClone, (data) => {
                if(this.droolsModel.typeAlert.id != 0){
                    data.caseType = this.droolsModel.radioToCc;
                }
                if((this.droolsModel.typeAlert.id == 4 || this.droolsModel.typeAlert.id == 12) 
                    && this.droolsModel.stage !== undefined){
                    data.typeAlert = this.droolsModel.stage.id;
                }
                delete data.modified;
                delete data.seleccionar;
            });
            console.log('dataClone',dataClone);
        }
        //guarda los registros
        this.droolsFactory.saveDrools(this.droolsModel.typeAlert.id, dataClone)
            .success(() => {
                this.MessageService.add(this.droolsConstants.MESSAGES.INFO_SAVE);
                this.MessageService.showSuccess();
                this.droolsFactory.inicializeValues(this.droolsModel);
                this.acceptRestore();
            }).info(() => {
                this.MessageService.showInfo(this.droolsConstants.MESSAGES.ERROR_SAVE_CAUSE);
            }).error((mes) => {
                this.MessageService.showError(this.droolsConstants.MESSAGES.ERROR_SAVE_CAUSE);
            });
    }

    /**
     * restablece los valores originales del tipo de alerta
     */
    restore(){
        this.MessageService.hide();
        this.kModalService.showConfirm(this, this.droolsConstants.MESSAGES.CONFIRM_RESTORE, this.acceptRestore, this.cancel);
    }

    /**
     * realiza la busqueada drools
     */
    acceptRestore(){
        this.droolsFactory.validarTipoAlerta(this.droolsModel, this.droolsConstants);
    }

    /**
     * agrega una nueva linea comercial
     */
    acceptComLine(){
        this.droolsFactory.accept();
    }

    /**
     * cancelar
     */
    cancelComLine(){
        this.droolsFactory.cancel();
    }

    /**
     * valida la visualizacion de los botones del header
     */
    validateHeaderButton(){
        return this.droolsFactory.validateHeaderButton();
    }

    /*
    * Cerrar el popup
    */
    cancel() {}
}

export default HeaderDroolsController;
