
class HeaderVisitController {
	/*@ngInject*/
    constructor($scope, $timeout, kLoadingService, kMessageService, lodash, kModalService) {
        
        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.kModalService = kModalService;
        this.MessageService = kMessageService; 
        this.kLoadingService = kLoadingService;
    }

}

export default HeaderVisitController;
