const radioButtonTemplate = `<div class="radioButton" ng-click="grid.appScope.modalComLineDroolsController.selected(row)"> 
<span class="fa fa-circle-o" style="color: #cccccc; cursor:pointer; font-size:15px;" 
title="Seleccionar {{row.entity.nombre}}"></span></div>`;

class ComercialLineFactory{
    constructor(droolsService, kLoadingService, kMessageService, $uibModal, lodash,  $timeout) {

        this.lodash = lodash;
        this.hideGrid = null;
        this.droolsModel = null;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.droolsService = droolsService;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;

        this.gridApi = null;

        this.gridOptions = {
            appScope: this,
            enableFiltering: true,
            enableRowSelection: true,
            data: [],
            columnDefs: [
                { name: 'codLinCom', displayName: 'C\u00F3digo', width: '20%', headerCellClass: 'classHeaderCell' },
                { name: 'nombre', displayName: 'Nombre', width: '63%', headerCellClass: 'classHeaderCell' },
                { name: 'seleccionar', displayName: '', width: '5%', headerCellClass: 'classHeaderCell', enableFiltering: false,
                    cellTemplate: radioButtonTemplate },
            ],
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
            }
        };
            
        this.initialize(); 
    }

    /*ngInject*/
    static instance(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout) {
        return new ComercialLineFactory(droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout);
    }


    /**
     * inicializa la informacion
     */
    initialize(){
        this.kLoadingService.show();
        this.droolsService.getComercialLines()
            .success((data) => {
                let dataDrools = JSON.parse(data);
                this.$timeout(() => {
                    this.gridOptions.data = dataDrools;
                    this.kLoadingService.hide();
                }, 100);
            });
    }

    /**
     * return gridOptions
     */
    getGridOptions(){
        return this.gridOptions;
    }
}

export default ComercialLineFactory;