/**
 * jpalma 2017-04-28
 */

class ValidationFactory{
    constructor(kLoadingService, $uibModal, lodash) {

        this.lodash = lodash;
        this.$uibModal = $uibModal;
        this.kLoadingService = kLoadingService;
    }

    /*ngInject*/
    static instance(kLoadingService, $uibModal, lodash) {
        return new ValidationFactory(kLoadingService, $uibModal, lodash);
    }

    dataValidate(data, radioToCc){
        let arrayResp = [];
        if(!this.lodash.isEmpty(data)){
            if(data[0].typeAlert !== 40 && data[0].typeAlert !== 30 && data[0].typeAlert !== 20 
                && data[0].typeAlert !== 21 && data[0].typeAlert !== 22){
                this.hasTo = false;
                this.hasCc = false;
                if(radioToCc === ''){
                    let resp = {};
                    resp['estado'] = false;
                    resp['descripcion'] = 'Debe seleccionar Gesti&#243;n o Lectura';
                    arrayResp.push(resp);
                } else {
                    for(let i = 0; i < data.length; i++){
                        if(!this.hasTo && data[i].field === 'Field.TO'){
                            this.hasTo = true;
                            if(radioToCc === 'lectura'){
                                let resp = {};
                                resp['estado'] = false;
                                resp['descripcion'] = 'Debe eliminar los grupos del Campo TO';
                                arrayResp.push(resp);
                            }
                        }

                        if(!this.hasCc && data[i].field === 'Field.CC'){
                            this.hasCc = true;
                        }
                    }
                    if(!this.hasTo && radioToCc === 'gestion'){
                        let resp = {};
                        resp['estado'] = false;
                        resp['descripcion'] = 'Debe tener al menos un grupo en el Campo TO';
                        arrayResp.push(resp);
                    }
                    if(!this.hasCc && radioToCc === 'lectura'){
                        let resp = {};
                        resp['estado'] = false;
                        resp['descripcion'] = 'Debe tener al menos un grupo en el Campo CC';
                        arrayResp.push(resp);
                    }
                }
            }
        }
        return arrayResp;
    }
}
export default ValidationFactory;