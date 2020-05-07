import angular from 'angular';
import HeaderSearchTemplate from './views/headerSearch.tpl';
import SideBarSearchTemplate from './views/sidebarSearch.tpl';
import ContentSearchTemplate from './views/contentSearch.tpl';
import DetailAlertTemplate from './views/modalDetailAlert.tpl';
import kLayout from 'kLayout';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import { kSearch } from 'kSearch';
import 'angular-ui-grid';
import 'angular-google-chart/angular-google-chart';

let reportsModule = angular.module('app.home.reports', [
	HeaderSearchTemplate.name,
	SideBarSearchTemplate.name,
	ContentSearchTemplate.name,
	DetailAlertTemplate.name,
	kLayout.name,
	kMessage.name,
	kLoading.name,
	kSearch.name,
	kMessage.name, 'googlechart',
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.autoResize',
	'ui.grid.moveColumns',
	'ui.grid.resizeColumns'
]);

reportsModule.config(($stateProvider, kServiceProvider, kRouteProvider) => {
	let parent = kRouteProvider.parent();
	kServiceProvider.$registry('maxArticulosService');
	kServiceProvider.$registry('local-ws');
	kServiceProvider.$registry('inventoriesWs', 'inventoriesWs');
	kServiceProvider.$registry('reportes', 'reportes');
	$stateProvider
		.state(`${parent}reports`, {
			url: 'reports',
			views: {
				'header@ini.home': {
					templateUrl: HeaderSearchTemplate.name,
					controller: 'headerSearchController',
					controllerAs: 'headerSearch'
				},
				'left@ini': {
					templateUrl: SideBarSearchTemplate.name,
					controller: 'sidebarSearchController',
					controllerAs: 'sidebarSearch'
				},
				'center@ini': {
					templateUrl: ContentSearchTemplate.name,
					controller: 'contentSearchController',
					controllerAs: 'contentSearch'
				}
			}
		});
});

export default reportsModule;
