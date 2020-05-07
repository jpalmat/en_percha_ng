let _ = window._;
class HomeIndexController {
	/*jshint -W072 */
	constructor(homeModel, $location, layoutFactory, $state, kLoadingService) {
		'ngInject';
		layoutFactory.renderLeft(false);
		this.iFrameUrl = $location.search();
		if (_.isUndefined(homeModel._jdeCode)) {
			homeModel._jdeCode = this.iFrameUrl.codigoJde;
		}
		if (_.isUndefined(homeModel._localCodeProv)) {
			homeModel._localCodeProv = this.iFrameUrl.localizacion;
		}
		if (_.isUndefined(homeModel._personCodeProv)) {
			homeModel._personCodeProv = this.iFrameUrl.persona;
		}
		if (_.isUndefined(homeModel._userId)) {
			homeModel._userId = this.iFrameUrl.diresu;
		}
		
		this.homeModel = homeModel;
		homeModel._appFrom = this.iFrameUrl.from;
		homeModel._isFromMax = this.existAppFrom('max');
		homeModel._isFromB2b = this.existAppFrom('b2b');
		this.page = this.iFrameUrl.page;
		this.pageToGo = null;
		//kLoadingService.show();

		if (this.page == 'device') {
			this.pageToGo = 'ini.home.device';		
		} 
		if(this.page == 'reports'){
			this.pageToGo = 'ini.home.reports';
		}
		if(this.page == 'drools'){
			this.pageToGo = 'ini.home.drools';
		}
		if(this.page == 'menu'){
			this.pageToGo = 'ini.home';
		}
		if (this.page == 'provider') {
			this.pageToGo = 'ini.home.provider';			
		} 
		if (this.page == 'visits') {
			this.pageToGo = 'ini.home.visits';			
		} 
		//var pageToGo;
		$state.go(this.pageToGo);
		//kLoadingService.hide();
		// this.layoutFactory = layoutFactory;
		// this.layoutFactory.renderLeft(false);
		// this.layoutFactory.actionNavigation = '';

		// this.binderService = binderService;
		// this.binderService.put('formController', this);
	}
	existAppFrom(from) {
		var flag = false;
		if (this.homeModel._appFrom == from) {
			flag = true;
		}
		return flag;
	}
}

export default HomeIndexController;
