import angular from 'angular';

function VisitsConstants() {

    let constants = {
    
        SETTINGS: {
           NUM_ROWS: 20, //numero de filas a cargar en cada paginacion
           LAST_PAGE: 1, //indica la pagina para iniciar el scroll infinito
        },
        MESSAGES: {
            NO_RESULTS_FILTER: 'No se encontraron registros para los filtros ingresados, por favor verifique.',
        },
    };

    return constants;
}

let visitsConstantsModule = angular.module('visitsConstantsModule', []);
visitsConstantsModule.constant('visitsConstants', VisitsConstants());
