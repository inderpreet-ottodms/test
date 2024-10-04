import * as moment from 'moment';
export class BrowserStorageUtil {

    static getCommpanyId() {
        return localStorage.getItem('loggedCompanyId');
    }
    static getLoogedUserEmail() {
        return localStorage.getItem('User2');
    }
    static getLoogedUserId() {
        return parseInt(localStorage.getItem('LoggedId'));
    }
    static isValidatedBuyer() {
        return localStorage.getItem('isEmailVerify');
    }
    static getLoogedUserType() {
        return localStorage.getItem('Usertype');
    }
    static getiContactViewModel() {
        return JSON.parse(localStorage.getItem('iContactViewModel'));
    }
    static getiWillDoLater() {
        return localStorage.getItem("WillDoLater")
    }
    static getiSubmitedRfqCount() {
        return Number(localStorage.getItem("submitRfqCount"));
    }
    static getMixpanelIdentification() {
        return Number(localStorage.getItem("mpi"));
    }
    static setMixpanelIdentification() {
        localStorage.setItem("mpi", localStorage.getItem('LoggedId'));
    }
    static setValueInLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }
    static getItem(key) {
        return localStorage.getItem(key);
    }
    static getJSON(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    // Recursive function to get the value of a key in a nested object
    static getInObj(obj: any, key: string): any {
        if (obj == null || typeof obj !== 'object') {
            return undefined;
        }

        if (obj.hasOwnProperty(key)) {
            return obj[key];
        }

        for (const k in obj) {
            if (obj.hasOwnProperty(k)) {
                const result = BrowserStorageUtil.getInObj(obj[k], key);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined;
    }
    static getLoginSessionEndTime() {
        return Number(localStorage.getItem("loginSessionEndTime"));
    }
    static setLoginSessionEndTime() {
        localStorage.setItem("loginSessionEndTime", moment(moment.utc().toDate()).add(24, 'hours').unix().toString());
    }
    static setRefreshToken(refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
    static getRefreshToken() {
        return  localStorage.getItem("refreshToken");
    }
    static setToken(token) {
        localStorage.setItem("Token", token);
    }
    static getToken() {
        return  localStorage.getItem("Token");
    }
}
