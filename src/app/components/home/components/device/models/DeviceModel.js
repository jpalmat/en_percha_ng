import {BaseSearchTemplate} from 'kSearch/lib';

class DeviceModel {

	constructor() {
        //this.filters = new BaseSearchTemplate('tradeMark','model','imei','userFullName','versionSO','state','so');
        this._providerCode = '';
        this._tradeMark = [];
		this._model = '';
		this._versionSO = '';
		this._so = [];
        this._device=[];

		/*this._state = [
            {'@id': {value: true}, label: 'Activo'},
            {'@id': {value: false}, label: 'Inactivo'},
        ];*/
    }

    get providerCode(){
        return this._providerCode;
    }

    set providerCode(providerCode){
        this._providerCode = providerCode;
    }

    get tradeMark(){
        return this._tradeMark;
    }

    set tradeMark(tradeMark){
        this._tradeMark = tradeMark;
    }
    
    get model(){
        return this._model;
    }

    set model(model){
        this._model = model;
    }

    get versionSO(){
        return this._versionSO;
    }

    set versionSO(versionSO){
        return this._versionSO = versionSO;
    }
    
    get so(){
        return this._so;
    }
    
    set so(so){
        return this._so = so;
    }

    get state(){
        return this._state;
    }
    
    set state(state){
        return this._state = state;
    }
    

}

export default DeviceModel;