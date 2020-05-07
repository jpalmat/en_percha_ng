const checkTemplate = `<div class="checkbox" ng-click="grid.appScope.modalProviderDroolsController.selected(row)"> 
<input type="checkbox" ng-model="row.entity.seleccionar" title="Seleccionar"></div>`;

const numRegisterTemplate = `<div class="ui-grid-cell-contents">
    {{grid.appScope.modalProviderDroolsController.getNumber(grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</div>`;

class ProviderFactory{
    constructor(droolsConstants, droolsService, kLoadingService, kMessageService, $uibModal, lodash,  $timeout, uiGridConstants) {

        this.lodash = lodash;
        this.hideGrid = null;
        this.droolsModel = null;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;
        this.droolsConstants = droolsConstants;
        this.droolsService = droolsService;
        this.uiGridConstants = uiGridConstants;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;
        
        this.filterProviderModel = null;
        this.showPagination = false;
        this.generalData = {};

        this.gridApi = null;
        this.gridOptions = {
            appScope: this,
            enableFiltering: false,
            data: null,
            columnDefs: null,
            enableRowSelection: true,
            enablePagination: true,
            enablePaginationControls: false,
			paginationCurrentPage: 1,
			paginationPageSize: this.droolsConstants.SETTINGS.NUM_ROWS,
			totalItems: 0,
			useExternalPagination: true,
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
                this.gridApi.pagination.on.paginationChanged(null, () => {
                this.findProviders(this.gridApi.grid.options.paginationCurrentPage);
          });
            }
        };
    }

    /*ngInject*/
    static instance(droolsConstants, droolsService, kLoadingService, kMessageService, $uibModal, lodash, $timeout, uiGridConstants){
        return new ProviderFactory(droolsConstants, droolsService, kLoadingService, kMessageService, $uibModal, 
            lodash, $timeout, uiGridConstants);
    }

    /*
    * Permite inicializar los arreglos que contiene la información de los grids
    */
    initializeGrids(){
        this.generalData = {
            totalPages: 0,
            firstResult: 0,
            totalNumberReg: true,
            maxResult: this.droolsConstants.SETTINGS.NUM_ROWS,
            lastPage: this.droolsConstants.SETTINGS.LAST_PAGE
        };
        this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
    }

    /**
     * Busqueda inicial de los proveedores
     */
    firstFind(filterProviderModel){
        this.filterProviderModel = filterProviderModel;
        filterProviderModel.firstResult = this.generalData.firstResult;
        filterProviderModel.maxResult = this.generalData.maxResult;
        filterProviderModel.totalNumberReg = this.generalData.totalNumberReg;
        this.findProviders(this.generalData.lastPage);
    }

    /**
     * buscar proveedores
     */
    findProviders(numPage){
        this.kLoadingService.show();
        //actualiza el numero de pagina actual
        this.filterProviderModel.firstResult = this.generalData.maxResult * (numPage - 1);
        //busca proveedores
        this.droolsService.findProviders(this.filterProviderModel)
            .success((data) => {
                //inicializar grid
                this.initializeInformation(data);
            })
            .info(() => {
                this.cleanScreen();
                this.kMessageService.showInfo(this.droolsConstants.MESSAGES.NO_RESULTS_FILTER);
                this.kLoadingService.hide();
                this.showPagination = false;
            })
            .error((message) => {
                this.cleanScreen();
                this.kMessageService.showError(message);
                this.kLoadingService.hide();
                this.showPagination = false;
            });
    }

    /*
    * Arma el grid de proveedores
    */
    initializeInformation(data){
        let providers = JSON.parse(data);
        //inicializar la informacion
        this.cleanScreen();
        //arma las cabeceras
        this.gridOptions.columnDefs = [
                { name: 'orden', displayName: 'No.', width: '8%', headerCellClass: 'classHeaderCell',
                    cellTemplate: numRegisterTemplate },
                { name: 'codigo', displayName: 'C\u00F3digo', width: '10%', headerCellClass: 'classHeaderCell' },
                { name: 'nombre', displayName: 'Nombre', width: '55%', headerCellClass: 'classHeaderCell' },
                { name: 'ruc', displayName: 'RUC', width: '20%', headerCellClass: 'classHeaderCell' },
                { name: 'seleccionar', displayName: '', width: '6%', headerCellClass: 'classHeaderCell', cellTemplate: checkTemplate }];
        //se agrega la informacion al data del gridOptions
        this.gridOptions.data = providers.results;
        //numero total de paginas
        this.generalData.totalPages = providers.countResults;
        //actualizar el grid
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
        //mostrar paginacion
        this.showPagination = true;
        //cerrar pantalla de loading
        this.kLoadingService.hide();
    }

    /*
    * Limpia los valores de la tabla si no se tiene registros
    */
    cleanScreen(){
        this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
    }

    /**
     * return gridOptions
     */
    getGridOptions(){
        return this.gridOptions;
    }
}

export default ProviderFactory;