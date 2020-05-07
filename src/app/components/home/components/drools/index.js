import droolsModule from './droolsModule';

//models
import DroolsModel from './models/DroolsModel';
droolsModule.factory('droolsModel', () => new DroolsModel());

import FilterUsersModel from './models/FilterUsersModel';
droolsModule.factory('filterUsersModel', () => new FilterUsersModel());

import FilterProviderModel from './models/FilterProviderModel';
droolsModule.factory('filterProviderModel', () => new FilterProviderModel());

// services
import DroolsService from './services/DroolsService';
droolsModule.service('droolsService', DroolsService);

//Factories
import {KLayoutFactory} from 'kLayout/lib';
droolsModule.factory('layoutFactory',() => new KLayoutFactory());

import DroolsFactory from './factories/DroolsFactory';
droolsModule.factory('droolsFactory', DroolsFactory.instance);

import ComercialLineFactory from './factories/ComercialLineFactory';
droolsModule.factory('comercialLineFactory', ComercialLineFactory.instance);

import UserFactory from './factories/UserFactory';
droolsModule.factory('userFactory', UserFactory.instance);

import ProviderFactory from './factories/ProviderFactory';
droolsModule.factory('providerFactory', ProviderFactory.instance);

import ValidationFactory from './factories/ValidationFactory';
droolsModule.factory('validationFactory', ValidationFactory.instance);

//controllers
import DroolsController from './controllers/DroolsController';
droolsModule.controller('droolsController', DroolsController);

import LeftDroolsController from './controllers/LeftDroolsController';
droolsModule.controller('leftDroolsController', LeftDroolsController);

import HeaderDroolsController from './controllers/HeaderDroolsController';
droolsModule.controller('headerDroolsController', HeaderDroolsController);

import ModalDroolsController from './controllers/ModalDroolsController';
droolsModule.controller('modalDroolsController', ModalDroolsController);

import ModalUserDroolsController from './controllers/ModalUserDroolsController';
droolsModule.controller('modalUserDroolsController', ModalUserDroolsController);

import ModalComLineDroolsController from './controllers/ModalComLineDroolsController';
droolsModule.controller('modalComLineDroolsController', ModalComLineDroolsController);

import ModalProviderDroolsController from './controllers/ModalProviderDroolsController';
droolsModule.controller('modalProviderDroolsController', ModalProviderDroolsController);

import ModalTimeAlertDroolsController from './controllers/ModalTimeAlertDroolsController';
droolsModule.controller('modalTimeAlertDroolsController', ModalTimeAlertDroolsController);

import ModalCausesDroolsController from './controllers/ModalCausesDroolsController';
droolsModule.controller('modalCausesDroolsController', ModalCausesDroolsController);

//Directives
import './directives/comercialLineDirective';

export default droolsModule;