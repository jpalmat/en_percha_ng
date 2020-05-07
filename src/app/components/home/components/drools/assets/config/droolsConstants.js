import angular from 'angular';

function DroolsConstants() {

    let constants = {

        SERVICE: {
            URL_USER_LOC: 'http://svr-mj18pxd:8880/fluxServices/contact/findByCriteriaElastic',
            URL_USER_PRE: 'https://aplpre.favorita.ec/fluxServices/contact/findByCriteriaElastic',
            URL_USER_QA: 'https://aplcalidad.favorita.ec/fluxServices/contact/findByCriteriaElastic',
            URL_USER_PRO: 'https://www.cfavorita.ec/fluxServices/contact/findByCriteriaElastic'
        },
        TITLES: {
            DROOLS: ''
        },
        SETTINGS: {
            NUM_ROWS: 20, //numero de filas a cargar
            LAST_PAGE: 1, //indica la pagina que inicia
        },

        TIME_ALERT:[{
            id: '300',
            name: 'Hora(s)'
        },
        {
            id: '301',
            name: 'Día(s)'
        },{
            id: '302',
            name: 'Mes(es)'
        }],
        
        TYPES_ALERT: [{
            id : 1, 
            name : '(1) PERCHA VACIA - SURTIR PERCHA'
        }, 
        {
            id : 3, 
            name : '(3) PERCHA VACIA - PEDIDO BODEGA'
        }, 
        {
            id : 4, 
            name : '(4) PERCHA VACIA'
        }, 
        {
            id : 6, 
            name : '(6) INCONSISTENCIA DE PRECIO - CAMBIO CENEFA'
        }, 
        {
            id : 9, 
            name : '(9) CANTIDAD INSUFICIENTE - SURTIR PERCHA',
        },
        {
            id : 11, 
            name : '(11) CANTIDAD INSUFICIENTE - SURTIR PERCHA',
        }, 
        {
            id : 12, 
            name : '(12) CANTIDAD INSUFICIENTE',
        }, 
        {
            id : 13, 
            name : '(13) VIGENCIA DE PRODUCTO - VERIFICAR PRODUCTO'
        },
        {
            id : 14,
            name : '(14) FALTA CENEFA - COLOCAR CENEFA'
        },
        {
            id : 15,
            name : '(15) FALTA CENEFA PROMOCION - COLOCAR CENEFA'
        },
        {
            id : 20,
            name : 'PROVEEDORES SANCIONADOS'
        },
        {
            id : 0, 
            name : 'TIEMPOS DE ALERTA'
        },
        {
            id : 21, 
            name : 'PARTICIPANTES POR DEFECTO'
        },
        {
            id : 22, 
            name : 'CAUSAS'
        }],

        STAGES: [{
            id: 30, 
            name: '4. NO ORDEN - NO BODEGA',
            fullName: 'PEDIDO PROVEEDOR - NO ORDEN - NO BODEGA'
        },
        {
            id: 31, 
            name: '4. SI ORDEN - NO BODEGA',
            fullName: 'ENTREGAR PRODUCTO - SI ORDEN - NO BODEGA'
        },
        {
            id: 32, 
            name: '4. NO ORDEN - SI BODEGA',
            fullName: 'PEDIDO BODEGA - NO ORDEN - SI BODEGA'
        }],

         STAGES_TWELVE: [{
            id: 40, 
            name: '12. NO ORDEN - NO BODEGA',
            fullName: 'PEDIDO PROVEEDOR - NO ORDEN - NO BODEGA'
        },
        {
            id: 41, 
            name: '12. SI ORDEN - NO BODEGA',
            fullName: 'ENTREGAR PRODUCTO - SI ORDEN - NO BODEGA'
        },
        {
            id: 42, 
            name: '12. NO ORDEN - SI BODEGA',
            fullName: 'PEDIDO BODEGA - NO ORDEN - SI BODEGA'
        }], 

        GROUPS: [{
            code: 'Group.LOCAL',
            name: 'GRUPO LOCAL'
        },{
            code: 'Group.ADMIN_LOCAL',
            name: 'USUARIO ADMINISTRADOR DE LOCAL'
        }, {
            code: 'Group.ADMIN_PROVIDER',
            name: 'USUARIO ADMINISTRADOR DEL PROVEEDOR'
        }, {
            code: 'Group.COMERCIAL_LINE_USER',
            name: 'GRUPO COMERCIAL'
        }],

        FIELDS: [{
            code: 'Field.TO',
            name: 'PARA (TO)'
        },{
            code: 'Field.CC',
            name: 'CON COPIA (CC)'
        }],
        
        MESSAGES: {
            NO_RESULTS: 'No se encontraron registros para la opci&#243;n seleccionada.',
            NO_RESULTS_FILTER: 'No se encontraron registros para los filtros ingresados, por favor verifique.',
            GROUP_EXIST: 'Ya existe un grupo con la misma informaci&#243;n, verifique.',
            LINE_COM_EXIST: 'Ya existe una l&#237;nea comercial con la misma informaci&#243;n, verifique.',
            GROUP_EMPTY: 'Debe seleccionar al menos un destinatario, verifique.',
            ID_LINE_COM: 'Debe agregar un Id para guardar la l&#237;nea comercial, verifique.',
            ADD_TO: 'Debe seleccionar al menos un destinatario en la secci&#243;n Para, verifique.',
            ADD_CC: 'Debe seleccionar al menos un destinatario en la secci&#243;n Con copia, verifique.',
            CONFIRM_CHANGE: 'Al cambiar de opci\u00F3n se perder\u00E1 los cambios realizados. ¿Desea continuar?',
            CONFIRM_SAVE: '¿Desea guardar los cambios realizados?',
            CONFIRM_RESTORE: '¿Desea restablecer la informaci\u00f3n en pantalla?',
            ERROR_SAVE: 'Debe tener al menos un registro en pantalla para guardar la informaci\u00F3n, verifique.',
            INFO_SAVE: 'La informaci\u00f3n se ha registrado exitosamente.',
            ERROR_SAVE_CAUSE: 'Hubo problemas al guardar la informaci\u00F3n.',
            CAUSE_DEFECT: 'La causa seleccionada no se puede eliminar.',
            CAUSE_EMPTY: 'Debe ingresar un nombre de causa, verifique.',
            NO_NEW_CAUSE: 'No existen cambios en pantalla para guardar.',
            ADD_INFO_SUCCESS: 'La informaci&#243;n se ha agregado correctamente.'
        }
    };
    return constants;
}

let droolsConstantsModule = angular.module('droolsConstantsModule', []);
droolsConstantsModule.constant('droolsConstants', DroolsConstants());
