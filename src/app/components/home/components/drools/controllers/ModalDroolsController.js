/**
 * Created by jpalma on 20/04/2017.
 */

class ModalDroolsController{
    /*@ngInject*/
    constructor($scope, lodash, $timeout, droolsConstants, droolsFactory, droolsModel, kLoadingService, 
        kMessageService, $uibModalInstance) {

        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.droolsFactory = droolsFactory;
        this.droolsConstants = droolsConstants;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;
        this.$uibModalInstance = $uibModalInstance;
        
        this.initializeValues();
    }

    /**
     * inicializa los valores a mostrar para editar el tipo de alerta
     */
    initializeValues(){

        this.droolsModel.groupSelectedTo = '';
        this.droolsModel.groupSelectedCc = '';
        this.droolsModel.fieldSelected = '';
        this.showListTo = true;
        this.showListCc = true;
        this.showField = false;
        this.groupsName = this.droolsConstants.GROUPS;
        this.fieldsName = this.droolsConstants.FIELDS;

       if (!this.lodash.isUndefined(this.droolsModel.indexGrid)) {
            if(this.droolsModel.typeAlert.id === 21){
            this.showListTo = false;
            this.showListCc = false;
            this.showField = true;
            } else if (this.lodash.isEqual(this.droolsModel.indexGrid.entity.field, this.droolsConstants.FIELDS[0].code)) {
                this.droolsModel.groupSelectedTo = this.droolsModel.indexGrid.entity.group;
                this.showListCc = false;
            }else {
                this.droolsModel.groupSelectedCc = this.droolsModel.indexGrid.entity.group;
                this.showListTo = false;
            }
        }
    }

    /**
     * Valida cambio de estilos para modificar tipo de alerta
     */
    changeView(){
        if(this.droolsModel.titleModal === 'Modificar'){
            return true;
        }
        return false;
    }

    /**
     * aceptar
     */
    accept() {
        //valida si se modifica o agrega un nuevo grupo
        if(this.droolsModel.titleModal === 'Modificar'){
            this.editarGrupo();
        }else{
            this.agregarGrupo();
        }
	}

    /**
     * Edita un registro existente
     */
    editarGrupo(){
         if(this.droolsModel.typeAlert.id === 21){
            this.validarCampoModificado(this.droolsModel.fieldSelected.code);
        }else if(this.droolsModel.groupSelectedTo != '' && !this.lodash.isNull(this.droolsModel.groupSelectedTo)){
            this.validarGrupoModificado(this.droolsModel.groupSelectedTo.code);
        }else if(this.droolsModel.groupSelectedCc != '' && !this.lodash.isNull(this.droolsModel.groupSelectedCc)){
            this.validarGrupoModificado(this.droolsModel.groupSelectedCc.code);
        }
        
    }

    /**
     * valida el registro a editar
     */
    validarCampoModificado(field){
        //busca el registro respectivo en pantalla para modificarlo
        let row = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (row) => {
            return this.droolsModel.indexGrid.entity.userId === row.userId;
        });
        row.field = field;
        row.modified = true;
        //cerrar modal
        this.$uibModalInstance.close();
        this.kMessageService.hide();
    }

    /**
     * valida nuevo destinatario en la lista
     */
    validarGrupoModificado(group){
        //valida si existe repetido en pantalla
        let row = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (row) => {
            return row.group === group && row.field === this.droolsModel.indexGrid.entity.field;
        });
        
        if(row == null){
            //obtener el registro original de la lista
            let row = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (row) => {
                return row.group === this.droolsModel.indexGrid.entity.group && row.field === this.droolsModel.indexGrid.entity.field;
            });
            //se modifica el nuevo grupo seleccionado
            row.group = group;
            row.modified = true;

            //cerrar modal
            this.$uibModalInstance.close();
            this.kMessageService.hide();
        }else{
            this.kMessageService.showError(this.droolsConstants.MESSAGES.GROUP_EXIST);
        }
    }

    /**
     * Agrega un nuevo registro
     */
    agregarGrupo(){
        let newData = {};
        //si es de tipo To
        if(this.droolsModel.groupSelectedTo != '' && !this.lodash.isNull(this.droolsModel.groupSelectedTo)){
            newData.typeAlert = this.droolsModel.typeAlert.id;
            newData.group = this.droolsModel.groupSelectedTo.code;
            newData.field =  this.droolsConstants.FIELDS[0].code;
            newData.modified = true;
            this.validarGrupoNuevo(newData);
        }
        //si es de tipo Cc
        if(this.droolsModel.groupSelectedCc != '' && !this.lodash.isNull(this.droolsModel.groupSelectedCc)){
            newData = {};
            newData.typeAlert = this.droolsModel.typeAlert.id;
            newData.group = this.droolsModel.groupSelectedCc.code;
            newData.field =  this.droolsConstants.FIELDS[1].code;
            newData.modified = true;
            this.validarGrupoNuevo(newData);
        }
        //si no existen ningun destinatario seleccionado 
        if(this.lodash.isEmpty(newData)){
            this.kMessageService.showError(this.droolsConstants.MESSAGES.GROUP_EMPTY);
        }
    }

    /**
     * Valida registros repetidos en pantalla
     */
    validarGrupoNuevo(newData){
        let row = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (row) => {
            return row.group === newData.group && row.field === newData.field;
        });
        //valida si ya se encuentra registrado el grupo nuevo
        if(row == null){
            this.droolsModel.gridOptionsDrools.data.push(newData);
            //cerrar modal
            this.$uibModalInstance.close();
            this.kMessageService.hide();
        }else{
            this.kMessageService.showError(this.droolsConstants.MESSAGES.GROUP_EXIST);
        }
    }

    addDataToGrid(data, newData){
        this.$timeout(() => {
            data.push(newData);
        }, 1);
    }

    cancel() {
		this.$uibModalInstance.dismiss('cancel');
	}
}
export default ModalDroolsController;