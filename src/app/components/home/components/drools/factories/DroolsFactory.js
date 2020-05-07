/**
 * Created by jpalma on 17/04/2017.
 */
import GroupsTemplate from '../views/modalDrools.tpl';
import UserTemplate from '../views/modalUserDrools.tpl';
import ComLineTemplate from '../views/modalComLineDrools.tpl';
import ProviderTemplate from '../views/modalProviderDrools.tpl';
import TimeAlertTemplate from '../views/modalTimeAlertDrools.tpl';
import CausesTemplate from '../views/modalCausesDrools.tpl';

class DroolsFactory{
    constructor(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout, homeFactory) {

        this.lodash = lodash;
        this.hideGrid = false;
        this.droolsModel = null;
        this.droolsConstants = null;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.homeFactory = homeFactory;
        this.droolsService = droolsService;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;
        
        this.showRadio = false;
        this.existInfo = true; //valida si existe al menos un registro en pantall
        this.newCaseType = false; //valida si existe un cambio en el tipo de caso
        this.showAddButton = false; //valida si se visualiza el boton de agregar

        this.showSelect = false;
        this.stagePrevious = {}; //guarda el valor original del escenario
        this.typeAlertPrevious = null; //guarda el valor original del tipo de alerta

        this.optionSelected = null; //linea comercial seleccionada en modal
        this.errorMessage = null; // mensaje de error
        this.addressee = {code: null, name: null }; //tipo de destinatario To, Cc

        this.newCause = null; // nueva causa ingresada

        this.allowSearch = true; //permite la busqueda de una alerta

        //guarda el tipo de alerta seleccionado
        this.typeAlertSelected = { 
            id: null, 
            name: null, 
            setAssignedTime: null, 
            setAssignedUnitTime: null 
        };
        
        //valida usuario en sesion
        // this.validateUserLoggin();
    }

    /*ngInject*/
    static instance(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout, homeFactory) {
        return new DroolsFactory(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout, homeFactory);
    }

    /**
     * valida informacion de usuario en sesion en pantalla
     */
    validateUserLoggin(){
        let stringURL = window.location.hash.split('?');
        // valida usuario en sesion para informacion estandar de pantalla
        this.homeFactory.getSession(stringURL);
    }

    /**
     * construye el grid
     * @param gridOptionsDrools
     */
    buildGridDrools(gridOptionsDrools) {
        this.gridAux = gridOptionsDrools;
    }

    /**
     * construye el grid de usuarios To
     */
    buildGridUsersTo(gridUsers){
        this.gridUsersTo = gridUsers;
        this.loadColumnsUsers(this.gridUsersTo, true);
    }

    /**
     * construye el grid de usuarios Cc
     */
    buildGridUsersCc(gridUsers){
        this.gridUsersCc = gridUsers;
        this.loadColumnsUsers(this.gridUsersCc, false);
    }

     /**
     * Valida la opcion seleccionada de tipo de alerta
     */
    validarTipoAlerta(droolsModel, droolsConstants){
        this.droolsConstants = droolsConstants;
        //inicializar variables
        this.inicializeValues(droolsModel);

        if(this.droolsModel.typeAlert == null){
            this.hideGrid = false;
            this.showRadio = false;
            this.showSelect = false;
            this.showAddButton = false;
            this.droolsModel.stage = undefined;
            this.cleanScreen();
        }else{
            if((this.droolsModel.typeAlert.id == 4 || this.droolsModel.typeAlert.id == 12)  
                && (this.droolsModel.stage == undefined || this.droolsModel.stage == null)){
                this.hideGrid = false;
                this.showRadio = false;
                this.showSelect = true;
                this.showAddButton = false;
                this.cleanScreen();
            } else {
                this.showRadio = (this.droolsModel.typeAlert.id == 20 || this.droolsModel.typeAlert.id == 0) ? false : true;
                this.showAddButton = this.droolsModel.typeAlert.id == 0 ? false : true;
                if(this.droolsModel.typeAlert.id != 4 && this.droolsModel.typeAlert.id != 12){
                    this.showSelect = false;
                    this.droolsModel.stage = undefined; 
                }
                if(this.droolsModel.typeAlert.id == 21){
                    this.showRadio = false;
                    this.addressee = {code: null, name: null };
                }
                if(this.droolsModel.typeAlert.id == 22){
                    this.showRadio = false;
                }
                //realiza la busqueda drools
                this.findOptions();
            }
        }
    }

    /**
     * Inicializa variables por defecto
     */
    inicializeValues(droolsModel){
        this.droolsModel = droolsModel;
        //guarda el escenario seleccionado en caso (4)
        if(!this.lodash.isUndefined(this.droolsModel.stage)){
            this.stagePrevious = this.droolsModel.stage;
        }
        // si cambia de alerta 4 a 12 o visceversa se debe inicializar el escenario
        if(this.droolsModel.typeAlert != null && this.typeAlertPrevious != null &&
            ((this.droolsModel.typeAlert.id == 4 && this.typeAlertPrevious.id == 12) || 
            (this.droolsModel.typeAlert.id == 12 && this.typeAlertPrevious.id == 4))){
            this.droolsModel.stage = undefined;

        }
        //guarda el tipo de alerta seleccionado
        this.typeAlertPrevious = this.droolsModel.typeAlert;
        //retorna el valor original del tipo de caso
        this.newCaseType = false;
        //se modifica la variable que valida si existe al menos un registro en pantalla
        this.existInfo = true;
        //se inicializa la lista de registros eliminados
        this.droolsModel.groupsInactive = [];
        //se inicializa la lista causas
        this.droolsModel.newCausesList = [];
    }

    /**
     * realiza la busqueda de las opciones de un tipo de alerta
     */
    findOptions(){
        let id = this.droolsModel.stage == undefined ? this.droolsModel.typeAlert.id : this.droolsModel.stage.id;
        if(id == 30 || id == 40){
            this.showRadio = false;
        }
        //limpia la pantalla
        this.cleanScreen();
        //realiza la busqueda de informacion
        this.droolsService.getDroolsData(id)
            .success((data) => {
                this.loadColumns(id);
                this.cargarDatosUiGrid(data);
            }).info(() => {
                this.kMessageService.showInfo(this.droolsConstants.MESSAGES.NO_RESULTS);
            }).error((message) => {
                this.kMessageService.showError(message);
            });
        this.hideGrid = false;
    }

    /**
     * realiza la busqueda de lineas comerciales
     */
    findComercialLine(){
        let modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: ComLineTemplate.name,
            controller: 'modalComLineDroolsController',
            controllerAs: 'modalComLineDroolsController',
            size: 'comline',
            backdrop: 'static',
            resolve: {
                targetEvent: function () {
                    return event;
                }
            }
        });
        modalInstance.result.then(function (answer) {
            console.log('answer', answer);
        }, function () {

        });
    }

    /**
     * realiza la busqueda del tiempo maximo de solucion de alertas
     */
    openModalTimeAlert(){
        // abrir modal
        let modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: TimeAlertTemplate.name,
            controller: 'modalTimeAlertDroolsController',
            controllerAs: 'modalTimeAlertDroolsController',
            size: 'time',
            resolve: {
                targetEvent: function () {
                    return event;
                }
            }
        });
        modalInstance.result.then(function (answer) {
            console.log('answer', answer);
        }, function () {

        });
    }

    /**
     * realiza la busqueda de lineas comerciales
     */
    callModalUsers(){
        let modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: UserTemplate.name,
            controller: 'modalUserDroolsController',
            controllerAs: 'modalUserDroolsController',
            size: 'users',
            backdrop: 'static',
            resolve: {
                targetEvent: function () {
                    return event;
                }
            }
        });
        modalInstance.result.then(function (answer) {
            console.log('answer', answer);
        }, function () {

        });
    }

    /**
     * se visualiza modal de proveedores
     */
    callModalProvider(){
        let modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: ProviderTemplate.name,
            controller: 'modalProviderDroolsController',
            controllerAs: 'modalProviderDroolsController',
            size: 'provider',
            backdrop: 'static',
            resolve: {
                targetEvent: function () {
                    return event;
                }
            }
        });
        modalInstance.result.then(function (answer) {
            console.log('answer', answer);
        }, function () {

        });
    }

    /**
     * se visualiza modal de causas
     */
    callModalCauses(){
        let modalInstance = this.$uibModal.open({
            animation: true,
            templateUrl: CausesTemplate.name,
            controller: 'modalCausesDroolsController',
            controllerAs: 'modalCausesDroolsController',
            size: 'causes',
            backdrop: 'static',
            resolve: {
                targetEvent: function () {
                    return event;
                }
            }
        });
        modalInstance.result.then(function (answer) {
            console.log('answer', answer);
        }, function () {

        });
    }

    /**
     * carga los datos del servicio en el ui-grid
     * @param data
     */
    cargarDatosUiGrid(data) {
         let dataDrools = data;
        if(this.droolsModel.typeAlert.id != 22){
            dataDrools = JSON.parse(data);
        }
        if(this.droolsModel.typeAlert.id != 0){
            for(var i = 0; i < dataDrools.length; i++){
                dataDrools[i].typeAlert = this.droolsModel.typeAlert.id;
            }
        }
        this.$timeout(() => {
            this.droolsModel.gridOptionsDrools.data = dataDrools;
            //valida tipo de caso
            if(!this.lodash.isEmpty(this.droolsModel.gridOptionsDrools.data)){
                this.droolsModel.radioToCc = this.droolsModel.gridOptionsDrools.data[0].caseType == 'NORMAL' ? 'gestion' : 'lectura';
            }
        }, 10);
    }

    /**
     * carga las cabeceras del grid de usuarios
     * gridUsers Grid del destrinatario correspondiente
     * isUserTo True si es destinatario Para (to), false caso contrario
     */
    loadColumnsUsers(gridUsers, isUserTo){
        //valida el grid que se va a cargar (To o Cc)
        let cellTemplateCheckbox = null;
        if(isUserTo){
            cellTemplateCheckbox = `<div title="Eliminar usuario" 
                class="classButtonAlert btn btn-default" ng-click="grid.appScope.droolsController.deleteUserTo(row)">
                <span class="fa fa-times" style="color: #E74C3C; cursor:pointer;font-size:15px"></span></div>`;
        }else{
            cellTemplateCheckbox = `<div title="Eliminar usuario" 
                class="classButtonAlert btn btn-default" ng-click="grid.appScope.droolsController.deleteUserCc(row)">
                <span class="fa fa-times" style="color: #E74C3C; cursor:pointer;font-size:15px"></span></div>`;
        }        

        gridUsers.enableSorting = false,
        gridUsers.columnDefs = [
            { name: 'orden', displayName: 'No.', width: '7%', headerCellClass: 'classHeaderCell',
                cellTemplate: `<div class="ui-grid-cell-contents">
                    {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
            { name: 'userId', displayName: 'C\u00F3digo', width: '18%', headerCellClass: 'classHeaderCell' },
            { name: 'name', displayName: 'Nombre', width: '49%', headerCellClass: 'classHeaderCell' },
            { name: 'userName', displayName: 'Usuario', width: '18%', headerCellClass: 'classHeaderCell' },
            { name: 'eliminar', displayName: '', width: '8%', headerCellClass: 'classHeaderCell', 
                cellTemplate: cellTemplateCheckbox}
        ];
    }

    /**
     * Define las columnas del ui-grid de busqueda acumulada en base al nivel seleccionado 
     * en el comboBox de los fltros del panel de busqueda
     * @param nivel articulo, clasificacion, departamento, division, establecimiento, area de trabajo
     */
    loadColumns(tipoAlerta){
        let cellTemplateGroup = `<div class="cellOverflow"> {{grid.appScope.droolsController.showGroup(row.entity)}} </div>`;
        let cellTemplateCamp = `<div class="cellOverflow"> {{grid.appScope.droolsController.showCamp(row.entity)}} </div>`;
        let cellTemplateNormal = `<div class="cellOverflow" title="{{grid.appScope.droolsController.showUsers(row.entity.userTo)}}">
            {{grid.appScope.droolsController.showUsers(row.entity.userTo)}} </div>`;
        let cellTemplateRead = `<div class="cellOverflow" title="{{grid.appScope.droolsController.showUsers(row.entity.userCc)}}">
            {{grid.appScope.droolsController.showUsers(row.entity.userCc)}} </div>`;
        let eliminarTemplate = `<div title="Eliminar" class="classButtonAlert btn btn-default" 
            ng-click="grid.appScope.droolsController.deleteGroup(row)"><span class="fa fa-times" 
            style="color: #E74C3C; cursor:pointer; font-size:15px;"></span></div>`;
        let editarTemplate = `<div title="Editar" class="classButtonAlert btn btn-default" 
            ng-click="grid.appScope.droolsController.editInformation(row)"><span class="fa fa-pencil-square-o" 
            style="color: #2552b5; cursor:pointer; font-size:15px;"></span></div>`;
        let deleteCause = `<div title="Eliminar" class="classButtonAlert btn btn-default" 
            ng-click="grid.appScope.droolsController.deleteCause(row)"><span class="fa fa-times" 
            style="{{row.entity.causeId == 1 ? 'color: #e6bdb9' : 'color: #E74C3C'}}; cursor:pointer; font-size:15px;"></span></div>`;
        let cellTemplateCause = `<div class="cellOverflow" normalize> {{row.entity.cause}} </div>`;
        let cellTemplateCauseStatus = `<div class="cellOverflow"> {{row.entity.causeState ? 'Activo': 'Inactivo'}} </div>`;
        let cellTemplateProviderCode = `<div class="cellOverflow"> {{row.entity.group.split("-")[0]}} </div>`;
        let cellTemplateProviderRuc = `<div class="cellOverflow"> {{row.entity.group.split("-")[1]}} </div>`;
        let cellTemplateProviderName = `<div class="cellOverflow"> {{row.entity.group.split("-")[2]}} </div>`;
        let cellTemplateNameTypeAlert = `<div class="cellOverflow"> {{grid.appScope.droolsController.showNameTypeAlert(row.entity)}}
            </div>`;
        let cellTemplateTimeAlert = `<div class="cellOverflow"> {{grid.appScope.droolsController.showTimeAlert(row.entity)}} </div>`;
        let editTimeAlert = `<div title="Editar tiempo asignado" class="classButtonAlert btn btn-default" 
            ng-click="grid.appScope.droolsController.editTimeAlert(row)"><span class="fa fa-pencil-square-o" 
            style="color: #2552b5; cursor:pointer; font-size:15px;"></span></div>`;

        if(tipoAlerta == 30 || tipoAlerta == 40){
            this.gridAux.columnDefs = [
                {name: 'No.', width: 33, enableSorting: false, pinnedLeft: true, headerCellClass: 'classHeaderCell',
                    cellTemplate: `<div class="ui-grid-cell-contents">
                        {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
                {field: 'lineComercialId', displayName: 'L\u00EDnea Comercial', width: '20%', 
                    headerCellClass: 'classHeaderCell'},
                {field: 'userTo', displayName: 'Gestion', width: '35%', cellTemplate: cellTemplateNormal, 
                    headerCellClass: 'classHeaderCell'},
                {field: 'userCc', displayName: 'Lectura', width: '32%', cellTemplate: cellTemplateRead, 
                    headerCellClass: 'classHeaderCell'},
                {field: 'editar', displayName: '', width: '5%', cellTemplate: editarTemplate, 
                    headerCellClass: 'classHeaderCell', enableSorting: false},
                {field: 'eliminar', displayName: '', width: '5%', cellTemplate: eliminarTemplate, 
                    headerCellClass: 'classHeaderCell', enableSorting: false}
            ];
        }else {
            if(tipoAlerta == 20){
                //arma cabecera de proveedores sancionados
                this.gridAux.columnDefs = [
                    {name: 'No.', width: 33, enableSorting: false, pinnedLeft: true, headerCellClass: 'classHeaderCell',
                        cellTemplate: `<div class="ui-grid-cell-contents">
                            {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
                    {field: 'typeAlert', displayName: 'typeAlert', visible: false},
                    {field: 'group', displayName: 'C\u00F3digo', width: '11%', cellTemplate: cellTemplateProviderCode, 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'group', displayName: 'RUC', width: '11%', cellTemplate: cellTemplateProviderRuc, 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'group', displayName: 'Nombre', width: '70%', cellTemplate: cellTemplateProviderName, 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'eliminar', displayName: '', width: '5%', cellTemplate: eliminarTemplate, 
                        headerCellClass: 'classHeaderCell', enableSorting: false,}
                ];
            }else if(tipoAlerta == 0){
                //arma la cabecera de los tiempos de alertas
                this.gridAux.columnDefs = [
                    {name: 'No.', width: 33, enableSorting: false, pinnedLeft: true, headerCellClass: 'classHeaderCell',
                        cellTemplate: `<div class="ui-grid-cell-contents">
                            {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
                    {field: 'typeAlert', displayName: 'Tipo de alerta', width: '75%', 
                        headerCellClass: 'classHeaderCell', cellTemplate: cellTemplateNameTypeAlert },
                    {field: 'timer', displayName: 'Tiempo asignado', width: '17%',
                        headerCellClass: 'classHeaderCell', cellTemplate: cellTemplateTimeAlert },
                    {field: 'editar', displayName: '', width: '5%', 
                        headerCellClass: 'classHeaderCell', enableSorting: false, cellTemplate: editTimeAlert }
                ];
            }else if(tipoAlerta == 21){
                //arma la cabecera de los participantes por defecto
                this.gridAux.columnDefs = [
                    {name: 'No.', width: 33, enableSorting: false, pinnedLeft: true, headerCellClass: 'classHeaderCell',
                        cellTemplate: `<div class="ui-grid-cell-contents">
                            {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
                    {field: 'typeAlert', displayName: 'typeAlert', visible: false},
                    {field: 'userId', displayName: 'C\u00F3digo', width: '11%', 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'name', displayName: 'Nombre', width: '62%', 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'field', displayName: 'Campo', width: '15%', cellTemplate: cellTemplateCamp, 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'editar', displayName: '', width: '4%', cellTemplate: editarTemplate, 
                        headerCellClass: 'classHeaderCell', enableSorting: false},
                    {field: 'eliminar', displayName: '', width: '4%', cellTemplate: eliminarTemplate, 
                        headerCellClass: 'classHeaderCell', enableSorting: false}
                ];
            }else if(tipoAlerta == 22){
                //arma la cabecera de las causas
                this.gridAux.columnDefs = [
                    {name: 'No.', width: 33, enableSorting: false, pinnedLeft: true, headerCellClass: 'classHeaderCell',
                        cellTemplate: `<div class="ui-grid-cell-contents">
                            {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
                    {field: 'cause', displayName: 'Causa', width: '82%', 
                        headerCellClass: 'classHeaderCell', cellTemplate: cellTemplateCause},
                    {field: 'causeState', displayName: 'Estado', width: '10%', 
                        headerCellClass: 'classHeaderCell', cellTemplate: cellTemplateCauseStatus},
                    {field: 'eliminar', displayName: '', width: '5%', cellTemplate: deleteCause, 
                        headerCellClass: 'classHeaderCell', enableSorting: false}
                ]
            }else{
                this.gridAux.columnDefs = [
                    {name: 'No.', width: 33, enableSorting: false, pinnedLeft: true, headerCellClass: 'classHeaderCell',
                        cellTemplate: `<div class="ui-grid-cell-contents">
                            {{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>`},
                        {field: 'typeAlert', displayName: 'typeAlert', visible: false},
                    {field: 'group', displayName: 'Destinatario', cellTemplate: cellTemplateGroup, 
                        width: '62%', headerCellClass: 'classHeaderCell'},
                    {field: 'field', displayName: 'Campo', width: '25%', cellTemplate: cellTemplateCamp, 
                        headerCellClass: 'classHeaderCell'},
                    {field: 'editar', displayName: '', width: '5%', cellTemplate: editarTemplate, 
                        headerCellClass: 'classHeaderCell', enableSorting: false},
                    {field: 'eliminar', displayName: '', width: '5%', cellTemplate: eliminarTemplate, 
                        headerCellClass: 'classHeaderCell', enableSorting: false,}
                ];
            }
        }
        this.gridAux.data = [];
    }

    /**
     * valida modal de grupos
     */
    callModal(){
		this.openModal(null, GroupsTemplate.name, 'modalDroolsController', 'modalDroolsController');
    }
    
    /**
     * visualizar modal seleccionado
     */
    openModal(size, templateUrl, controller, controllerAs) {
		this.windowModal = this.$uibModal.open({
			animation: true,
			templateUrl: templateUrl,
			controller: controller,
			controllerAs: controllerAs,
			size: size,
            backdrop: 'static',
		});
	}

    /**
     * Limpia la pantalla principal
     */
    cleanScreen(){
         this.droolsModel.gridOptionsDrools.columnDefs = [];
         this.droolsModel.gridOptionsDrools.data = [];
         this.gridAux.data = [];
         this.gridAux.columnDefs = [];
    }

    /*************************************AGREGAR NUEVA LINEA COMERCIAL**************************************** */
    /**
     * agregar nueva linea comercial
     */
    accept(){
        //valida id linea comercial
        let incompleteInformation = this.validateInformationUsers();
        if(incompleteInformation){
            this.kMessageService.showError(this.errorMessage);
        }else{
            //busca la linea comercial ingresada en el campo de texto
            let comercialLine = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (row) => {
                return row.lineComercialId.split('-')[0] === this.dataComercialLine.newComercialLine.split('-')[0];
            });
            
            if(this.lodash.isUndefined(comercialLine)){
                //valida usuarios en pantalla
                this.validateUsers(true);
                //cambia de pantalla
                this.hideGrid = false;
                this.kMessageService.showInfo(this.droolsConstants.MESSAGES.ADD_INFO_SUCCESS);
                this.kMessageService.hide();
            }else{
                //valida si es modificacion de linea comercial
                if(this.droolsModel.titleModal == 'Modificar'){
                    //valida usuarios modificados en pantalla
                    this.validateUsers(false);
                    //cambia de pantalla
                    this.hideGrid = false;
                    this.kMessageService.hide();
                }else{
                    this.kMessageService.showError(this.droolsConstants.MESSAGES.LINE_COM_EXIST);
                }
            }
        }
    }

    /**
     * valida si existe error al agregar una nueva linea comercial
     */
    validateInformationUsers(){
        //valida el id de linea comercial
        if(this.lodash.isUndefined(this.dataComercialLine) || this.lodash.isEmpty(this.dataComercialLine.newComercialLine)){
            this.errorMessage = this.droolsConstants.MESSAGES.ID_LINE_COM;
            return true;
        }
        //valida los campos vacios Para
        else if(!this.lodash.isUndefined(this.dataComercialLine) && 
            !this.dataComercialLine.cbLocalTo && this.lodash.isEmpty(this.droolsModel.gridUsersToDrools.data)){
                this.errorMessage = this.droolsConstants.MESSAGES.ADD_TO;
                return true;
        }
        //valida los campos vacios Con copia
        else if(!this.lodash.isUndefined(this.dataComercialLine) && 
            !this.dataComercialLine.cbLocalCc && this.lodash.isEmpty(this.droolsModel.gridUsersCcDrools.data)){
                this.errorMessage = this.droolsConstants.MESSAGES.ADD_CC;
                return true;
        } 
        return false;
    }

    /**
     * valida informacion de usuarios nuevos o modificados para guardar en archivo drools
     * isNewUser True si es un nuevos usuario, false si es un usuario modificado
     */
    validateUsers(isNewUser){
        let usersToTemp = null;
        let usersCcTemp = null;

        //transforma usuarios para guardar (To)
        if(!this.lodash.isEmpty(this.droolsModel.gridUsersToDrools.data)){
            angular.forEach(this.droolsModel.gridUsersToDrools.data, (row) => {
                if(usersToTemp == null){
                    usersToTemp = row.userId + '-' + row.name + '-' + row.userName;
                }else{
                    usersToTemp = usersToTemp + ',' + row.userId + '-' + row.name + '-' + row.userName;
                }
            });
        }

        //transforma usuarios para guardar (Cc)
        if(!this.lodash.isEmpty(this.droolsModel.gridUsersCcDrools.data)){
            angular.forEach(this.droolsModel.gridUsersCcDrools.data, (row) => {
                if(usersCcTemp == null){
                    usersCcTemp = row.userId + '-' + row.name + '-' + row.userName;
                }else{
                    usersCcTemp = usersCcTemp + ',' + row.userId + '-' + row.name + '-' + row.userName;
                }
            });
        }

        //valida si existe grupo local en (To)
        if(this.dataComercialLine.cbLocalTo){
            this.dataComercialLine.newUserTo = this.droolsConstants.GROUPS[0].code;
            if(!this.lodash.isEmpty(usersToTemp)){
                this.dataComercialLine.newUserTo = this.dataComercialLine.newUserTo + ',' + usersToTemp;
            }
        }else{
             this.dataComercialLine.newUserTo = usersToTemp;
        }
        
        //valida si existe grupo local en (Cc)
        if(this.dataComercialLine.cbLocalCc){
            this.dataComercialLine.newUserCc = this.droolsConstants.GROUPS[0].code;
            if(!this.lodash.isEmpty(usersCcTemp)){
                this.dataComercialLine.newUserCc = this.dataComercialLine.newUserCc + ',' + usersCcTemp;
            }
        }else{
            this.dataComercialLine.newUserCc = usersCcTemp;
        }

        //se agrega el nuevo registro en la lista
        if(isNewUser){
            let newData = {};
            newData.lineComercialId = this.dataComercialLine.newComercialLine;
            newData.userTo = this.dataComercialLine.newUserTo;
            newData.userCc = this.dataComercialLine.newUserCc;
            newData.modified = true;
            console.log('newData: ',newData);
            this.droolsModel.gridOptionsDrools.data.push(newData);
        }else{
            //se obtiene el registro original para modificarlo
            var index = this.droolsModel.gridOptionsDrools.data.indexOf(this.droolsModel.indexGrid.entity);
            this.droolsModel.gridOptionsDrools.data[index].userTo = this.dataComercialLine.newUserTo.replace(/,\s*^/, '');
            this.droolsModel.gridOptionsDrools.data[index].userCc = this.dataComercialLine.newUserCc.replace(/,\s*^/, '');
            this.droolsModel.gridOptionsDrools.data[index].modified = true;
        }
    }

    /**
     * limpia valores en pantalla
     */
    cleanValues(){
        this.droolsModel.gridUsersToDrools = {};
        this.droolsModel.gridUsersCcDrools = {};
        this.optionSelected = null;
        this.dataComercialLine = {
            newComercialLine: '', // id de linea comercial
            cbLocalTo: false, // local Para
            cbUserTo: false, // usuario Para
            newUserTo: '', // usuarios ingresados Para 
            cbLocalCc: false, // local Con copia
            cbUserCc: false, // usuario Con copia
            newUserCc: '' // usuarios ingresados Con copia
        };
    }

    /**
     * cancelar
     */
    cancel() {		
        //cambia de pantalla
        this.hideGrid = false;
        this.kMessageService.hide();
	}

    /********************************************************************************************************* */

    /**
     * guarda los cambios en el archivo drools
     */
    saveDrools(typeAlert, modelDrools){
        return this.droolsService.saveDrools(typeAlert, modelDrools);
    }

    /**
     * retorna valor para mostrar escenario
     */
    getShowSelect(){
        return this.showSelect;
    }

    /**
     * obtiene la linea comercial seleccionada
     */
    getOptionSelected(){
        if(this.optionSelected != null){
            return true;
        }
        return false;
    }

    /**
     * valida la visualizacion de los botones del header
     */
    validateHeaderButton(){
        //valida si no existe seleccionada ningun tipo de oferta
        if(this.droolsModel == null){
            return false;
        }else if(this.droolsModel.typeAlert == null){
            return false;
        }else if((this.droolsModel.typeAlert.id == 4 || this.droolsModel.typeAlert.id == 12) 
            && this.droolsModel.stage == null){
            return false;
        }else if(this.hideGrid){
            return false;
        }
        return true;
    }

    /**
     * valida la visualizacion del boton Agregar
     */
    validateAddButton(){
        if(this.showAddButton && this.hideGrid){
            return !this.showAddButton;
        }
        return this.showAddButton;
    }

}

export default DroolsFactory;