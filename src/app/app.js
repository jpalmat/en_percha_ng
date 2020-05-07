import 'jquery';
import angular from 'angular';
import {KRouter} from 'kCommon';

import futureRoutes from './routes.json!';

let app = angular.module('app', []);

app.config(($urlRouterProvider, $locationProvider, $stateProvider, $httpProvider, kConstantProvider) => {
	//Config enviroment constants
	kConstantProvider.$env('@@env');

	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});

	$httpProvider.useApplyAsync(true);
	$urlRouterProvider.otherwise('/');
});

//Routes
import appRoutes from './appRoutes';
app.config(appRoutes);

//Factories
import {KLayoutFactory} from 'kLayout/lib';
app.factory('layoutFactory', () => new KLayoutFactory());
/*commonModule.factory('superCache', ($cacheFactory) => {
    return $cacheFactory('super-cache');
});*/

import layoutController from './components/common/controllers/LayoutController';
app.controller('layoutController', layoutController);

/**
 * Agregando las rutas del JSON
 */
app.config(KRouter.instance().routing(app, futureRoutes));

/**
 * La siguiente funcion hace que se ejecute la aplicacion
 */
angular.element(document).ready(function () {
	angular.bootstrap(document.body, [app.name], {
		strictDi: false
	});
});

export default app;
