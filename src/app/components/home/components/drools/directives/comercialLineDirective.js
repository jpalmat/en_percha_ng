import droolsModule from '../droolsModule';

/*
* Valida el ingreso de solo caracteres numericos en el id linea comercial
*/
function validNumber() {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}

function normalize() {
    let from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
    for(let i = 0, j = from.length; i < j; i++ ) {
        mapping[ from.charAt( i ) ] = to.charAt( i );
    }
    return function( str, element, attr, ngModelCtrl ) {
        let ret = [];
        for( let i = 0, j = attr.length; i < j; i++ ) {
            let c = attr.charAt( i );
            if( mapping.hasOwnProperty( attr.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }      
        return ret.join( '' );
    }
}

// function normalize() {
//     console.log('normalizeeeee');
//     let from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
//       to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
//       mapping = {};
 
//   for(let i = 0, j = from.length; i < j; i++ )
//       mapping[ from.charAt( i ) ] = to.charAt( i );
 
//   return function( str ) {
//       console.log('str',str);
//       let ret = [];
//       for( let i = 0, j = str.length; i < j; i++ ) {
//           let c = str.charAt( i );
//           if( mapping.hasOwnProperty( str.charAt( i ) ) )
//               ret.push( mapping[ c ] );
//           else
//               ret.push( c );
//       }      
//       return ret.join( '' );
//   }
// }


droolsModule.directive('validNumber', validNumber);
droolsModule.directive('normalize', normalize);

export default droolsModule;