import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, ResponseWrapper, UserData } from '../../shared';
import { EventBus } from '../../shared/model/functions';
import { HOST } from '../../shared/model/request-util';
import { Agence } from '../agence/agence.model';
import { CreditComity } from './credit-comity.model';

@Injectable()
export class CreditComityService {
    private resourceUrl = HOST + '/api/credit-comities';
    private resourceSearchUrl = HOST + '/api/_search/credit-comities';
    private listeDossierUrl = HOST + '/api/client/liste-dossiers';
    private ficheDossierUrl = HOST + '/api/report/comity/fiche-dossier';
    private ficheDossierComityUrl = HOST + '/api/client/liste-dossier-pre-comity'
    private ficheDossierComityMemberUrl = HOST +
        '/api/report/comity/dossier-comity-membre';
    private ficheOrdreUrl = HOST +
        '/api/report/client/report-fiche-client-groupe';
    private comitySyntheseUrl = HOST + '/api/client/synthese-credit-comity';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    syntheseCreditComity(id) {
        const options = createRequestOption();
        options.params.set('credit_comity_id', id);

        return this.http.get(`${HOST}/api/client/synthese-credit-comity`, options);
    }

    showDossierComityPV(id: any): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('credit_comity_id', '' + id);
        
        return this.http
            .get(this.ficheDossierComityUrl, options)
            .map((res: Response) => {
                return res.json();
            });
    }

    showSynthese(id: any) {
        const options = createRequestOption();
        
        options.params.set('credit_comity_id', '' + id);
        
        return this.http
            .get(this.comitySyntheseUrl, options)
            .map((res: Response) => {
                return res.json();
            });


    }

    showDossier(id: any): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('credit_comity_id', '' + id);
        
        return this.http
            .get(this.listeDossierUrl, options)
            .catch((res: Response) => {
                if (res.status == 401)
                    EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res);
            })
            .map((res: Response) => {
                return res.json().map((i) => {
                    if (i.code_type_client === 'INDIVIDU') {
                        i.nbr_membre = 1;
                    }

                    return i;
                });
            });
    }

    showFicheDossier(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('dossier_id', '' + id);
        
        return this.http
            .get(this.ficheDossierUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    showFicheDossierComityMember(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('dossier_id', '' + id);
        
        return this.http
            .get(this.ficheDossierComityMemberUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    showFicheOrdre(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('dossier_id', '' + id);
        
        return this.http
            .get(this.ficheOrdreUrl, options)
            .catch((res: Response) => {
                if (res.status == 401)
                    EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res);
            })
            .map((res: Response) => {
                return res.json();
            });
    }

    create(creditComity: CreditComity): Observable<CreditComity> {
        const copy = this.convert(creditComity);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(creditComity: CreditComity): Observable<CreditComity> {
        const copy = this.convert(creditComity);
        copy.delegationComity = null;
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<CreditComity> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true, sort: "id,desc" })
        );
        let userdata = UserData.getInstance();
        let sfdRef = userdata.currentSfdReference || userdata.sfd;
        options.params.set('sfdReference.equals', sfdRef);
        return this.http.get(this.resourceUrl, options).catch((res: Response) => { 
            if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);
             return Observable.throw(res); }).map((res: Response) => {
            let responseWrapper: ResponseWrapper = this.convertResponse(res);
            if (!userdata.listeAgences || !userdata.listeAgences.length) {
                console.log(userdata);
                console.log("no user agence");
                return responseWrapper;
            }
            let json = responseWrapper.json;
            json = json.filter((creditComity: CreditComity) => {
                return this.userInCreditComitiesAgences(creditComity);
            });
            responseWrapper.json = json;
            return responseWrapper;
        });
    }
    userInCreditComitiesAgences(comity: CreditComity): boolean {
        let check: boolean = false;
        let userData = UserData.getInstance();
        console.log(userData);
        console.log("user in credit");
        comity.agences.forEach((agence: Agence) => {
            if (userData.agencesReference.indexOf(agence.codeAgence) != -1) {
                console.log("user in credit true");
                check = true;
                return;
            }
        });
        return check;
    }
    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    public convertItemFromServer(entity: any) {
        entity.startDate = this.dateUtils.convertLocalDateFromServer(
            entity.startDate
        );
        entity.endDate = this.dateUtils.convertLocalDateFromServer(
            entity.endDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(creditComity: CreditComity): CreditComity {
        const copy: CreditComity = Object.assign({}, creditComity);
        copy.startDate = this.dateUtils.convertLocalDateToServer(
            creditComity.startDate
        );
        copy.endDate = this.dateUtils.convertLocalDateToServer(
            creditComity.endDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            creditComity.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            creditComity.lastModifiedDate
        );
        return copy;
    }
}
