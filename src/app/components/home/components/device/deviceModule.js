import angular from 'angular';
import HeaderDeviceTemplate from './views/headerSearch.tpl';
import ContentDeviceTemplate from './views/contentSearch.tpl';
import DeviceRegisterTemplate from './views/deviceRegister.tpl';
import kLayout from 'kLayout';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import {kSearch} from 'kSearch';
import kModal from 'kModal';
import 'angular-ui-grid';

let deviceModule = angular.module('app.home.device', [
	HeaderDeviceTemplate.name,
	ContentDeviceTemplate.name,
    DeviceRegisterTemplate.name,
	kLayout.name,
	kMessage.name,
	kLoading.name,
	kSearch.name,
    kModal.name,
	kMessage.name,
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.autoResize',
	'ui.grid.moveColumns',
	'ui.grid.resizeColumns'
]);

deviceModule.config(($stateProvider, kServiceProvider, kRouteProvider) => {
    let parent = kRouteProvider.parent();
    $stateProvider
            .state(`${parent}device`, {
                url: '/device',
                views: {
                    'header@ini.home': {
                        templateUrl: HeaderDeviceTemplate.name,
                        controller: 'headerDeviceController',
                        controllerAs: 'headerDevice'
                    },
                    'center@ini': {
                        templateUrl: ContentDeviceTemplate.name,
                        controller: 'contentDeviceController',
                        controllerAs: 'contentDevice'
                    }
                }
            });

});
export default deviceModule;
