
class ModalCausesDroolsController{
    constructor(lodash, droolsConstants, droolsModel, droolsFactory, 
        kLoadingService, kMessageService, $uibModalInstance, kModalService) {

        this.lodash = lodash;
        this.droolsModel = droolsModel;
        this.kModalService = kModalService;
        this.droolsFactory = droolsFactory;
        this.droolsConstants = droolsConstants;
        this.kMessageService = kMessageService;
        this.kLoadingService = kLoadingService;
        this.$uibModalInstance = $uibModalInstance;
        this.droolsFactory.newCause = null;
    }

    /**
     * se agrega nuevo registro de causa
     */
    accept(){
        if (!this.lodash.isEmpty(this.droolsFactory.newCause)) {
            let newcause = {};
            newcause.cause = this.droolsFactory.newCause;
            newcause.causeId = null;
            newcause.causeState = true;
            newcause.modified = true;
            this.droolsModel.newCausesList.push(newcause);
            this.droolsModel.gridOptionsDrools.data.push(newcause);
            this.cancel();
        } else {
            this.kMessageService.showInfo(this.droolsConstants.MESSAGES.CAUSE_EMPTY);
        }
   }

    /**
     * cancelar
     */
    cancel() {
        this.kMessageService.hide();
		this.$uibModalInstance.dismiss('cancel');
	}

}

export default ModalCausesDroolsController;