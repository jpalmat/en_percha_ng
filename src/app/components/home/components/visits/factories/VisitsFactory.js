const numRegisterTemplate = `<div class="ui-grid-cell-contents">
    {{grid.appScope.centerVisit.getNumber(grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</div>`;

class VisitsFactory {

	constructor(homeService, $timeout, kLoadingService, kMessageService, visitsService, visitsModel,
		visitsConstants, uiGridConstants) {
		
		this.$timeout = $timeout;
        this.visitsModel = visitsModel;
        this.homeService = homeService;
		this.visitsService = visitsService;
		this.visitsConstants = visitsConstants;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
		this.uiGridConstants = uiGridConstants;

		this.gridApi = null;
        this.gridOptions = {
            appScope: this,
            enableFiltering: false,
            data: null,
            columnDefs: null,
			rowHeight: 30,
			enableColumnMenus: false,
            enableRowSelection: true,
            enablePagination: true,
			enableSorting: false,
            enablePaginationControls: false,
			paginationCurrentPage: 1,
			paginationPageSize: this.visitsConstants.SETTINGS.NUM_ROWS,
			totalItems: 0,
			useExternalPagination: true,
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;
                this.gridApi.pagination.on.paginationChanged(null, () => {
					this.firstFind(this.gridApi.grid.options.paginationCurrentPage)
				});
            }
        };

		this.showPagination = false;
		this.showIconReportExcel = false;
		this.generalData = {};
	}

	static instance(homeService, $timeout, kLoadingService, kMessageService, visitsService, visitsModel, 
		visitsConstants, uiGridConstants) {
		'ngInject';
		return new VisitsFactory(homeService, $timeout, kLoadingService, kMessageService, visitsService, 
			visitsModel, visitsConstants, uiGridConstants);
	}

	//Obtener Lista de Locales
	//filter=SUPERMAXI,MEGAMAXI,AKI,GRAN AKI,AKI - GRAN AKI,SUPERMAXI71,MAXIS-AKIS,MAXIS,AKIS
	getLocal(params) {
		return this.visitsService.getLocal(params);
	}

	//Obtener Lista de usuarios proveedores
	getUsers(params) {
		return this.homeService.getUsers(params);
	}

	/**
	 * Primera busqueda de visitas
	 */
	firstFindByFilter(jdeCode){
		this.visitsModel.codeJde = jdeCode;
		this.firstFind(1);
	}
	/**
	 * Busqueda de visitas
	 */
	firstFind(currentPage){
		this.initializeGrids(currentPage);
		this.visitsModel.firstResult = this.generalData.firstResult;
		this.visitsModel.maxResult = this.generalData.maxResult;
		this.visitsModel.totalNumberReg = this.generalData.totalNumberReg;
        this.findVisits(this.generalData.lastPage);
	}

	/**
	 * Busqueda de visitas para generar reporte excel
	 */
	firstVisitsForExcel(jdeCode){
		this.visitsModel.maxResult = null;
		this.visitsModel.codeJde = jdeCode;
		this.visitsModel.totalNumberReg = false;
        this.findVisits(1);
	}

	/*
    * Permite inicializar los arreglos que contiene la información de los grids
    */
    initializeGrids(currentPage){
        this.generalData = {
            totalPages: 0,
            firstResult: 0,
            totalNumberReg: true,
            maxResult: this.visitsConstants.SETTINGS.NUM_ROWS,
            lastPage: this.visitsConstants.SETTINGS.LAST_PAGE
        };
        this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
		this.gridOptions.paginationCurrentPage = currentPage;
    }

	/**
	 * buscar visitas
	 */
	findVisits(numPage) {
		this.kLoadingService.show();
        //actualiza el numero de pagina actual
        this.visitsModel.firstResult = this.generalData.maxResult * (numPage - 1);
		//busca proveedores
        this.visitsService.findVisits(this.visitsModel)
            .success((data) => {
				if(this.visitsModel.maxResult == null){
					this.changeObjectResultToDesignersToExportExcel(data.reportResultsForExcel);
					this.downloadFileExcel(this.visitsModel.reportVisitExcel);
					//cerrar pantalla de loading
        			this.kLoadingService.hide();
				}else{
					//inicializar grid
                	this.initializeInformation(data);
				}
            })
            .info(() => {
                this.cleanScreen();
                this.kMessageService.showInfo(this.visitsConstants.MESSAGES.NO_RESULTS_FILTER);
                this.kLoadingService.hide();
                this.showPagination = false;
				this.showIconReportExcel = false;
            })
            .error((mes) => {
                this.cleanScreen();
                this.kMessageService.showError(mes);
                this.kLoadingService.hide();
                this.showPagination = false;
				this.showIconReportExcel = false;
            });
	}

	/**
	 * Generar archivo excel
	 */
	downloadFileExcel(jsonData){
		let xmlData = this.jsonToSsXml(jsonData, "REPORTE VISITAS");
		let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		let blob = new Blob([xmlData], {'type': fileType});
		let button = angular.element('<a></a>');
		button.attr('href',window.URL.createObjectURL(blob));
		button.attr('download', "Reporte.xls");
		button[0].click();
	}

	/*
    * Arma el grid de visitas
    */
    initializeInformation(data){
        //inicializar la informacion
        this.cleanScreen();
		//se arma las cabeceras
		this.gridOptions.columnDefs = this.getHeadersVisits();
        //se agrega la informacion al data del gridOptions
        this.gridOptions.data = data.reportResults;
        //numero total de paginas
        this.generalData.totalPages = data.countResults;
        //actualizar el grid
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
        //mostrar paginacion
        this.showPagination = true;
		//mostrar boton de reporte excel
		this.showIconReportExcel = true;
        //cerrar pantalla de loading
        this.kLoadingService.hide();
    }

	/**
	 * Arma las cabeceras de la tabla de visitas
	 */
    getHeadersVisits() {
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
                    displayName: 'Usuario',
					field: 'user',
					width: '33%',
					minWidth: 100,
                    cellTooltip: true, 
					headerTooltip: 'Nombre de usuario',
                    headerCellClass: 'classHeaderCell'
				},
				{		
                    displayName: 'Local',			
					field: 'local',
					width: '33%',
					minWidth: 100,
                    cellTooltip: true, 
					headerTooltip: 'Nombre del local',
                    headerCellClass: 'classHeaderCell'
				},
				{
                    displayName: 'Fecha registro',
					field: 'date',
					width: 130,
                    cellTooltip: true, 
					cellTemplate: `<div class="ui-grid-cell-contents" style="text-align:center;">
						{{row.entity.date | date:"dd/MM/yyyy h:mma"}}</div>`,
					headerTooltip: 'Fecha de registro',
                    headerCellClass: 'classHeaderCell'
				},
				{
                    displayName: 'Alertas',
					field: 'alerts',
					width: 70,
                    cellTooltip: true, 
					headerTooltip: 'N\u00FAmero de alertas',
                    headerCellClass: 'classHeaderCell'
				},
                {
                    displayName: 'Estado',
					field: 'state',
					width: 120,
					cellTemplate: `<div class="ui-grid-cell-contents" style="text-align:left;">
						{{row.entity.state == 'END' ? 'ENVIADA' : (row.entity.state == 'FAI' ? 'CANCELADA' 
						: 'CADUCADA')}}</div>`,
                    cellTooltip: true, 
					headerTooltip: true,
                    headerCellClass: 'classHeaderCell'
				}
			];

		return columnDefs;
	}

	/**
	 * Limpiar model
	 */
	cleanPage() {
		this.visitsModel.clean();
		this.gridOptions.data = [];
	}

    /**
	 * Limpiar valores de la pantalla
	 */
	cleanScreen(){
		this.gridOptions.data = [];
        this.gridOptions.columnDefs = [];
        this.gridApi.core.notifyDataChange(this.uiGridConstants.dataChange.ALL);
	}

	getGridOptions(){
		return this.gridOptions;
	}

	/**
	 * Transformar la informacion para exportar a excel
	 */
	changeObjectResultToDesignersToExportExcel(objectResult) {
		this.visitsModel.reportVisitExcel.data = [];
		//estructura que se debe armar para crear reporte en excel
		this.visitsModel.reportVisitExcel.columns = {
			'nro': ['NRO.', 'String', '29.5', 'center'],
			'user': ['USUARIO', 'String', '280.5', 'left'],
			'local': ['LOCAL', 'String', '220.5', 'left'],
			'date': ['FECHA REGISTRO', 'String', '150', 'center'],
			'alerts': ['ALERTAS', 'String', '80', 'rigth'],
			'state': ['ESTADO', 'String', '100', 'left'],
		};

		for (let i = 0; i < objectResult.length; i++) {
			//cambiar formato de fecha
			let dateTemp = new Date(objectResult[i].date);
			//validar estado de la visita
			let stateTemp = null;
			if(objectResult[i].state == 'END'){
				stateTemp = 'ENVIADA';
			}else if(objectResult[i].state == 'FAI'){
				stateTemp = 'CANCELADA';
			}else{
				stateTemp = 'CADUCADA';
			}
			//valida la informacion para colocar en las columnas
			let resultBody = {
				'nro': i + 1, 
				'user': objectResult[i].user === null ? '-' : objectResult[i].user,
				'local': objectResult[i].local === null ? '-' : objectResult[i].local,
				'date': objectResult[i].date === null ? '-' : dateTemp.toLocaleString(),
				'alerts': objectResult[i].alerts === null ? '-' : objectResult[i].alerts,
				'state': objectResult[i].state === null ? '-' : stateTemp,
			};
			this.visitsModel.reportVisitExcel.data.push(resultBody);
		}
	}

	/**
	 * Conversion de json a xml
	 */
	jsonToSsXml(jsonData, tableTitle) {
		let xml = this.emitXmlHeader(jsonData.columns,1,jsonData.data.length+2, tableTitle);
		xml += this.emitXmlHeader(jsonData.columns,2, 0, tableTitle);
		for (let row = 0; row < jsonData.data.length; row++) {
			xml += '<ss:Row ss:AutoFitHeight="0" ss:Height="15.9375">\n';
			for (let col in jsonData.data[row]) {
				if(jsonData.columns[col][3] === 'center'){
					xml += '<ss:Cell ss:StyleID="s71">\n';
				}
				if(jsonData.columns[col][3] === 'left'){
					xml += '<ss:Cell ss:StyleID="s72">\n';
				}
				if(jsonData.columns[col][3] === 'rigth'){
					xml += '<ss:Cell ss:StyleID="s73">\n';
				}

				xml += '<ss:Data ss:Type="' + jsonData.columns[col][1] + '">';
				xml += jsonData.data[row][col] + '</ss:Data>\n';
				xml += '</ss:Cell>\n';
			}
			xml += '</ss:Row>\n';
		}
		xml += this.emitXmlFooter();
		return xml;
	}

	/**
	 * Cabecera de archivo excel
	 */
	emitXmlHeader(colsName, level, size, tableTitle) {
		let headerRow = '<ss:Row ss:AutoFitHeight="0" ss:Height="15.9375" ss:StyleID="s69">\n';
		let numberColumns = 0;
		for (let colName in colsName) {
			headerRow += '  <ss:Cell ss:StyleID="s70" >\n';
			headerRow += '    <ss:Data ss:Type="String">';
			headerRow += colsName[colName][0] + '</ss:Data>\n';
			headerRow += '  </ss:Cell>\n';
			numberColumns++;
		}
		headerRow += '</ss:Row>\n';
		if(level === 1){
			let headerRow = '<?xml version="1.0"?>\n' +
				'<ss:Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">\n' +
				'<ss:Styles>\n' +
				'<ss:Style ss:ID="Default" ss:Name="Normal">\n' +
				'<ss:Alignment ss:Vertical="Bottom"/>\n' +
				'<ss:Borders/>\n' +
				'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>\n' +
				'<ss:Interior/>\n' +
				'<ss:NumberFormat/>\n' +
				'<ss:Protection/>\n' +
				'</ss:Style>\n' +
				'<ss:Style ss:ID="s68">\n' +
				'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
				'<ss:Borders>\n' +
				'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'</ss:Borders>\n' +
				'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="14" ss:Color="#2c4c74" ss:Bold="1"/>\n' +
				'</ss:Style>\n' +
				'<ss:Style ss:ID="s69">\n' +
				'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
				'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>\n' +
				'</ss:Style>\n' +
				'<ss:Style ss:ID="s70">\n' +
				'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
				'<ss:Borders>\n' +
				'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'</ss:Borders>\n' +
				'<ss:Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>\n' +
				'</ss:Style>\n' +
				'<ss:Style ss:ID="s71">\n' +
				'<ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>\n' +
				'<ss:Borders>\n' +
				'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'</ss:Borders>\n' +
				'</ss:Style>\n' +
				'<ss:Style ss:ID="s72">\n' +
				'<ss:Alignment ss:Horizontal="Left" ss:Vertical="Bottom"/>\n' +
				'<ss:Borders>\n' +
				'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'</ss:Borders>\n' +
				'</ss:Style>\n' +
				'<ss:Style ss:ID="s73">\n' +
				'<ss:Alignment ss:Horizontal="Right" ss:Vertical="Bottom"/>\n' +
				'<ss:Borders>\n' +
				'<ss:Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'<ss:Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>\n' +
				'</ss:Borders>\n' +
				'</ss:Style>\n' +
				'</ss:Styles>\n' +
				'<ss:Worksheet ss:Name="Sheet1">\n' +
				'<ss:Table ss:ExpandedColumnCount="'+numberColumns+'" ss:ExpandedRowCount="'+size+'" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="60" ss:DefaultRowHeight="20.9375">\n';

			for (let colName in colsName) {
				headerRow+='<ss:Column ss:Width="'+colsName[colName][2]+'"/>\n';
			}

			headerRow+='<ss:Row>\n' +
				'<ss:Cell ss:MergeAcross="'+(numberColumns-1)+'" ss:StyleID="s68">\n' +
				'<ss:Data ss:Type="String">\n';
			headerRow+=tableTitle+'</ss:Data>\n' +
				'</ss:Cell>\n' +
				'</ss:Row>\n';
			return headerRow;
		}else{
			return headerRow;
		}
	}
	
	/**
	 * Footer
	 */
	emitXmlFooter() {
		return '\n</ss:Table>\n' +
			'</ss:Worksheet>\n' +
			'</ss:Workbook>\n';
	}

}
export default VisitsFactory;