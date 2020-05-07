class ContentSearchController {

	constructor(reportsFactory, $state, kMessageService, kLoadingService, reportsModel, $scope, layoutFactory) {
		'ngInject';
		layoutFactory.renderLeft(true);
		this.$state = $state;
		this.disabled = false;
		this.reportsModel = reportsModel;
		this.reportsFactory = reportsFactory;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
	}

	/**
	 * permite abrir el modal de detalles de alertas
	 */
	openModalDetailAlert(row){
		this.kMessageService.hide();
        //guarda la informacion de la alerta seleccionada
        this.reportsModel._detailAlert = row.entity;
        this.reportsFactory.callModalDetailAlert();
	}

}

export default ContentSearchController;
