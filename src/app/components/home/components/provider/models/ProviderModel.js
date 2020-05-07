import {SearchComponentModel, ComparatorTypeEnum} from 'kSearch/lib';

class ProviderModel {
    constructor(){
        this.providerCode = new SearchComponentModel('providerCode');
        this.providerName = new SearchComponentModel('providerName');
        this.providerRuc = new SearchComponentModel('providerRuc');
        this.providerType = new SearchComponentModel('providerType');
        this.providerOrigin = new SearchComponentModel('providerOrigin');
        this.providerCode.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);
        this.providerName.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);
        this.providerRuc.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);

        this.firstResult = null;
        this.maxResult = null;
        this.totalNumberReg = null;
    }
}

export default ProviderModel;