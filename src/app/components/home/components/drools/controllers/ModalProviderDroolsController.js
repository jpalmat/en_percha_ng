import FilterProviderModel from '../models/FilterProviderModel';

class ModalProviderDroolsController{
    /*@ngInject*/
    constructor($scope, $timeout, lodash, droolsConstants, droolsFactory, providerFactory, droolsModel, kLoadingService, kMessageService,
        $uibModalInstance, kModalService, filterProviderModel) {
        
        this.$scope = $scope;
        this.lodash = lodash;
        this.$timeout = $timeout;
        this.droolsModel = droolsModel;
        this.droolsFactory = droolsFactory;
        this.kModalService = kModalService;
        this.kMessageService = kMessageService;
        this.providerFactory = providerFactory;
        this.droolsConstants = droolsConstants;
        this.kLoadingService = kLoadingService;
        this.$uibModalInstance = $uibModalInstance;
        this.filterProviderModel = filterProviderModel;

        this.newProviders = [];
        this.initializeGrids();
        
    }

    /**
     * inicializa variables
     */
    initializeGrids() {
        //se inicializa filtros de busqueda
        this.filterProviderModel = new FilterProviderModel();
        //se inicializa grid de proveedores
        this.providerFactory.initializeGrids();
    }

    /**
     * buscar proveedores
     */
    findProviders($event){
        if(($event.type === 'keyup' && $event.keyCode == 13) || $event.type === 'click') {
            this.kMessageService.hide();
            this.providerFactory.firstFind(this.filterProviderModel);
        }
    }

    /**
     * Se obtiene el numero del registro correspondiente
     */
    getNumber(index){
        let total = null;
        total = this.droolsConstants.SETTINGS.NUM_ROWS * (this.providerFactory.gridApi.grid.options.paginationCurrentPage - 1) + index;
        return total;
    }

    /**
     * valida los proveedores seleccionados
     */
    selected(row){
        if(row.entity.seleccionar){
            this.newProviders.push(row.entity);
        }else{
            //eliminar proveedores de la lista
            var index = this.newProviders.indexOf(row.entity);
            this.newProviders.splice(index, 1);
        }
    }

    /**
     * se agrega la lista de proveedores al grid
     */
    accept(){
        //si existen registros arma el grid
        if(this.lodash.isEmpty(this.droolsModel.gridOptionsDrools.data)){
            this.droolsFactory.loadColumns(this.droolsModel.typeAlert.id);
        }
        //verifica si existe el proveedor en la lista original 
        angular.forEach(this.newProviders, (row) => {
            let providerExist = this.lodash.find(this.droolsModel.gridOptionsDrools.data, (pro) => {
                return row.codigo.trim() === pro.group.split('-')[0];
            });
            //si no existe en la lista lo agrega
            if(this.lodash.isUndefined(providerExist)){
                let newProvider = {};
                newProvider.group = row.codigo + '-' + row.ruc + '-' + row.nombre;
                newProvider.typeAlert = this.droolsModel.typeAlert.id;
                newProvider.modified = true;
                this.droolsModel.gridOptionsDrools.data.push(newProvider);
            } 
        });
        //cerrar modal
        this.cancel();
   }

    /**
     * cancelar
     */
    cancel() {
		this.$uibModalInstance.dismiss('cancel');
	}

    /**
     * obtener el grid
     */
    getGridOptions(){
        return this.providerFactory.getGridOptions();
    }
}
export default ModalProviderDroolsController;