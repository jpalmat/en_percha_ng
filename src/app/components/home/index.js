/**
 * Created by crodriguez on 03/06/2016.
 */
import './assets/css/home.css!';
import homeModule from './homeModule';
//Models
import HomeModel from './models/homeModel';
homeModule.value('homeModel', new HomeModel());

//Factories
import HomeFactory from './factories/HomeFactory';
homeModule.factory('homeFactory', HomeFactory.instance);

//Services
import HomeService from './services/HomeService';
homeModule.service('homeService', HomeService);

//Controllers
import homeIndexController from './controllers/homeIndexController';
homeModule.controller('homeIndexController', homeIndexController);
import homeLayoutController from './controllers/homeLayoutController';
homeModule.controller('homeLayoutController', homeLayoutController);
import headerController from './controllers/headerController';
homeModule.controller('headerController', headerController);

export default homeModule;
