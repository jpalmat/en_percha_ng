const numRegisterTemplate = `<div class="ui-grid-cell-contents">
    {{grid.appScope.contentProvider.getNumber(grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</div>`;

class ProviderFactory {
    constructor(providerService, providerConstants, kMessageService, kLoadingService, 
        uiGridConstants, $timeout, homeFactory, homeModel){
        
		this.$timeout = $timeout;
		this.providerModel = null;
        this.homeModel = homeModel;
        this.homeFactory = homeFactory;
		this.kMessageService = kMessageService;
        this.providerService = providerService;
        this.kLoadingService = kLoadingService;
        this.uiGridConstants = uiGridConstants;
		this.providerConstants = providerConstants;
        
		this.showPagination = false;
		this.generalData = {};

		this.gridApi = null;
        this.gridOptions = {
            appScope: this,
            enableFiltering: false,
            data: null,
            columnDefs: null,
			enableColumnMenus: false,
            enableRowSelection: true,
            enablePagination: true,
			enableSorting: false,
            enablePaginationControls: false,
			paginationCurrentPage: 1,
			paginationPageSize: this.providerConstants.SETTINGS.NUM_ROWS,
			totalItems: 0,
			useExternalPagination: true,
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
                this.gridApi.pagination.on.paginationChanged(null, () => {
					this.findProviders(this.gridApi.grid.options.paginationCurrentPage);
				});
            }
        };

        //valida usuario en sesion
        // this.validateUserLoggin();
        this.validateLogin();
       
    }

	static instance(providerService, providerConstants, kMessageService, kLoadingService, 
        uiGridConstants, $timeout, homeFactory, homeModel){
       return new ProviderFactory(providerService, providerConstants, kMessageService, kLoadingService, 
        uiGridConstants, $timeout, homeFactory, homeModel); 
    }

    validateLogin(){
        this.kLoadingService.show();
        // obtener token 
        let infoToken = {userId: this.homeModel._userId, companyId: 1, systemId: "EPM"};
        this.providerService.getCorpToken(infoToken)
            .success((data) => {
                this.loginProvider(data);
            })
            .info(() => {
                console.log('info, getCorpToken');
                this.kMessageService.showInfo('Error al hacer login de proveedores');
                this.kLoadingService.hide();
            })
            .error(() => {
                console.log('error al obtener el token');
                this.kMessageService.showError(message);
                this.kLoadingService.hide();
            })
    }

    /**
     * login de pantalla de proveedores
     */
    loginProvider(params){
        this.providerService.loginProvider(params)
            .success((data) => {
                this.kLoadingService.hide();
            })
            .info(() => {
                console.log('info, getCorpToken');
                this.kMessageService.showInfo('Error al hacer login de proveedores');
                this.kLoadingService.hide();
            })
            .error(() => {
                console.log('error al obtener el token');
                this.kMessageService.showError(message);
                this.kLoadingService.hide();
            })

        this.kLoadingService.hide();
    }

    /**
     * valida informacion de usuario en sesion en pantalla
     */
    validateUserLoggin(){
        let stringURL = window.location.hash.split('?');
        // valida usuario en sesion para informacion estandar de pantalla
        this.homeFactory.getSession(stringURL);
    }

	/*
    * Permite inicializar los arreglos que contiene la información de los grids
    */
    initializeGrids(){
        this.generalData = {
            totalPages: 0,
            firstResult: 0,
            totalNumberReg: true,
            maxResult: this.providerConstants.SETTINGS.NUM_ROWS,
            lastPage: this.providerConstants.SETTINGS.LAST_PAGE
        };
        this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
		this.gridOptions.paginationCurrentPage = 1;
    }

	/**
     * Busqueda inicial de los proveedores
     */
    firstFind(providerModel){
		this.initializeGrids();
        this.providerModel = providerModel;
        this.providerModel.firstResult = this.generalData.firstResult;
        this.providerModel.maxResult = this.generalData.maxResult;
        this.providerModel.totalNumberReg = this.generalData.totalNumberReg;
        this.findProviders(this.generalData.lastPage);
    }

	/**
	 * buscar proveedores
	 */
	findProviders(numPage) {
		this.kLoadingService.show();
        //actualiza el numero de pagina actual
        this.providerModel.firstResult = this.generalData.maxResult * (numPage - 1);
		//busca proveedores
        this.providerService.findProviders(this.providerModel)
            .success((data) => {
                //inicializar grid
                this.initializeInformation(data);
            })
            .info(() => {
                this.cleanScreen();
                this.kMessageService.showInfo(this.providerConstants.MESSAGES.NO_RESULTS_FILTER);
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
        //inicializar la informacion
        this.cleanScreen();
		//se arma las cabeceras
		this.gridOptions.columnDefs = this.loadHeadboards();
        //se agrega la informacion al data del gridOptions
        this.gridOptions.data = data.results;
        //numero total de paginas
        this.generalData.totalPages = data.countResults;
        //actualizar el grid
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
        //mostrar paginacion
        this.showPagination = true;
        //cerrar pantalla de loading
        this.kLoadingService.hide();
    }

	 /*
    * limpia los valores de la tabla si no se tiene registros
    */
    cleanScreen(){
        this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
    }

	/**
	 * arma las cabeceras de la tabla de proveedores
	 */
    loadHeadboards() {
		let columnDefs = [
				{
                    displayName: 'No.',
					name: 'orden',  
					width: '4%', 
                    cellTooltip: true,
                    headerTooltip: 'N\u00FAmero de registro',
                    headerCellClass: 'classHeaderCell',
                    cellTemplate: numRegisterTemplate
				},
				{
                    displayName: 'C\u00F3digo',
					field: 'codigoJDEProveedor',
					width: 60,
                    cellTooltip: true, 
					headerTooltip: 'C\u00F3digo de proveedor',
                    headerCellClass: 'classHeaderCell',
					cellTemplate: `<div class="ui-grid-cell-contents">&nbsp<a href style="color: #990000;font-weight: bold;" 
                        ng-click="grid.appScope.contentProvider.callDeviceSection(row.entity)">{{row.entity.id.codigoProveedor}}</a></div>`
				},
				{
                    displayName: 'No. Documento',
					field: 'numeroDocumentoProveedor',
					width: 100,
                    cellTooltip: true, 
					headerTooltip: 'N\u00FAmero de Documento',
                    headerCellClass: 'classHeaderCell'
				},
				{
                    displayName: 'Nombre comercial',
					field: 'nombreProveedor',
					width: '25%',
					minWidth: 150,
                    cellTooltip: true, 
					headerTooltip: true,
                    headerCellClass: 'classHeaderCell'
				},
				{
                    displayName: 'Tip. Prov.',
					field: 'valorTipoEntidadProveedor',
					width: 100,
                    cellTooltip: true, 
					headerTooltip: 'Tipo de proveedor',
                    headerCellClass: 'classHeaderCell',
					cellTemplate: `<div class="ui-grid-cell-contents">
                        {{row.entity.valorTipoEntidadProveedor == \'EMP\' ?"Empresa":"Persona"}}</div>`
				},
				{		
                    displayName: 'Origen',			
					field: 'origenProveedor',
					width: 100,
                    cellTooltip: true, 
					headerTooltip: true,
                    headerCellClass: 'classHeaderCell',
					cellTemplate: `<div class="ui-grid-cell-contents">
                        {{row.entity.origenProveedor == \'I\' ?"Internacional":"Nacional"}}</div>`
				},
                {
                    displayName: 'Raz\u00F3n social',
					field: 'razonSocialProveedor',
					minWidth: 150,
                    cellTooltip: true, 
					headerTooltip: true,
                    headerCellClass: 'classHeaderCell'
				}
			];

		return columnDefs;
	}

	/**
     * return gridOptions
     */
    getGridOptions(){
        return this.gridOptions;
    }

}
export default ProviderFactory;