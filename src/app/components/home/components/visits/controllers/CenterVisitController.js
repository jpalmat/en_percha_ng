
class CenterVisitController {

    constructor($state, visitsConstants, visitsFactory, homeModel){
        
        this.$state = $state;
        this.homeModel = homeModel;
        this.visitsFactory = visitsFactory;
        this.visitsConstants = visitsConstants;
    }

    /**
     * Genera reporte excel
     */
    downloadFileExcel(){
        this.visitsFactory.firstVisitsForExcel(this.homeModel._jdeCode);
    }

    /**
     * Se obtiene el numero del registro correspondiente
     */
    getNumber(index){
        let total = null;
        total = this.visitsConstants.SETTINGS.NUM_ROWS * (this.visitsFactory.gridApi.grid.options.paginationCurrentPage - 1) + index;
        return total;
    }

    /**
     * se obtiene la informacion del grid
     */
    getGridOptions(){
        return this.visitsFactory.getGridOptions();
    }

}
export default CenterVisitController;