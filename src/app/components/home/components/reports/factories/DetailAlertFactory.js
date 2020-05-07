class DetailAlertFactory{
    constructor(kLoadingService, kMessageService, $timeout, reportsService, reportsModel){

        this.$timeout = $timeout;
        this.reportsModel = reportsModel;
        this.reportsService = reportsService;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;

        this.gridApi = null;

        this.gridOptions = {
            appScope: this,
            enableFiltering: false,
            allowCellFocus: false,
            enableCellEdit: false,
            enableSorting: false,
            enableColumnMenus: false,
            enableRowSelection: false,
            data: [],
            columnDefs: [
                { name: 'orden', displayName: 'No.', width: '9%', headerCellClass: 'classHeaderCell',
                cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>' },
                { name: 'codigoBarras', displayName: 'C\u00F3digo barras', width: '30%', headerCellClass: 'classHeaderCell' },
                { name: 'nombreArticulo', displayName: 'Nombre art\u00EDculo', width: '60%', headerCellClass: 'classHeaderCell' }],
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
            }
        };
    }

    /*ngInject*/
    static instance(kLoadingService, kMessageService, $timeout, reportsService, reportsModel) {
        return new DetailAlertFactory(kLoadingService, kMessageService, $timeout, reportsService, reportsModel);
    }


    /**
     * inicializa la informacion
     */
    initialize(){
        this.kLoadingService.show();
        this.gridOptions.data = [];
        this.reportsService.getDetailAlerts({filter: this.reportsModel._detailAlert.nCase})
            .success((data) => {
                this.$timeout(() => {
                    this.gridOptions.data = data;
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

export default DetailAlertFactory;