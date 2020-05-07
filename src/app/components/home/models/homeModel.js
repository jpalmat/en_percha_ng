/**
 * Created by crodriguez on 03/06/2016.
 */
class HomeModel {

    constructor() {
        //this.dataCurrentSession = [];
        //this.iFrameUrl = $location.search();
        this._providerCode;
        this._jdeCode;
        this._localCodeProv;
        this._personCodeProv;
        this._userId;
        this._appFrom = null;
        this._isFromMax = false;
        this._isFromB2b = false;
    }
    // existAppFrom(from) {
    //     var flag = false;
    //     if (this._appFrom == from) {
    //         flag = true;
    //     }
    //     return flag;
    // }	

    get isFromB2b() {
        // this._isFromB2b = this.existAppFrom('b2b');
        return this._isFromB2b;
    }

    get isFromMax() {
        // this._isFromMax = this.existAppFrom('max');
        return this._isFromMax;
    }

    get appFrom() {
        return this._appFrom;
    }

    set appFrom(appFrom) {
        this._appFrom = appFrom;
        // this._isFromMax = this.existAppFrom('max');
        // this._isFromB2b = this.existAppFrom('b2b');        
    }

    get localCodeProv() {
        return this._localCodeProv;
    }

    set localCodeProv(localCodeProv) {
        this._localCodeProv = localCodeProv;
    }

    get jdeCode() {
        return this._jdeCode;
    }

    set jdeCode(jdeCode) {
        this._jdeCode = jdeCode;
    }

}

export default HomeModel;