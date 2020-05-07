import angular from 'angular';
import HeaderProviderTemplate from './views/headerSearch.tpl';
import ContentProviderTemplate from './views/contentProvider.tpl';
import SideBarProviderTemplate from './views/sideBarProvider.tpl';
import kLayout from 'kLayout';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import { kSearch } from 'kSearch';
import 'angular-ui-grid';
import './assets/config/providerConstants';
import kPagination from 'kPagination';
let providerModule = angular.module('app.home.provider', [
    HeaderProviderTemplate.name,
    ContentProviderTemplate.name,
    SideBarProviderTemplate.name,
    kLayout.name,
    kMessage.name,
    kLoading.name,
    kSearch.name,
    kMessage.name,
    kPagination.name,
    'providerConstantsModule',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.grid.moveColumns',
    'ui.grid.resizeColumns'
]);

providerModule.config(($stateProvider, kServiceProvider, kRouteProvider) => {
    let parent = kRouteProvider.parent();
    $stateProvider
        .state(`${parent}provider`, {
            url: 'provider',
            views: {
                'header@ini.home': {
                        templateUrl: HeaderProviderTemplate.name,
                        controller: 'headerProviderController',
                        controllerAs: 'headerProvider'
                },
                'left@ini': {
                    templateUrl: SideBarProviderTemplate.name,
                    controller: 'sideBarProviderController',
                    controllerAs: 'sideBarProvider'
                },
                'center@ini': {
                    templateUrl: ContentProviderTemplate.name,
                    controller: 'contentProviderController',
                    controllerAs: 'contentProvider'
                }
            }
        });

});
export default providerModule;