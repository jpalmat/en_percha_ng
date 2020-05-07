import {SearchComponentModel, ComparatorTypeEnum} from 'kSearch/lib';

class UsersModel {
    constructor(){
        this.userCode = new SearchComponentModel('userCode');
        this.userName = new SearchComponentModel('userName');
        this.userCode.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);
        this.userName.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);

        this.companyId = null;
        this.firstResult = null;
        this.maxResult = null;
        this.totalNumberReg = null;
    }
}

export default UsersModel;