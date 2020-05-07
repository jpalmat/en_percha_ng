const checkTemplate = `<div class="checkbox" ng-click="grid.appScope.modalUserDroolsController.selected(row)"> 
<input type="checkbox" ng-model="row.entity.seleccionar" title="Seleccionar"></div>`;

class UserFactory{
    constructor(droolsService, kLoadingService, kMessageService, $uibModal, lodash,  $timeout, uiGridConstants) {

        this.lodash = lodash;
        this.hideGrid = null;
        this.droolsModel = null;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.droolsService = droolsService;
        this.uiGridConstants = uiGridConstants;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;

        this.gridApi = null;
        this.gridOptions = {
            appScope: this,
            enableFiltering: true,
            data: null,
            columnDefs: null,
            enableRowSelection: true,
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
            }
        };

        this.parameters = null;
        this.initializeParameters();

    }

    /**
     * parametros para buscar usuarios en elastic search
     */
    initializeParameters(){
        this.parameters = {'includes':['name', 'userName', 'userId'],'roles':[1]};
    }

    /*ngInject*/
    static instance(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout, uiGridConstants) {
        return new UserFactory(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout, uiGridConstants);
    }

    /**
     * busca los usuarios
     */
    findUsers(url){
        this.kLoadingService.show();
        //realiza la consulta de usuarios
        this.droolsService.findUsers(url, this.parameters)
            .success((data) => {
                //inicializar grid
                this.initializeInformation(data);
                this.kLoadingService.hide();
            })
            .error((message) => {
                this.cleanScreen();
                this.kMessageService.showError(message);
                this.kLoadingService.hide();
            });
    }

    /*
    * Arma el grid de usuarios
    */
    initializeInformation(data){
        //inicializar la informacion
        this.cleanScreen();
        //arma las cabeceras
        this.gridOptions.columnDefs = [
            { name: 'orden', displayName: 'No.', width: '7%', headerCellClass: 'classHeaderCell headerNoFilter', enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'},
            { name: 'userId', displayName: 'C\u00F3digo', width: '18%', headerCellClass: 'classHeaderCell' },
            { name: 'name', displayName: 'Nombre', width: '51%', headerCellClass: 'classHeaderCell' },
            { name: 'userName', displayName: 'Usuario', width: '18%', headerCellClass: 'classHeaderCell' },
            { name: 'selected', displayName: '', width: '8%', headerCellClass: 'classHeaderCell', cellTemplate: checkTemplate, 
                enableFiltering: false }];
        //se agrega la informacion al data del gridOptions
        this.gridOptions.data = data;
    }

    /*
    * Limpia los valores de la tabla si no se tiene registros
    */
    cleanScreen(){
        this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
        //this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
    }

    /**
     * return gridOptions
     */
    getGridOptions(){
        return this.gridOptions;
    }
}

export default UserFactory;