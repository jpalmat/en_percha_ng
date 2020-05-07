import deviceModule from './deviceModule';
import DeviceModel from './models/DeviceModel';
import DeviceFactory from './factories/DeviceFactory';
import {KLayoutFactory} from 'kLayout/lib';
import DeviceService from './services/DeviceService';
//import LayoutController from './controllers/LayoutController';
import HeaderDeviceController from './controllers/HeaderDeviceController';
import './assets/css/device.css!';
import ContentDeviceController from './controllers/ContentDeviceController';
import PopUpDeviceController from './controllers/PopUpDeviceController';

//Models
deviceModule.value('deviceModel', new DeviceModel());

//Factories
deviceModule.factory('actionsLayout', () => new KLayoutFactory());
deviceModule.factory('deviceFactory', DeviceFactory.instance);

//Services
deviceModule.service('deviceService', DeviceService);

//Controllers
//deviceModule.controller('layoutController', LayoutController);
deviceModule.controller('headerDeviceController', HeaderDeviceController);
deviceModule.controller('contentDeviceController', ContentDeviceController);
deviceModule.controller('popUpDeviceController', PopUpDeviceController);

export default deviceModule;