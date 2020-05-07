class HomeFactory {
    constructor(kLoadingService, kMessageService, $timeout, homeService, layoutFactory){
        this.$timeout = $timeout;
        this.homeService = homeService;
        this.layoutFactory = layoutFactory;
        this.kLoadingService = kLoadingService;
        this.kMessageService = kMessageService;
    }

    static instance(kLoadingService, kMessageService, $timeout, homeService, layoutFactory){
       return new HomeFactory(kLoadingService, kMessageService, $timeout, homeService, layoutFactory); 
    }

    /**
     * consultar usuario en sesion
     */
    getSession(stringDireccion){
        let profileId;
        let optionId;
        let companyId;
        let systemId;
        let userId;
        let callback = 'angular.callbacks._0';

        if(stringDireccion[1]){
            let stringParametro = stringDireccion[1].split('&');
            for (var i = 0; i < stringParametro.length; i++ ){
                switch(i){
                    case 2:
                        optionId = stringParametro[i].split('=')[1];
                        break;
                    case 3:
                        userId = stringParametro[i].split('=')[1];
                        break;
                    case 4:
                        companyId = stringParametro[i].split('=')[1];
                        break;
                    case 5:
                        systemId = stringParametro[i].split('=')[1];
                        break;
                    case 6:
                        profileId = stringParametro[i].split('=')[1];
                        break;
                }
            }
            // crear parametros de busqueda
            let params = {profileId: profileId, optionId: optionId, companyId: companyId,
                                         systemId: systemId, userId: userId, callback: callback};
            
            // consultar usuario en sesion
            this.homeService.getSession(params).success((data)=> {
                this.$timeout(()=>{
                    this.layoutFactory.loginInfo = {
                        businessFormat: data.footer.businessFormat,
                        date: data.footer.date,
                        user: data.footer.user,
                        workArea: data.footer.workArea,
                        profile: data.footer.profile
                    };
                }, 10);
            }).error((e)=> {
                console.log(e);
                //this.kMessageService.showError(e);
                this.kLoadingService.hide();
            });
        }

    }
}

export default HomeFactory;