import './assets/css/visits.css!';

import visitsModule from './visitsModule';

import {KLayoutFactory} from 'kLayout/lib';

//Models
import VisitsModel from './models/VisitsModel';
visitsModule.value('visitsModel', new VisitsModel());

//Factories
import VisitsFactory from './factories/VisitsFactory';
visitsModule.factory('visitsFactory', VisitsFactory.instance);
visitsModule.factory('actionsLayout', () => new KLayoutFactory());

//Services
import VisitsService from './services/VisitsService';
visitsModule.service('visitsService', VisitsService);

//Controllers
import LayoutController from './controllers/LayoutController';
import HeaderVisitController from './controllers/HeaderVisitController';
import LeftVisitController from './controllers/LeftVisitController';
import CenterVisitController from './controllers/CenterVisitController';
visitsModule.controller('layoutController', LayoutController);
visitsModule.controller('headerVisitController', HeaderVisitController);
visitsModule.controller('leftVisitController', LeftVisitController);
visitsModule.controller('centerVisitController', CenterVisitController);

export default visitsModule;