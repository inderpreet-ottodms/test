import * as CryptoJS from 'crypto-js';
import { BrowserStorageUtil } from './shared/browser.storage.util';
export class AppUtil {

    static key = CryptoJS.enc.Utf8.parse('7061737323313233');
    static iv = CryptoJS.enc.Utf8.parse('7061737323313233');

    static isEmptyString(val) {
        if (val) {
            if (val.toString().trim()) {
                return false;
            }
            return true;
        }
        return true;
    }
    static isEmptyBoolean(val) {
        if (val === null || val === undefined || val.toString().trim()) {
            return true;
        }
        return val;
    }
    static isNotEmptyString(val) {
        if (val) {
            if (val.toString().trim().length > 0) {
                return true;
            }
            return false;
        }
        return false;
    }
    static encrypt(input: any) {
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), AppUtil.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    static decrypt(input: any) {
        const decrypted = CryptoJS.AES.decrypt(input, AppUtil.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const orstr = decrypted.toString(CryptoJS.enc.Utf8);
        return orstr;
    }
    static isUserLoggedIn() {
        if (AppUtil.isNotEmptyString(BrowserStorageUtil.getLoogedUserEmail())) {
            return true;
        }
        return false;
    }
    static isEmptyList(val) {
        if (val && val.length > 0) {
            return false;
        }
        return true;
    }
    static isNotEmptyList(val) {
        return !AppUtil.isEmptyList(val);
    }
    static isNotEmptyNumber(numberValue: any) {
        return Number.isInteger(numberValue);
    }
    static areArraysNotIdentical(arr1, arr2) {
        return !AppUtil.areArraysIdentical(arr1, arr2);
    }
    static areArraysIdentical(arr1, arr2) {
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);
        if (set1.size !== set2.size) return false;
        return [...set1].every(value => set2.has(value));
    }
}