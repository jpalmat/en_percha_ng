
class SideBarProviderController {

    constructor($timeout, lodash, providerConstants, providerFactory, kMessageService, layoutFactory, providerModel, homeModel){

        layoutFactory.renderLeft(true);
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.homeModel = homeModel;
        this.providerModel = providerModel;
        this.kMessageService = kMessageService;
        this.providerFactory = providerFactory;
        this.providerFactory.providerConstants = providerConstants;
        this.listProviderType = [{id: 'EMP', name: 'Empresa'},{id: 'PER', name: 'Persona'}];
        this.listProviderOrigin = [{id: 'N', name: 'Nacional'},{id: 'I', name: 'Internacional'}];
    }

    /**
     * inicializar filtros de busqueda
     */
    clear(){
        this.providerModel.providerCode.clear();
        this.providerModel.providerName.clear();
        this.providerModel.providerRuc.clear();
        this.providerModel.providerType.clear();
        this.providerModel.providerOrigin.clear();
    }

    /**
     * buscar proveedores
     */
    search($event){
        if(($event.type === 'keyup' && $event.keyCode === 13) || $event.type === 'click') {
            this.kMessageService.hide();
            this.providerFactory.firstFind(this.providerModel);
        }
    }

}
export default SideBarProviderController;