
class LeftVisitController {

    /*@ngInject*/
    constructor($scope, $timeout, lodash, visitsFactory, visitsModel, kLoadingService, kMessageService, 
        layoutFactory, visitsConstants, kModalService, homeModel) {

        layoutFactory.renderLeft(true);

        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.homeModel = homeModel;
        this.visitsModel = visitsModel;
        this.visitsFactory = visitsFactory;
        this.kModalService = kModalService;
        this.kMessageService = kMessageService;
        this.kLoadingService = kLoadingService;
        this.visitsConstants = visitsConstants;
        this.init();
    }

    init(){
        this.kLoadingService.show();
        this.visitsFactory.getLocal({
                filter: 'SUPERMAXI,MEGAMAXI,AKI,GRAN AKI,AKI - GRAN AKI,SUPERMAXI71,MAXIS-AKIS,MAXIS,AKIS' })
                .success((data) => {
            this.visitsModel.locales = data;
            // this.kLoadingService.hide();
            this.$scope.$digest();
		});
		// this.kLoadingService.show();
		this.filtro = this.homeModel._jdeCode + ',' + this.homeModel._localCodeProv + ',' + this.homeModel._personCodeProv;
        this.visitsFactory.getUsers({filter:this.filtro}).success((data) => {
            this.visitsModel.users = data;
            this.kLoadingService.hide();
        });
		this.visitsFactory.cleanPage();
	}

    findVisits(){
        this.kMessageService.hide();
        this.visitsFactory.firstFindByFilter(this.homeModel._jdeCode);
    }
    /**
	 * inicializar filtros de busqueda
	 */
	clear(){
		this.visitsModel.local.clear();
		this.visitsModel.state.clear();
		this.visitsModel.user.clear();
		this.visitsModel.date.clear();
	}

}

export default LeftVisitController;