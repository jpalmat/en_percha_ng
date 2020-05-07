import './assets/css/reports.css!';
import './assets/css/detail.css!';

import reportsModule from './reportsModule';

import {KLayoutFactory} from 'kLayout/lib';

//Models
import ReportsModel from './models/ReportsModel';
reportsModule.value('reportsModel', new ReportsModel());
reportsModule.factory('actionsLayout', () => new KLayoutFactory());

//Factories
import ReportsFactory from './factories/ReportsFactory';
import DetailAlertFactory from './factories/DetailAlertFactory';
reportsModule.factory('reportsFactory', ReportsFactory.instance);
reportsModule.factory('detailAlertFactory', DetailAlertFactory.instance);
reportsModule.factory('actionsLayout', () => new KLayoutFactory());

//Services
import ReportsService from './services/ReportsService';
reportsModule.service('reportsService', ReportsService);

//Controllers
import LayoutController from './controllers/LayoutController';
import HeaderSearchController from './controllers/HeaderSearchController';
import SidebarSearchController from './controllers/SidebarSearchController';
import ContentSearchController from './controllers/ContentSearchController';
import ModalDetailAlertController from './controllers/ModalDetailAlertController';
reportsModule.controller('layoutController', LayoutController);
reportsModule.controller('headerSearchController', HeaderSearchController);
reportsModule.controller('sidebarSearchController', SidebarSearchController);
reportsModule.controller('contentSearchController', ContentSearchController);
reportsModule.controller('modalDetailAlertController', ModalDetailAlertController);

//Directives
import CompReportExcelFileDirective from './directive/CompReportExcelFileDirective';
reportsModule.directive('compReportExcelFile', CompReportExcelFileDirective.instance);

//Views
import CompReportExcelFileTemplate from './views/comp-report-excel-file.tpl';
reportsModule.requires.push(CompReportExcelFileTemplate.name);

export default reportsModule;
