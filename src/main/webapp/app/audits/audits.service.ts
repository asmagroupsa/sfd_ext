import { HOST, HOST_MVN } from '../shared/model/request-util';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { ResponseWrapper, createRequestOption, UserData } from '../shared';
import {
    searchRessource,
    nameSFD,
    nameZoneAgence,
    nameAgence,
    EventBus
} from '../shared/model/functions';

@Injectable()
export class AuditsService {
    private resourceReportUrl = HOST + '/api/sfd/effectif-sfd-client';
    private effectifReportUrl = HOST + '/api/sfd/effectif-utilisateur';
    private resourceAgenceUrl = HOST + '/api/agences';
    private agenceShortStateUrl = HOST + '/api/report/liste-agence-short-state'
    private listUsereportUrl = HOST_MVN + '/api/user/liste-utilisateur-agence'
    private userInfosUrl = HOST_MVN + '/api/user/liste-ressource-agence'
    private userTokenUrl = HOST_MVN + '/api/account'

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    getUserToken(): Observable<any> {
        const options = createRequestOption();
       
        return this.http
            .get(this.userTokenUrl, options)
            .map((res: Response) => {
                return res.json();
            });
    }
    userInfos(userId: string): Observable<any> {
        const options = createRequestOption();
       options.params.set('user_id', userId);
        return this.http
            .get(this.userInfosUrl, options)
            .map((res: Response) => {
                return res.json();
            });
    }
    reportSfdUtilisateur(userReference?: string, chaineAgence?: string): Observable<any> {
        const options = createRequestOption();
        let param;
        if (
            searchRessource(UserData.getInstance(), nameZoneAgence) ||
            searchRessource(UserData.getInstance(), nameAgence)
        ) {
            param = [
                'chaineAgence',
                UserData.getInstance().agencesReference.join('*')
            ];
        } else if (searchRessource(UserData.getInstance(), nameSFD)) {
            param = ["", ""];
        } else {
            param = ['user_reference', UserData.getInstance().userReference];
        }

        options.params.set(param[0], param[1]);
        return this.http
            .get(this.effectifReportUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) => {
                    return res.json();
                }
                /* new ResponseWrapper(res.headers, res.json(), res.status) */
            );
    }

    reportSfdAgence(chaineAgence?: string, user_reference?: string): Observable<any> {
        const options = createRequestOption();

        if (chaineAgence != undefined) {
            options.params.set('chaineAgence', chaineAgence);
        } else if (user_reference != undefined) {
            options.params.set('user_reference', user_reference);
        }

        
        return this.http
            .get(this.effectifReportUrl, options)
            .map(
                (res: Response) => {
                    return res.json();
                }
            );
    }

    listUserAgence(agenceReference: string): Observable<any> {
        const options = createRequestOption();
        options.params.set('agence_reference', agenceReference);
        
        return this.http
            .get(this.listUsereportUrl, options)
            .map(
                (res: Response) => {
                    return res.json();
                }
                /* new ResponseWrapper(res.headers, res.json(), res.status) */
            );
    }

    reportShortStateAgences(sfdReference: string): Observable<any> {
        const options = createRequestOption();
        options.params.set('sfd_reference', sfdReference);
       
        return this.http
            .get(this.agenceShortStateUrl, options)
            .map((res: Response) => {
                return res.json()
            })
    }


    reportSfdClient(sfdId: string): Observable<any> {
        const options = createRequestOption();
        options.params.set('sfd_id', sfdId);
        return this.http
            .get(this.resourceReportUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json()
            })

    }

    queryAgence(id: string): Observable<any> {

        const options = createRequestOption();
        let param;
        return this.http
            .get(`${this.resourceAgenceUrl}/${id}`, options)
            .map(
                (res: Response) => {
                    return res.json();
                }
            );
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

    private convert(data: any): any {
        const copy: any = Object.assign({}, data);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            data.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            data.lastModifiedDate
        );
        return copy;
    }
}