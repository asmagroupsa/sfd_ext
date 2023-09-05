import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { JhiDateUtils, JhiLanguageService } from 'ng-jhipster';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Observable';

import { ResponseWrapper } from '..';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { Principal } from '../auth/principal.service';
import { EventBus } from '../model/functions';
import { createRequestOption, HOST } from '../model/request-util';
import { UserData } from '../model/singleton';


declare let window: any;
declare let dimmerShow: any;
@Injectable()
export class LoginService {
    credentials: any = {};
    private sfdsUrl = HOST + '/api/s-fds';
    constructor(
        private _cookieService: CookieService,
        private languageService: JhiLanguageService,
        private principal: Principal,
        private authServerProvider: AuthServerProvider,
        private http: Http,
        private dateUtils: JhiDateUtils
    ) { }
    setUSerTime() {
        window.localStorage.removeItem('userTime');
    }
    login(credentials, callback?) {
        const cb = callback || function () { };
        let isReconnecting: boolean = false;
        if (this.credentials['username']) isReconnecting = true;
        credentials['username'] = credentials['username'] || this.credentials['username'];
        this.credentials = credentials;
        return new Promise((resolve, reject) => {
            this.authServerProvider.login(this.credentials).subscribe(
                data => {
                    this.setUSerTime();
                    this.principal
                        .identity(true)
                        .then(account => {
                            if (account !== null) {
                                this.languageService.changeLanguage(
                                    account.langKey
                                );
                            }
                            resolve(data);
                        })
                        .catch(err => {
                            if (!isReconnecting) this.logout().catch(() => { });
                            reject(err);
                            return cb(err);
                        });
                    return cb();
                },
                err => {
                    let body;
                    try {
                        body = JSON.parse(err._body)
                    } catch (error) {
                        body = err;
                    }
                    if (!isReconnecting) this.logout().catch(() => { });
                    reject(body);
                    return cb(body);
                }
            );
        });
    }

    loginWithToken(jwt, rememberMe) {
        return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    logout(state: boolean = false): Promise<any> {
        //dimmerShow();
        return new Promise((resolve, reject) => {
            if (!state) {
                this.principal.setEtatConnexion(false).subscribe(
                    (res: any) => {
                        if (res.resultat == 'OK') {
                            this.clearData();
                            resolve(true);
                        } else {
                            reject(false);
                        }
                        //dimmerShow();
                    },
                    (err: any) => {
                        reject(false);
                        //dimmerShow();
                    }
                );
            } else {
                this.clearData();
                resolve(true);
                //dimmerShow();
            }
        });
    }
    clearData() {
        this._cookieService.remove('tab');
        console.log('cookieService.remove');
        this._cookieService.remove('userIdentity');
        this._cookieService.remove('userdata');
        window.localStorage.removeItem('userTime');
        this._cookieService.remove('userReference');
        this._cookieService.remove('sfdReference');
        this._cookieService.remove('agenceReference');
        this._cookieService.remove('listeAgence');
        this.authServerProvider.logout().subscribe(() => { }, () => { });
        UserData.getInstance().initialize();
        this.principal.authenticate(null);
    }
    querySFDs(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true })
        );
        return this.http
            .get(this.sfdsUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }
    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }
    private convertItemFromServer(entity: any) {
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }
}
