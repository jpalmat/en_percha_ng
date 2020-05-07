import {SearchComponentModel, ComparatorTypeEnum} from 'kSearch/lib';

class FilterProviderModel {
    constructor(){
        this.providerCode = new SearchComponentModel('providerCode');
        this.providerName = new SearchComponentModel('providerName');
        this.providerRuc = new SearchComponentModel('providerRuc');
        this.providerCode.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);
        this.providerName.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);
        this.providerRuc.setDefaultComparatorTypeEnum(ComparatorTypeEnum.LIKE_ANYWHERE_COMPARATOR);

        this.firstResult = null;
        this.maxResult = null;
        this.totalNumberReg = null;
    }
}

export default FilterProviderModel;