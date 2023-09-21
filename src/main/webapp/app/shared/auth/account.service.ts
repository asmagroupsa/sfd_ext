
import { EventBus } from '../model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HOST_MVN, HOST } from '../model/request-util';
import { createRequestOption } from '..';
import { UserData } from '../model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class AccountService {
    constructor(private http: Http) {}

    get(): Observable<any> {
        return this.http
            .get(`${HOST_MVN}/api/account`)
            .map((res: Response) =>{
                return res.json()
            });
    }
    setEtatConnexion(userId: any, etat: any): Observable<any> {
        return this.http
            .get(
                `${HOST_MVN}/api/user/connexion?user_id=${userId}&etat=${etat}`
            )
            .map((res: Response) => {
                return res.json();
            });
    }
    getEtatConnexion(userId: any): Observable<any> {
        return this.http
            .get(`${HOST_MVN}/api/user/etat-connexion?user_id=${227}`)
            .map((res: Response) => {
                return res.json();
            });
    }
    getOnlyRessources(id: any): Observable<any> {
        const options = createRequestOption();
        return this.http
            .get(`${HOST_MVN}/api/user/liste-ressource?user_id=${id}`, options)
            .map((res: Response) => {
                let tabs = [];
                res.json().forEach(element => {
                    tabs.push(element.code);
                });
                return tabs;
            }).retry(3);
    }
    getRessources(id: any): Observable<any> {
        return Observable.create(observer => {
            this.getOnlyRessources(id).subscribe(
                tabs => {
                    UserData.getInstance().ressources = tabs;
                    UserData.getInstance().listeRessourcesState.next(tabs);
                    const options = createRequestOption();
                    this.http
                        .get(
                            `${HOST_MVN}/api/user/liste-ressource-agence?user_id=${id}`,
                            options
                        )
                        .map((res: Response) => {
                            return res.json();
                        }).retry(3)
                        .subscribe(
                            (res: any) => {
                                UserData.getInstance().infos = true;
                                if(!UserData.getInstance().country_id){
                                    UserData.getInstance().country_id = res.country_id;
                                }
                                observer.next(res);
                                observer.complete();
                            },
                            () => {
                                observer.error(null);
                            }
                        );
                },
                () => {
                    observer.error(null);
                }
            );
        });
    }
    save(account: any): Observable<Response> {
        const options = createRequestOption();
        return this.http.post(`${HOST_MVN}/api/account`, account, options);
    }
    getUserAgences(codeAgences: string): Observable<any> {
        if (UserData.getInstance().listeAgences.length) {
            return Observable.create(observer => {
                observer.next(UserData.getInstance().listeAgences);
            });
        }
        if (!codeAgences) {
            return Observable.create(observer => {
                observer.next([]);
            });
        }
        const options = createRequestOption(
            Object.assign(
                {},
                { 'codeAgence.in': codeAgences, size: 1000, NO_QUERY: true }
            )
        );
        return this.http
            .get(`${HOST}/api/agences`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                if (res.json().length == 1)
                    UserData.getInstance().currentAgence = res.json()[0];
                return res.json();
            });
    }
    getUserZones(sfd: any, zoneRef: string) {
        let options = null;
        if (sfd) {
            options = createRequestOption(
                Object.assign({}, { 'sfdId.in': sfd[0].sfdId, NO_QUERY: true })
            );
        } else if (zoneRef) {
            options = createRequestOption(
                Object.assign({}, { 'reference.in': zoneRef, NO_QUERY: true })
            );
        } else {
            return;
        }
        return this.http
            .get(`${HOST}/api/zone-agences`, options)
            .map((res: Response) => {
                return res.json();
            })
            .subscribe(zones => {
                UserData.getInstance().listeZones = zones;
            });
    }
}
