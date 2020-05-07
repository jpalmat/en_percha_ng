import {SearchComponentModel, ComparatorTypeEnum} from 'kSearch/lib';

class VisitsModel {
    constructor(){
        this.local = new SearchComponentModel('local');
        this.state = new SearchComponentModel('state');
        this.user = new SearchComponentModel('user');
        this.date = new SearchComponentModel('date');

        this.firstResult = null;
        this.maxResult = null;
        this.totalNumberReg = null;

        this.codeJde = null;
        this.locales = [];
		this.users = [];

        this.listaEstadoVisita = [
			{'@id': {estado: 'OUT'}, label: 'CADUCADA'},
			{'@id': {estado: 'FAI'}, label: 'CANCELADA'},
            {'@id': {estado: 'END'}, label: 'ENVIADA'},
		];

        //informacion de visitas para archivo excel
		this.reportVisitExcel = ({
			data : []
		});

    }

    clean(){
    }

}

export default VisitsModel;