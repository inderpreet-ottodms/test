import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {

  key: any;
  iv: any;
  currentDate = new Date();
  newdate: string;
  constructor() {

  }
  // Function to make key 16 digit
  pad(num, size) {
     let s = num + '';
     while (s.length < size) { s = '0' + s; }
     return s;
  }

  encript(input: string) {
      const day = this.currentDate.getDay();
      const month = this.currentDate.getMonth();
      const year = this.currentDate.getFullYear();

      // creating custom key by extracting day, month, year from current date
      this.newdate = day + '' + month + '' + year ;

      // passing new date to add 0 to make it 16 digit long

      this.key = CryptoJS.enc.Utf8.parse(this.pad(this.newdate, 16));
      this.iv = CryptoJS.enc.Utf8.parse(this.pad(this.newdate, 16));

      const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), this.key,
          {
              keySize: 128 / 8,
              iv: this.iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
          });
      return encrypted;
      // return encripted text object
  }
  decript(input: string) {
      const day = this.currentDate.getDay();
      const month = this.currentDate.getMonth();
      const year = this.currentDate.getFullYear();

      this.newdate = day + '' + month + '' + year ;

      this.key = CryptoJS.enc.Utf8.parse(this.pad(this.newdate, 16));
      this.iv = CryptoJS.enc.Utf8.parse(this.pad(this.newdate, 16));
      let orgString = '';
      const decrypted = CryptoJS.AES.decrypt(input, this.key, {
          keySize: 128 / 8,
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      orgString = decrypted.toString(CryptoJS.enc.Utf8);
      return orgString;
      // will return decripted text
  }
  encrypt (input: string) {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), this.key,
    {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
   }
   decrypt (input: string) {
    const decrypted = CryptoJS.AES.decrypt(input, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const orstr = decrypted.toString(CryptoJS.enc.Utf8);
    return orstr;
   }
}
