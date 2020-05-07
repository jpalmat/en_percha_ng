/*import {ResponseTypeEnum} from 'kCommon/lib';
import {ArchivoImpresion} from 'kPrinter/lib';
*/
let scopeCrtl;
class HeaderSearchController {
	constructor(reportsFactory,reportsModel,kLoadingService,kMessageService,layoutFactory) {
		'ngInject';
		scopeCrtl = this;
		this.reportsModel = reportsModel;
		this.layoutFactory = layoutFactory;
		this.reportsFactory = reportsFactory;
		this.kLoadingService = kLoadingService;
		this.kMessageService = kMessageService;
	}
}

export default HeaderSearchController;
