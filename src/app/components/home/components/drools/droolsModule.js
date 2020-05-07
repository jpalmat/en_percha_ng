import './assets/css/drools.css!';
import './assets/css/comline.css!';
import './assets/css/users.css!';
import './assets/css/provider.css!';
import './assets/css/time.css!';
import './assets/css/causes.css!';

import angular from 'angular';
import HeaderDroolsTemplate from './views/headerSearch.tpl';
import DroolsModifyTemplate from './views/droolsModify.tpl';
import LeftDroolsModifyTemplate from './views/leftDroolsModify.tpl';
import GroupsTemplate from './views/modalDrools.tpl';
import UserTemplate from './views/modalUserDrools.tpl';
import ComLineTemplate from './views/modalComLineDrools.tpl';
import ProviderTemplate from './views/modalProviderDrools.tpl';
import TimeAlertTemplate from './views/modalTimeAlertDrools.tpl';
import CausesTemplate from './views/modalCausesDrools.tpl';
import kLayout from 'kLayout';
import kMessage from 'kMessage';
import kLoading from 'kLoading';
import {kSearch} from 'kSearch';
import kPagination from 'kPagination';
import kModal from 'kModal';
import 'angular-ui-grid';
import './assets/config/droolsConstants';

let droolsModule = angular.module('app.home.drools', [
    LeftDroolsModifyTemplate.name,
    HeaderDroolsTemplate.name,
    DroolsModifyTemplate.name,
    TimeAlertTemplate.name,
    CausesTemplate.name,
    ProviderTemplate.name,
    ComLineTemplate.name,
    GroupsTemplate.name,
    UserTemplate.name,
    kPagination.name,
    kMessage.name,
	kMessage.name,
	kLoading.name,
    kLayout.name,
	kSearch.name,
    kModal.name,
	'ui.grid',
	'ui.grid.edit',
    'ui.grid.treeView',
    'ui.grid.pagination',
    'ui.grid.moveColumns',
    'ui.grid.resizeColumns',
    'droolsConstantsModule'
]);

droolsModule.config(($stateProvider, kServiceProvider, kRouteProvider) => {
    let parent = kRouteProvider.parent();
    $stateProvider
            .state(`${parent}drools`, {
                url: '/drools',
                views: {
                   'header@ini.home': {
                        templateUrl: HeaderDroolsTemplate.name,
                        controller: 'headerDroolsController',
                        controllerAs: 'headerDrools'
                    },
                    'left@ini': {
                        templateUrl: LeftDroolsModifyTemplate.name,
                        controller: 'leftDroolsController',
                        controllerAs: 'leftDroolsController'
                    },
                    'center@ini': {
                        templateUrl: DroolsModifyTemplate.name,
                        controller: 'droolsController',
                        controllerAs: 'droolsController'
                    }
                }
            });

});
export default droolsModule;