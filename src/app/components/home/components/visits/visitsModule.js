import angular from 'angular';
import HeaderSearchTemplate from './views/headerSearch.tpl';
import LeftSearchTemplate from './views/leftSearch.tpl';
import CenterSearchTemplate from './views/centerSearch.tpl';
import kLayout from 'kLayout';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import { kSearch } from 'kSearch';
import './assets/config/visitsConstants';
import 'angular-ui-grid';
import 'angular-google-chart/angular-google-chart';
import kPagination from 'kPagination';

let visitsModule = angular.module('app.home.visits', [
	HeaderSearchTemplate.name,
	LeftSearchTemplate.name,
	CenterSearchTemplate.name,
	kLayout.name,
	kMessage.name,
	kLoading.name,
	kSearch.name,
	kMessage.name, 
    kPagination.name,
    'visitsConstantsModule',
    'googlechart',
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.autoResize',
    'ui.grid.pagination',
	'ui.grid.moveColumns',
	'ui.grid.resizeColumns'
]);

visitsModule.config(($stateProvider, kServiceProvider, kRouteProvider) => {
    let parent = kRouteProvider.parent();
    $stateProvider
        .state(`${parent}visits`, {
            url: 'visits',
            views: {
                'header@ini.home': {
                        templateUrl: HeaderSearchTemplate.name,
                        controller: 'headerVisitController',
                        controllerAs: 'headerVisit'
                },
                'left@ini': {
                    templateUrl: LeftSearchTemplate.name,
                    controller: 'leftVisitController',
                    controllerAs: 'leftVisit'
                },
                'center@ini': {
                    templateUrl: CenterSearchTemplate.name,
                    controller: 'centerVisitController',
                    controllerAs: 'centerVisit'
                }
            }
        });

});

export default visitsModule;
