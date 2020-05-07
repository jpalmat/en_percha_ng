class ModalDetailAlertController {

	constructor($uibModalInstance, detailAlertFactory, reportsModel) {
		this.reportsModel = reportsModel;
		this.$uibModalInstance = $uibModalInstance;
		this.detailAlertFactory = detailAlertFactory;
		this.detailAlertFactory.initialize();
		// se guarda la informacion de la alerta seleccionada
		this.infoAlert = this.reportsModel._detailAlert;
	}

	/**
	 * cerrar el popup
	 */
	cancel(){
		this.$uibModalInstance.dismiss('cancel');
	}

	getGridOptions(){
        return this.detailAlertFactory.getGridOptions();
    }
}

export default ModalDetailAlertController;