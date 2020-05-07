class LayoutController {
  constructor(layoutFactory, kConstantFactory, homeModel) {
    'ngInject';
    
    //layoutFactory.renderLeft(false);
    this.homeModel = homeModel;
    this.layoutFactory = layoutFactory;

    // let constantes = kConstantFactory.$getConstantSync('access');
  }
}

export default LayoutController;