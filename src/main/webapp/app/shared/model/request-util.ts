import { NgForm } from '@angular/forms';
import { BaseRequestOptions, URLSearchParams } from '@angular/http';

import { createQueries, EventBus, parseJwt } from './functions';
import { UserData } from './singleton';

declare let window: any;
declare let navigator: any;

let SERVER = "DEV";
let BASE_URL;
let CARMES_HOST_URL = '';
let BASE_URL_MVN;
// let FILE_URL;
let ENABLE_RESSOURCE: boolean = true;
export const DYNAMIC_BASE_URL_FLAG = true;
export let CARMES_HOST = 'http://carmes.groupasma.com:9711';
//export const cross_origin_URL = "https://asmagroupsa.sqoin.space";
//export const CROSS_ORIGIN = "http://sfd.ads-inter.com:9003,http://sfd.ads-inter.com";
export const CROSS_ORIGIN = "http://sfd.ads-inter.com:9003,http://sfd.ads-inter.com,http://servicebailleurs.ads-inter.com:8282,http://bailleurs.ads-inter.com:9000,http://bailleurs.ads-inter.com";


if(SERVER !== "PROD"){
    if (window.location.hostname != 'localhost' && DYNAMIC_BASE_URL_FLAG)
        BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://185.98.137.71';
        //BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://services.ads-inter.com';
        // BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://dev.groupasma.com';
        // BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://dev.groupasma.com';
    else {
      //  BASE_URL_MVN = BASE_URL = 'http://dev.groupasma.com';
    }
}

//let FILE_URL =  'http://lab.groupasma.com:8787/fileupload/';
let FILE_URL =  ' http://185.98.137.71:9000/api/files/fileupload/';
switch (SERVER) {
    case "PROD":
        FILE_URL = "http://afs.sygmacarmes.com:8787/fileupload/";
        // FILE_URL = "https://afs.sygmacarmes.com:8888/fileupload/";
        BASE_URL = "https://service.sygmacarmes.com";
        BASE_URL_MVN = "https://sfd.sygmacarmes.com";
        CARMES_HOST_URL = "http://carmes.groupasma.com:3000";
        ENABLE_RESSOURCE = true;
        break;
    case "LAB":
        BASE_URL_MVN = BASE_URL = 'http://lab.groupasma.com';
        // FILE_URL =  `${BASE_URL}:8787/fileupload/`;
        ENABLE_RESSOURCE = true;
        //CARMES_HOST_URL = "http://carmes.groupasma.com:3000";
        CARMES_HOST_URL = "http://carmes.groupasma.com:4001";
        CARMES_HOST = CARMES_HOST + '/lab';

        break;
    case "DEVEXPRESS":
        BASE_URL_MVN = BASE_URL = 'http://devexpress.groupasma.com';
        CARMES_HOST_URL = "http://carmes.groupasma.com:4002";

        break;
    case "DEV":
        console.log("tesssst")
        BASE_URL_MVN = BASE_URL = 'http://185.98.137.71';
        //BASE_URL_MVN = BASE_URL = 'http://services.ads-inter.com';
        // BASE_URL_MVN = BASE_URL = 'http://dev.groupasma.com';
        //FILE_URL =  'http://lab.groupasma.com:8787/fileupload/';
        CARMES_HOST_URL = "http://carmes.groupasma.com:4002";
        CARMES_HOST = CARMES_HOST + '/dev';

        break;

    default:
        break;
}

if(SERVER !== "PROD"){
    if (window.location.hostname != 'localhost' && DYNAMIC_BASE_URL_FLAG)
        BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://185.98.137.71';
        //BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://services.ads-inter.com';
        // BASE_URL_MVN = BASE_URL = (window.location.protocol + '//' + window.location.hostname) || 'http://dev.groupasma.com';
    else {
      //  BASE_URL_MVN = BASE_URL = 'http://dev.groupasma.com';
    }
}

// BASE_URL = 'http://172.16.100.216';
// BASE_URL = 'http://172.16.100.215';
//ASE_URL = 'http://dev.groupasma.com';
//BASE_URL = 'http://devexpress.groupasma.com';
//BASE_URL = 'http://lab.groupasma.com';
// export let HOST_MVN = 'https://sfd.sygmacarmes.com:8383';
// export let HOST = 'https://service.sygmacarmes.com:8181';
//export let HOST_MVN = 'http://dev.groupasma.com:8383';
export const CARMES_URL = CARMES_HOST_URL;
export const enableResourcesControl = ENABLE_RESSOURCE;
export const inactivityTime = 1000*60*10;
//servicesfd.ads-inter.com:8383
//serviceinfos.ads-inter.com:8181
// export let HOST_MVN = "http://servicesfd.ads-inter.com" + ':8383';
export let HOST_MVN = 'http://185.98.137.71:8989';
// export let HOST = "http://serviceinfos.ads-inter.com" + ':8181';
export let HOST = 'http://185.98.137.71:8787';



//export let HOST_MVN = "http://172.16.100.218" + ':8383';
//export let HOST = "http://172.16.100.218" + ':8181';

export const FILEURL: string = `${FILE_URL}`;
//export const FILEURL: string = `${FILE_URL}api/files/`;
export const READFILEURL: string = FILE_URL + 'uploads/';
//export const READBITFILEURL: string = FILE_URL + 'api/files/';
export const READBITFILEURL: string = 'http://185.98.137.71:9000/uploads/';

let countRequest: number = 0;
export const LOCAL_FLAG = false;
export const NUMERIC_FLAG = false;
export const createRequestOption = (req?: any): BaseRequestOptions => {
    const options: BaseRequestOptions = new BaseRequestOptions();
    const params: URLSearchParams = new URLSearchParams();
    if (req) {
        if (req.page) params.set('page', req.page);
        if (req.size) params.set('size', req.size);
        if (req.sort) {
            req.sort = Array.isArray(req.sort) ? req.sort.join(',') : req.sort;
            req.sort = req.sort.replace(/asc/i, 'desc');
            params.set('sort', req.sort);
        }
        if (req.query) params.set('query', req.query);
        let queries: any = req;
        if (!req.NO_QUERY) queries = Object.assign({}, req, createQueries());
        for (let param in queries) {
            if (
                ['page', 'size', 'sort', 'query', 'NO_QUERY'].indexOf(param) ==
                -1
            ) {
                if (queries[param]) params.set(param, queries[param]);
            }
        }
        options.params = params;
    }
    options.params = params;
    if(!options.params.has('country_id')){
      let countryId = UserData.getInstance().countryId || 1;
      options.params.set('country_id',countryId);
    }
    options.headers.append('accept', '*/*');
    options.headers.append(
        'Access-Control-Allow-Headers',
        'X-Total-Count, Link'
    );
    options.headers.append('Access-Control-Allow-Origin', CROSS_ORIGIN);

    let token =
        window.sessionStorage.getItem('jhi-authenticationtoken') ||
        window.localStorage.getItem('jhi-authenticationtoken');
    if (!token) {
        EventBus.publish('NOT_AUTHORIZED', true);
    }
    let parsedToken = parseJwt(token);
    if (!parsedToken) {
        EventBus.publish('NOT_AUTHORIZED', true);
    } else if (new Date(parsedToken.auth * 1000) < new Date()) {
        EventBus.publish('NOT_AUTHORIZED', true);
    }
    if (token) {
        token = token.replace(/^["']/, '');
        token = token.replace(/["']$/, '');
        options.headers.append('Authorization', 'Bearer ' + token);
    }
    if (!navigator.onLine) {
        countRequest++;
        if (countRequest == 3) {
            alert(
                "Veuillez vérifier votre connexion internet, vous n'êtes pas connecté à l'internet"
            );
            countRequest = 0;
        }
    }
    return options;
};

export const getUniqueId = (
    prefix: string | number = '0',
    suffix: string | number = '0'
) => {
    /* var uuid = '-xxx-xxx-xxxx-4xxx-'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }); */
    return '' + Date.now();
};
export function updateForm(editForm: NgForm) {
    for (let controlName in editForm.controls) {
        editForm.controls[controlName].markAsDirty();
    }
}
export function getToken() {
    let token =
        window.sessionStorage.getItem('jhi-authenticationtoken') ||
        window.localStorage.getItem('jhi-authenticationtoken');
    return token;
}
export function setToken(token: string) {
    window.sessionStorage.setItem('jhi-authenticationtoken', token);
}
export function sendFileToServer(file, callback?: Function) {
    let token =
        window.sessionStorage.getItem('jhi-authenticationtoken') ||
        window.localStorage.getItem('jhi-authenticationtoken');

    if (token) {
        let fd = new FormData();
        fd.append('file', file);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', FILEURL);
        token = token.replace(/^["']/, '');
        token = token.replace(/["']$/, '');
        //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        //xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.onload = () => {
            if (xhr.status == 200) {
                if (callback) callback(xhr.response);
            }
        };
        xhr.send(fd);
    }
}
export function sendSMS(
    numero: string,
    msg: string = '',
    callback: Function = () => { }
) {
    if (!numero || !msg) return;
    let http = new XMLHttpRequest();
    let url = CARMES_HOST + '/carte_puce/appSms.php';
    var params = `action=SMS&num=${numero}&msg=${msg}`;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    //http.setRequestHeader('accept', '*/*');
    //http.setRequestHeader('Access-Control-Allow-Origin', '*');
    http.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded; charset=UTF-8'
    );
    http.onreadystatechange = function () {
        //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            callback(http.responseText);
        }
    };
    http.send(params);
}
export function queryInfosCarmes(cpteCarmes: string, sucessCallback?: Function, errorCallback?: Function) {
    let fd = new FormData();
    //fd.append('action', "ref");
    //fd.append('ref', cpteCarmes);
    fd.append('action', "getUserID");
    fd.append('usrAccount', cpteCarmes);
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.overrideMimeType("application/json");
    let url = CARMES_HOST + '/carte_puce/appGetUserCompletId.php';
    //url = 'http://164.160.142.15:9711/carte_puce/appCarte.php';
    xhr.open('POST', url);
    //xhr.onloadend = function(e){
    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                if (xhr.response || true == true) {
                    if (sucessCallback) sucessCallback(xhr.response);
                } else {
                    if (errorCallback) errorCallback(xhr.response);
                }
            } else if (errorCallback) errorCallback(xhr.response);
        }
    });
    xhr.send(fd);
}

//var string = 'Hello World!';

// Encode the String
//var encodedString = btoa(string);

// Decode the String
//var decodedString = atob(encodedString);
