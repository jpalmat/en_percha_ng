
class ContentProviderController {

    constructor(providerConstants,providerFactory,$state,homeModel){
        
        this.$state = $state;
        this.homeModel = homeModel;
        this.providerFactory = providerFactory;
        this.providerConstants = providerConstants;
    }   

    callDeviceSection(entity) {
        this.homeModel._jdeCode= entity.codigoJDEProveedor;
        this.homeModel._providerCode= entity.id.codigoProveedor;
        this.homeModel._localCodeProv = entity.codigoLocalizacionProveedor;
        this.homeModel._personCodeProv = entity.codigoPersona;
        this.$state.go('ini.home.device');
	}

    /**
     * Se obtiene el numero del registro correspondiente
     */
    getNumber(index){
        let total = null;
        total = this.providerConstants.SETTINGS.NUM_ROWS * (this.providerFactory.gridApi.grid.options.paginationCurrentPage - 1) + index;
        return total;
    }

    /**
     * se obtiene la informacion del grid
     */
    getGridOptions(){
        return this.providerFactory.getGridOptions();
    }

}
export default ContentProviderController;