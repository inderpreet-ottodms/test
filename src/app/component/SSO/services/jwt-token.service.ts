import {
  Injectable
} from '@angular/core';
import * as Crypto from 'crypto-js';

@Injectable()
export class JwtTokenService {

  constructor() {}
  // generateJWTToken(payload)
  // {
  //     let _header = '{"alg":"HS256","typ":"JWT"}';
  //     let _payload = JSON.stringify(payload);


  //     let unsignedToken  = btoa(_header) + '.' + btoa(_payload);
  //     let signature = Crypto.HmacSHA256(unsignedToken, this.key, true);
  //     var hashInBase64 = Crypto.enc.Base64.stringify(signature);

  //     let token = btoa(_header) + '.' + btoa(_payload) + '.' + hashInBase64;

  //     return token;
  // }

  //------------------below code is not in use as we are generating token via encryptJWTToken api ------
  // generateJWTToken(payload) {
  //   debugger;
  //   let header = {
  //     "alg": "HS256",
  //     "typ": "JWT"
  //   };
  //   let stringifiedHeader = Crypto.enc.Utf8.parse(JSON.stringify(header));
  //   let encodedHeader = this.base64url(stringifiedHeader);
  //   let stringifiedData = Crypto.enc.Utf8.parse(JSON.stringify(payload));
  //   let encodedData = this.base64url(stringifiedData);

  //   let token = encodedHeader + "." + encodedData;
  //   let signature = Crypto.HmacSHA256(token, this.key);
  //   let signatureCovert = this.base64url(signature);

  //   return token + "." + signatureCovert;
  // }
  extractDataFromJWT(token) {
    let _token = token;
    let _header = _token.split('.')[0];
    let _payload = atob(_token.split('.')[1]);

    return _payload;

    // let _signature = Crypto.enc.Base64.stringify(_token.split('.')[2]);
  }
  base64url(source) {
    // Encode in classical base64
    let encodedSource = Crypto.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }
}
