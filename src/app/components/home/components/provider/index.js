import './assets/css/providers.css!';

import providerModule from './providerModule';
import {KLayoutFactory} from 'kLayout/lib';
//import LayoutController from './controllers/LayoutController';

//Models
import ProviderModel from './models/ProviderModel';
providerModule.value('providerModel', new ProviderModel());

//Factories
import ProviderFactory from './factories/ProviderFactory';
providerModule.factory('providerFactory', ProviderFactory.instance);
//providerModule.factory('actionsLayout', () => new KLayoutFactory());

//Services
import ProviderService from './services/ProviderService';
providerModule.service('providerService', ProviderService);

//Controllers
import ContentProviderController from './controllers/ContentProviderController';
import SideBarProviderController from './controllers/SideBarProviderController';
import HeaderProviderController from './controllers/HeaderProviderController';
providerModule.controller('contentProviderController', ContentProviderController);
providerModule.controller('sideBarProviderController', SideBarProviderController);
providerModule.controller('headerProviderController', HeaderProviderController);

export default providerModule;