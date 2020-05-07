
class DroolsModel {
    constructor(){
        this.typeAlert; //almacena el valor seleccionado del combo de tipos de alertas
        this.stage; //en el caso que haya seleccionado alerta tipo 4, almacena el valor del escenario
        this.gridOptionsDrools = {}; //grid de la busqueda de ajustes
        
        this.gridUsersToDrools = {}; //grid para lista para usuarios To
        this.gridUsersCcDrools = {}; //grid para lista para usuarios Cc

        this.groupSelectedTo = '';  //almacena el grupo seleccionado del combo en el popup de agregar
        this.groupSelectedCc = ''; //almacena el grupo seleccionado del combo en el popup de agregar
        this.fieldSelected = ''; //almacena el campo seleccionado del combo en el popup de agregar
        this.indexGrid = undefined; //almacena el indice de la fila seleccionada del grid de no orden no bodega
        this.radioToCc = ''; //almacena el valor del radio de gestion o lectura
        this.titleModal; //indica el titulo del modal para determinar si agrega o modifica un tipo de alerta
        this.groupsInactive = []; //almacena una lista de grupos eliminados en pantalla
        this.newCausesList = []; // almacena una lista de nuevas causas por guardar
    }
}

export default DroolsModel;