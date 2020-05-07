
class LeftDroolsController {

    /*@ngInject*/
    constructor($scope, $timeout, lodash, droolsFactory, droolsModel, kLoadingService, kMessageService, 
        layoutFactory, droolsConstants, kModalService) {

        layoutFactory.renderLeft(true);

        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.droolsFactory = droolsFactory;
        this.kModalService = kModalService;
        this.MessageService = kMessageService;
        this.kLoadingService = kLoadingService;
        this.droolsConstants = droolsConstants;

        this.stagePrevious = this.droolsFactory.stagePrevious; //guarda el valor original del escenario
        this.typeAlertPrevious = this.droolsFactory.typeAlertPrevious; //guarda el valor original del tipo de alerta

        this.typesAlert = this.validateAlertsType();
        this.stages = this.droolsConstants.STAGES;

    }

    /**
     * Valida las opciones a visualizar en las reglas de negocio
     */
    validateAlertsType(){
        let options = [];
         angular.forEach(this.droolsConstants.TYPES_ALERT, (alert) => {
             if(alert.exception == null){
                 options.push(alert);
             }
         });
         return options;
    }

    /**
     * define las columnas del ui-grid y consulta la informacion de los archivos drools 
     */
    cargarColumnas(){
        //valida que escenario se visualiza en pantalla
        if(this.droolsModel.typeAlert != null){
            if(this.droolsModel.typeAlert.id == 4){
                this.stages = this.droolsConstants.STAGES;
            }else if(this.droolsModel.typeAlert.id == 12){
                this.stages = this.droolsConstants.STAGES_TWELVE;
            }
        }
        this.MessageService.hide();
        //busca si un registro se ha modificado
        let changesGrid = this.getChangeGrid();
        //valida si existen registros modificados
        if(changesGrid){
            this.kModalService.showConfirm(this, this.droolsConstants.MESSAGES.CONFIRM_CHANGE,
                this.validarTipoAlerta, this.cancel);
        }else{
            this.validarTipoAlerta();
        }
    }

    /**
     * valida cambios en pantalla
     */
    getChangeGrid(){
        //busca si un registro se ha modificado
        let changesGrid = this.lodash.filter(this.droolsModel.gridOptionsDrools.data, (row) => {
            return row.modified === true;
        });
        //valida si hay al menos un cambio o no existen ningun registro en pantalla o existen registros eliminados
        //o se cambia el tipo de caso
        if(changesGrid.length > 0 || !this.droolsFactory.existInfo || this.droolsModel.groupsInactive.length > 0 || 
            this.droolsFactory.newCaseType === true || this.droolsModel.newCausesList.length > 0){
                return true;
        }
        return false;
    }

    /**
     * Valida la opcion seleccionada de tipo de alerta
     */
    validarTipoAlerta(){
        this.droolsFactory.validarTipoAlerta(this.droolsModel, this.droolsConstants);
    }

    /*
    * Cerrar el popup
    */
    cancel() {
        //se visualiza la opcion de tipo de alerta anterior
        this.droolsModel.typeAlert = this.droolsFactory.typeAlertPrevious;
        //se visualiza el escenario anterior
        if(!this.lodash.isUndefined(this.droolsModel.stage)){
            this.droolsModel.stage = this.droolsFactory.stagePrevious;
        }
    }

    /**
     * retorna variable visualizar lista de escenarios
     */
    getShowSelect(){
        return this.droolsFactory.getShowSelect();
    }
   
}

export default LeftDroolsController;