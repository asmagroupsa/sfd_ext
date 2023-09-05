import {HOST} from '..';
import {UserData} from './singleton';
import {Response} from '@angular/http';
import { READFILEURL } from './request-util';

export function setLastModifyBy(entity: any, identity): void {
    let userdata = UserData.getInstance();
    entity.lastModifiedBy = `${userdata.userReference}`;
}

export function setCreateBy(entity: any, identity): void {
    let userdata = UserData.getInstance();

    entity.createdBy = `${userdata.userReference}`;
}

export const nameSFD = 'RESSOURCE_SFD';
export const nameZoneAgence = 'RESSOURCE_ZONE_AGENCE';
export const nameAgence = 'RESSOURCE_AGENCE';
export function createQueries(): any {
    let userdata = UserData.getInstance();
    let queries: any = {
        'createdBy.equals': userdata.userReference
    };
    if (
        searchRessource(userdata, nameSFD) ||
        searchRessource(userdata, nameZoneAgence) ||
        searchRessource(userdata, nameAgence)
    ) {
        // if(userdata.agencesReference)
        // queries = { 'agenceReference.in': userdata.agencesReference.join(',') };
        // else queries = {};
        let chaine = '';
        if (userdata.currentAgence != null) {
            chaine = userdata.currentAgence.codeAgence
        } else {
            //chaine = userdata.agencesReference.join(',');
        }
        queries = {'agenceReference.in': chaine};
    }
    return queries;
}
export function searchRessource(userData: UserData, name: string) {
    return userData.ressources.indexOf(name) != -1;
}
export function formatNumberToLocalString(event) {
    let toNumber = localStringToNumber(event);
    return !isNaN(toNumber) ? toNumber.toLocaleString() : '';
}

export function localStringToNumber(localeString) {
    return parseInt(`${localeString}`.replace(/\D+/gi, ''), 10);
}

export let EventBus = {
    topics: {},

    subscribe: function (topic, listener) {
        // create the topic if not yet created
        if (!this.topics[topic]) this.topics[topic] = [];

        // add the listener
        this.topics[topic].push(listener);
    },

    publish: function (topic, data) {
        // return if the topic doesn't exist, or there are no listeners
        if (!this.topics[topic] || this.topics[topic].length < 1) return;

        // send the event to all listeners
        this.topics[topic].forEach(function (listener) {
            listener(data);
        });
    }
};

export function setDotContains(req: any, properties: string[], v: any) {
    for (let p of properties) {
        req[`${p}.contains`] = v;
    }

    return req;
}

export function numberToLocalStringTonumber(val: string) {
    return parseFloat(val.replace(/[ ]/g, ''));
}

export function numberToLocalString(val: string): string {
    val = val.replace(',', '.');

    const isNegative = val.indexOf('-') === 0;
    const negativeTag = isNegative ? '-' : '';
    let nToStringToPositive = val;

    if (isNegative) {
        nToStringToPositive = nToStringToPositive.substring(1, val.length);
    }

    let integerPart = nToStringToPositive;
    let decimalPart = '';

    if (/\./.test(nToStringToPositive)) {
        const decimalTagIndex = nToStringToPositive.indexOf('.');

        decimalPart = `.${nToStringToPositive.substring(decimalTagIndex, nToStringToPositive.length).replace(/[^0-9]/g, '')}`;
        integerPart = nToStringToPositive.substring(0, decimalTagIndex);
    }

    if (integerPart.length > 3) {
        integerPart = integerPart.replace(/[^0-9]/g, '').split('').reverse().join('').replace(/([0-9]{3})/g, `$1 `).trim().split('').reverse().join('');

        if (integerPart.indexOf(' ') === 0) {
            integerPart = integerPart.substring(1, integerPart.length);
        }
    }

    return `${negativeTag}${integerPart}${decimalPart}`;
}

export function parseJwt(token): any {
    if (!token) return null;
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    try {
        return JSON.parse(window.atob(base64));
    } catch (e) {
        return null;
    }
}

export function getNewItems(tab1: any[], tab2: any[]): any[] {
    return tab2.filter((i) => !tab1.find((i_) => i.id === i_.id));
}

export function getImgSrc(url: string): string {
    return url && url.length > 0 ? READFILEURL+ ""+ url : '';
}

export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export function getAgenceRef(): string {
    let agenceRef;
    if (UserData.getInstance().currentAgence) {
        agenceRef = UserData.getInstance().currentAgence.codeAgence;
    } else if (UserData.getInstance().agencesReference && UserData.getInstance().agencesReference.length) {
        agenceRef = UserData.getInstance().agencesReference[0];
    } else if (UserData.getInstance().listeAgences && UserData.getInstance().listeAgences.length) {
        agenceRef = UserData.getInstance().listeAgences[0].codeAgence;
    }
    return agenceRef;
}
export function getUserRefOrChaineAgence(type?: ParamsType): string[] {
    let param: string[];
    if (type == ParamsType.USER_REFERENCE) {
        return ['user_reference', UserData.getInstance().userReference];
    }
    if (type == ParamsType.CHAINE_AGENCE ||
        searchRessource(UserData.getInstance(), nameSFD) ||
        searchRessource(UserData.getInstance(), nameZoneAgence) ||
        searchRessource(UserData.getInstance(), nameAgence)
    ) {
        let chaine = '';
        if (UserData.getInstance().currentAgence != null) {
            chaine = UserData.getInstance().currentAgence.codeAgence
        } else {
            chaine = UserData.getInstance().agencesReference.join('*');
        }
        param = ['chaineAgence', chaine];
    } else {
        param = ['user_reference', UserData.getInstance().userReference];
    }
    return param;
}
export enum ParamsType {CHAINE_AGENCE, USER_REFERENCE}

export function resultatOKFn(r: Response) {
    const resultat = r.json().resultat;

    if (resultat !== 'OK') {
        throw resultat;
    }
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

