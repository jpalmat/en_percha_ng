/**
 * Created by jpalma on 26/04/2017.
 */

class ModalUserDroolsController{
    /*@ngInject*/
    constructor($scope, $timeout, lodash, droolsConstants, droolsFactory, userFactory, droolsModel,
        kLoadingService, kMessageService, $uibModalInstance, kModalService, filterUsersModel) {
        
        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.userFactory = userFactory;
        this.kModalService = kModalService;
        this.droolsFactory = droolsFactory;
        this.MessageService = kMessageService;
        this.filterUsersModel = filterUsersModel;
        this.droolsConstants = droolsConstants;
        this.kLoadingService = kLoadingService;
        this.$uibModalInstance = $uibModalInstance;

        this.userFactory.cleanScreen();

        this.findUsers();

        this.usersToCol = []; // lista temporal de usuarios Para (To)
        this.usersCcCol = []; // lista temporal de usaurios Con copia (Cc)
        this.participantsCol = []; // lista temporal de participantes
    }

    /**
     * buscar usuarios
     */
    findUsers(){
        //NOTA: CAMBIAR AMBIENTE PARA GENERAR (URL_USER_LOC, URL_USER_PRE, URL_USER_QA, URL_USER_PRO)
        this.userFactory.findUsers(this.droolsConstants.SERVICE.URL_USER_PRO);
    }

    /**
     * valida los usuarios seleccionados
     */
    selected(row){
        var index = null;
        //valida si es la pantalla de participantes
        if(this.droolsFactory.addressee.code !== null){
            //valida si es 0=To, 1=Cc
            if(this.droolsFactory.addressee.code === 0){
                //agrega usuarios a la lista Para (To)
                if(row.entity.seleccionar){
                    this.usersToCol.push(row.entity);
                }else{
                    //eliminar usuarios de la lista Para (To)
                    index = this.usersToCol.indexOf(row.entity);
                    this.usersToCol.splice(index, 1);
                }
            }else{
                //valida la lista de usuarios Con copia (Cc)
                if(row.entity.seleccionar){
                    this.usersCcCol.push(row.entity);
                }else{
                    //eliminar usuarios de la Con copia (Cc)
                    index = this.usersCcCol.indexOf(row.entity);
                    this.usersCcCol.splice(index, 1);
                }
            }
        }else{
            if(row.entity.seleccionar){
                row.entity.field = this.droolsConstants.FIELDS[0].code; // Para(To) por defecto
                row.entity.typeAlert = this.droolsModel.typeAlert.id;
                row.entity.modified = true; 
                this.participantsCol.push(row.entity);
            }else{
                //eliminar usuarios de la Con copia (Cc)
                index = this.participantsCol.indexOf(row.entity);
                this.participantsCol.splice(index, 1);
            }
        }
    }

    /**
     * se agrega la lista de usuarios al grid
     */
    accept(){
        //valida si es la pantalla de participantes
        if(this.droolsFactory.addressee.code !== null){
            //valida si es 0=To, 1=Cc
            if(this.droolsFactory.addressee.code === 0){
                //lista Para (To)
                if(this.lodash.isEmpty(this.droolsModel.gridUsersToDrools.data)){
                    this.droolsModel.gridUsersToDrools.data = this.usersToCol;
                }else{
                    //verifica si existe el usuarios en la lista original 
                    angular.forEach(this.usersToCol, (row) => {
                        let userExist = this.lodash.find(this.droolsModel.gridUsersToDrools.data, (user) => {
                            return user.userId.trim() === row.userId.trim();
                        });
                        //si no existe en la lista lo agrega
                        if(this.lodash.isUndefined(userExist)){
                            this.droolsModel.gridUsersToDrools.data.push(row);
                        } 
                    });
                }
            }else{
                //lista Con copia (Cc)
                if(this.lodash.isEmpty(this.droolsModel.gridUsersCcDrools.data)){
                    this.droolsModel.gridUsersCcDrools.data = this.usersCcCol;
                }else{
                    //verifica si existe el usuarios en la lista original
                    angular.forEach(this.usersCcCol, (row) => {
                        let userExist = this.lodash.find(this.droolsModel.gridUsersCcDrools.data, (user) => {
                            return user.userId.trim() === row.userId.trim();
                        });
                        //si no existe en la lista lo agrega 
                        if(this.lodash.isUndefined(userExist)){
                            this.droolsModel.gridUsersCcDrools.data.push(row);
                        } 
                    });

                }
            }
        }else{
            //lista de nuevos participantes
            if(this.lodash.isEmpty(this.droolsModel.gridOptionsDrools.data)){
                this.droolsFactory.loadColumns(this.droolsModel.typeAlert.id);
                this.droolsModel.gridOptionsDrools.data = this.participantsCol;
            }else{
                 angular.forEach(this.participantsCol, (row) => {
                     let participantExist = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (part) => {
                           return part.userId.trim() === row.userId.trim();
                     });
                     //si no existe en la lista lo agrega 
                     if(this.lodash.isUndefined(participantExist)){
                        this.droolsModel.gridOptionsDrools.data.push(row);
                     }
                 });
            }
        }
        console.log('data', this.droolsModel.gridOptionsDrools.data);
        //cerrar modal
        this.cancel();
   }

    /**
     * cancelar
     */
    cancel() {
		this.$uibModalInstance.dismiss('cancel');
	}

    /**
     * obtener nombre field
     */
    getTitleUser(){
        return this.droolsFactory.addressee.name;
    }

    getGridOptions(){
        return this.userFactory.getGridOptions();
    }
}
export default ModalUserDroolsController;