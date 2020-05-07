/**
 * Created by jpalma on 15/03/2017
 */
class HeaderController {
	/*jshint -W072 */
	constructor(homeModel, $state) {
		'ngInject';
		//this.$scope = $scope;
		this.homeModel = homeModel;
		this.$state = $state;
	}

	goHome() {
        this.$state.go("ini.home");
    }
}

export default HeaderController;