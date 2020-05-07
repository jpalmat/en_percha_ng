
export default
($stateProvider) => {
	'ngInject';

  $stateProvider.
    state('ini', {
      controller: 'layoutController',
      controllerAs: 'layout',
      template: `<k-layout api="layout.layoutFactory"></k-layout>`,
      abstract: true
    })
   
};
