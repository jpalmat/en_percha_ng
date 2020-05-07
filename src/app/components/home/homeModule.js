/**
 * Created by crodriguez on 03/06/2016.
 */
import angular from 'angular';

import indexTpl from './views/index.tpl';
import headerTemplate from './views/header.tpl';

import {KRouter} from 'kCommon';
import futureRoutes from './routes.json!';
import kMessage from 'kMessage';
import {kSearch} from 'kSearch';
import kLayout from 'kLayout';
import KLoading from 'kLoading';
import kModal from 'kModal';
import kContainer from 'kContainer';
//import homeMessage from '../common/resources/messages/auditoriaEnRecepcionMessage.js';

let homeModule = angular.module('app.home', [
	indexTpl.name,
	headerTemplate.name,
	kMessage.name,
	kSearch.name,
	kLayout.name,
	KLoading.name,
	kModal.name,
	kContainer.name
	//commonModule.name,
	
]);

homeModule.config(($stateProvider, kServiceProvider, kLoadingProvider) => {
	kServiceProvider.$registry('inventoriesWs', 'inventoriesWs');
	kServiceProvider.$registry('datosCorporativo');

	//configuracion KLoading
	/* kLoadingProvider.$config({
	 logo: '/assets/img/maxico.png',
	 message: 'Cargando...'
	 });*/

	//i18nConstants.DEFAULT_LANG = 'es';

	//registrar recurso de mensajes
	//kMessageProvider.$registry(homeMessage);
	$stateProvider.
		state('ini.home', {
			url: '/',
			controller: 'homeLayoutController',
			controllerAs: 'homeLayoutController',
			views: {
				'header@ini': {
					templateUrl: headerTemplate.name,
					controller: 'headerController',
					controllerAs: 'headerCtrl'
				},
				'center@ini': {
					templateUrl: indexTpl.name,
					controller: 'homeIndexController',
					controllerAs: 'homeController'
				}	
			}
	});
});

homeModule.config(KRouter.instance().routing(homeModule, futureRoutes));

export default homeModule;
