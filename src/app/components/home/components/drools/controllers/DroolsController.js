/**
 * Created by jpalma on 17/04/2017.
 */

class DroolsController {

    /*@ngInject*/
    constructor($scope, $timeout, lodash, droolsFactory, droolsModel, kLoadingService, kMessageService, 
        layoutFactory, droolsConstants, kModalService) {

        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.droolsFactory = droolsFactory;
        this.kModalService = kModalService;
        this.kMessageService = kMessageService;
        this.kLoadingService = kLoadingService;
        this.droolsConstants = droolsConstants;
        
        this.buildGrid();

    }
    
    /**
     * inicializa los valores cuando se va a editar un registro
     */
    initializeValues(){
        //inicializa valores
        this.droolsFactory.cleanValues();
        //construye la informacion de destinatarios
        if(!this.lodash.isUndefined(this.droolsModel.indexGrid)){
            //setear codigo de linea comercial en pantalla
            this.droolsFactory.optionSelected = this.droolsModel.indexGrid.entity.lineComercialId;
            this.droolsFactory.dataComercialLine.newComercialLine = this.droolsFactory.optionSelected;
            //valida si tiene grupo local
            this.droolsFactory.dataComercialLine.cbLocalTo = this.droolsModel.indexGrid.entity.userTo.includes('LOCAL') ? true : false;
            this.droolsFactory.dataComercialLine.cbLocalCc = this.droolsModel.indexGrid.entity.userCc.includes('LOCAL') ? true : false;
            //inicializa grids de usuarios
            this.droolsModel.gridUsersToDrools.data = [];
            this.droolsModel.gridUsersCcDrools.data = [];

            //Para (To)
            let userToCol = this.droolsModel.indexGrid.entity.userTo.split(',');  
            //valida usuarios sin grupo local y transforma a objetos para armar en el grid
            this.droolsModel.gridUsersToDrools.data = this.validateUserList(userToCol);      
            //valida si existe al menos un usuario
            if(!this.lodash.isEmpty(this.droolsModel.gridUsersToDrools.data)){
                //chequea la casilla de usuarios
                this.droolsFactory.dataComercialLine.cbUserTo = true;
                //construye el grid
                this.$timeout(() => {
                    this.droolsFactory.buildGridUsersTo(this.droolsModel.gridUsersToDrools);
                }, 10);   
            }

            //Con copia (Cc)
            let userCcCol = this.droolsModel.indexGrid.entity.userCc.split(',');
            //valida usuarios sin grupo local y transforma a objetos para armar en el grid
            this.droolsModel.gridUsersCcDrools.data = this.validateUserList(userCcCol);              
            //valida si existe al menos un usuario
            if(!this.lodash.isEmpty(this.droolsModel.gridUsersCcDrools.data)){
                //chequea la casilla de usuarios
                this.droolsFactory.dataComercialLine.cbUserCc = true;
                //construye el grid
                this.$timeout(() => {
                    this.droolsFactory.buildGridUsersCc(this.droolsModel.gridUsersCcDrools);
                }, 10);   
            }
        }
    }

    /**
     * Arma lista de usuarios para visualizar en los grids, excluyendo grupo local
     */
    validateUserList(usersCol){
        let result = [];
        angular.forEach(usersCol, (user) => {
            let userTemp = {};
            if(!this.lodash.isEqual(user.trim(), this.droolsConstants.GROUPS[0].code)){
                userTemp.userId = user.split('-')[0];
                userTemp.name = user.split('-')[1];
                userTemp.userName = user.split('-')[2];
                result.push(userTemp);
            }
        });
        return result;
    }

    /**
     * Se deshabilita las opciones de eliminar y agregar linea comercial
     */
    disabled(){
        if(this.droolsModel.titleModal == 'Modificar'){
            return true;
        }
        return false;
    }

    /**
     * buscar lineas comerciales
     */
    findComercialLine(){
        this.droolsFactory.findComercialLine();
    }

    /**
     * buscar usuarios
     */
    callModalUsers(codeField){
        this.kMessageService.hide();
        //tipo de destinatario
        this.droolsFactory.addressee.code = codeField;
        this.droolsFactory.addressee.name = this.droolsConstants.FIELDS[codeField].name;
        this.droolsFactory.callModalUsers();
    }

    /**
     * Valida si no selecciona usuario, borra la informacion del campo de usuarios
     * @param codeField Destinatario (0=To, 1=Cc)
     */
    validateCheckUser(codeField){
        if(codeField == 0){
            //inicializa la informacion del grid (To)
            this.droolsModel.gridUsersToDrools.data = [];
            //valida usuario To
            if(this.droolsFactory.dataComercialLine.cbUserTo){
                this.droolsFactory.buildGridUsersTo(this.droolsModel.gridUsersToDrools);
            }
        }else{
            //inicializa la informacion del grid (Cc)
            this.droolsModel.gridUsersCcDrools.data = [];
            //valida usuarios Cc
            if(this.droolsFactory.dataComercialLine.cbUserCc){
                this.droolsFactory.buildGridUsersCc(this.droolsModel.gridUsersCcDrools);
            }
        }
    }

    /**
     * cancelar
     */
    cancel() {		
        //cambia de pantalla
        this.droolsFactory.hideGrid = false;
        this.kMessageService.hide();
	}


    /****************************************** */

    /**
     * construye el ui-grid
     */
    buildGrid(){
        this.droolsFactory.buildGridDrools(this.droolsModel.gridOptionsDrools);
    }

    /**
     * agregar nuevo resgistro
     */
    addInformation(){
        this.kMessageService.hide();
        this.droolsModel.indexGrid = undefined;
        this.droolsModel.titleModal = 'Agregar';
        if(this.droolsModel.stage !== undefined  
            && (this.droolsModel.stage.id == 30 || this.droolsModel.stage.id == 40)){
            this.droolsFactory.hideGrid = true;
            this.droolsFactory.cleanValues();
        }else if(this.droolsModel.typeAlert.id == 20){
            this.droolsFactory.callModalProvider();
        }else if(this.droolsModel.typeAlert.id == 21){
            this.droolsFactory.callModalUsers();
        }else if(this.droolsModel.typeAlert.id == 22){
            this.droolsFactory.callModalCauses();
        }else{
            this.droolsFactory.callModal();
        }
    }


    /**
     * abrir modal de tiempo de alerta
     * busca el tiempo maximo de solucion de un determinado tipo de alerta
     */
    editTimeAlert(row){
        this.kMessageService.hide();
        this.droolsModel.indexGrid = row;
        //valida datos del tiempo de alerta seleccionado
        this.droolsFactory.typeAlertSelected.id = row.entity.typeAlert;
        this.droolsFactory.typeAlertSelected.name = this.showNameTypeAlert(row.entity);
        this.droolsFactory.typeAlertSelected.setAssignedTime = row.entity.setAssignedTime;
        this.droolsFactory.typeAlertSelected.setAssignedUnitTime = row.entity.setAssignedUnitTime;
        this.droolsFactory.openModalTimeAlert();
    }

    /**
     * edita la fila seleccionada del grid
     */
    editInformation(row){
        this.kMessageService.hide();
        this.droolsModel.titleModal = 'Modificar';
        this.droolsModel.indexGrid = row;
        if(this.droolsModel.stage !== undefined 
            && (this.droolsModel.stage.id == 30 || this.droolsModel.stage.id == 40)){
            this.droolsFactory.hideGrid = true;
            this.initializeValues();
        } else {
            this.droolsFactory.callModal();
        }
    }

    /**
     * Muestra la descripcion completa del destinatario
     */
    showGroup(row){
        let nameGroup = null;
        angular.forEach(this.droolsConstants.GROUPS, (group) => {
            if(this.lodash.isEqual(row.group, group.code)){
                nameGroup = group.name;
            }
        });
        return nameGroup;
    }

    /**
     * Muestra la descripcion completa del campo
     */
    showCamp(row){
        let nameCamp = null;
        angular.forEach(this.droolsConstants.FIELDS, (field) => {
            if(this.lodash.isEqual(row.field, field.code)){
                nameCamp = field.name;
            }
        });
        return nameCamp;
    }

    /**
     * Muestra la descripcion completa de la gestion y lectura
     */
    showUsers(users){
        let result = [];
        let managementList = users.split(',');        

        angular.forEach(managementList, (man) => {
            if(this.lodash.isEqual(man.trim(), this.droolsConstants.GROUPS[0].code)){
                result.push(this.droolsConstants.GROUPS[0].name);
            }else{
                result.push(man.split('-')[1]);
            }
        });
        //elimina caracteres no visuales
        result = result.toString().replace('[', '');
        return result;
    }

    /**
     * Muestra la descripcion del tipo de alerta
     */
    showNameTypeAlert(entity){
        let result = [];
        angular.forEach(this.droolsConstants.TYPES_ALERT, (alert) => {
            if(this.lodash.isEqual(entity.typeAlert, alert.id.toString())){
                if(this.lodash.isEqual(entity.typeAlert, '4')){
                    angular.forEach(this.droolsConstants.STAGES, (row) => {
                        if(this.lodash.isEqual(entity.stage, row.id.toString())){
                            result.push(alert.name + ' - ' + row.fullName);
                        }
                    });
                } else if(this.lodash.isEqual(entity.typeAlert, '12')){
                    angular.forEach(this.droolsConstants.STAGES_TWELVE, (row) => {
                        if(this.lodash.isEqual(entity.stage, row.id.toString())){
                            result.push(alert.name + ' - ' + row.fullName);
                        }
                    });
                } else{
                    result.push(alert.name);
                }
            }
        });
        //elimina caracteres no visuales
        result = result.toString().replace('[', '');
        return result;
    }

    /**
     * Muestra el tiempo de la alerta
     */
    showTimeAlert(entity){
        let result = [];
        angular.forEach(this.droolsConstants.TIME_ALERT, (time) => {
            if(this.lodash.isEqual(entity.setAssignedUnitTime, time.id.toString())){
                result.push(entity.setAssignedTime + ' ' + time.name);
            }
        });
        //elimina caracteres no visuales
        result = result.toString().replace('[', '');
        return result;
    }

    /**
     * elimina la fila seleccionada del grid
     */
    deleteGroup(row){
        this.kMessageService.hide();
        //almacena los registros originales eliminados
        if(row.entity.modified == null){
            this.droolsModel.groupsInactive.push(row);
        }
        var index = this.droolsModel.gridOptionsDrools.data.indexOf(row.entity);
        this.droolsModel.gridOptionsDrools.data.splice(index, 1);
        if(this.droolsModel.gridOptionsDrools.data.length == 0){
            this.droolsFactory.existInfo = false;
        }
    }

    /**
     * elimina la causa de la fila seleccionada 
     */
    deleteCause(row){
        this.kMessageService.hide();
        //valida la causa que no se puede eliminar (Otro)
        if(row.entity.causeId == 1){
            this.kMessageService.showInfo(this.droolsConstants.MESSAGES.CAUSE_DEFECT);
        } else {
            row.entity.modified = true;
            row.entity.causeState = false;
            this.droolsModel.newCausesList.push(row.entity);
            var index = this.droolsModel.gridOptionsDrools.data.indexOf(row.entity);
            this.droolsModel.gridOptionsDrools.data.splice(index, 1);
        }
    }

    /**
     * elimina usuarios (To)
     */
    deleteUserTo(row){
        this.kMessageService.hide();
        var index = this.droolsModel.gridUsersToDrools.data.indexOf(row.entity);
        this.droolsModel.gridUsersToDrools.data.splice(index, 1);
    }

    /**
     * elimina usuarios (Cc)
     */
    deleteUserCc(row){
        this.kMessageService.hide();
        var index = this.droolsModel.gridUsersCcDrools.data.indexOf(row.entity);
        this.droolsModel.gridUsersCcDrools.data.splice(index, 1);
    }

    /**
     * valida si se modifica el tipo de caso (NORMAL, READ)
     */
    changeCaseType(caseType){        
        if(!this.lodash.isEqual(this.droolsModel.gridOptionsDrools.data[0].caseType, caseType)){
            this.droolsFactory.newCaseType = true;
        }else{
            this.droolsFactory.newCaseType = false;
        }
    }

    /*********** return *********/

    /**
     * obtiene la linea comercial seleccionada
     */
    getOptionSelected(){
        if(this.droolsFactory.optionSelected != null){
            this.droolsFactory.dataComercialLine.newComercialLine = this.droolsFactory.optionSelected;
        }
        return this.droolsFactory.getOptionSelected();
    }

    /**
     * valida la visualizacion de los tipos de caso
     */
    validateCaseType(){
        return this.droolsFactory.showRadio;
    }

    /**
     * valida la visualizacion del boton Agregar
     */
    validateAddButton(){
        return this.droolsFactory.validateAddButton();
    }

    /**
     * valida la visualizacion del grid para agregar una nueva linea comercial
     */
    validateGrid(){
        return this.droolsFactory.validateGrid();
    }

}

export default DroolsController;