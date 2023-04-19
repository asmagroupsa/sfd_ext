
import { Injectable, OnInit } from '@angular/core';
import {  key } from './config';

import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoCookies implements OnInit {


    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }



 encryptWithPublicKey(valueToEncrypt: string): string {

    let cryptedValue=  CryptoJS.AES.encrypt(valueToEncrypt, key).toString();
    return cryptedValue;
  }

  decryptWithPrivateKey(valueToDecrypt: string): string {

    let decryptedValue="";

    if (valueToDecrypt != undefined && valueToDecrypt!=null){
        decryptedValue = CryptoJS.AES.decrypt(valueToDecrypt, key).toString(CryptoJS.enc.Utf8);
    }
    else{
        decryptedValue = valueToDecrypt
    }


    return decryptedValue;
  }

}
