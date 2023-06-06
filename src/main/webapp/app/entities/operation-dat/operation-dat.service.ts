import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { OperationDat } from './operation-dat.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { EventBus } from '../../shared/model/functions';


@Injectable()
export class OperationDatService {
    private resourceUrl = HOST + '/api/sfd/liste-operation-dat';
    private resourceSearchUrl = HOST + '/api/_search/account-types';
    private resourceDatUrl = HOST + '/api/sfd/ouverture-compte-dat';
    private resourceDepotCaisseUrl = HOST + '/api/sfd/depot-caisse';
    private resourceRuptureCaisseUrl = HOST + '/api/sfd/retrait-caisse';
   private resourceEncaissementUrl = HOST + '/api/sfd/encaissement-divers';
    private resourceDecaissentUrl = HOST + '/api/sfd/decaissement-divers';

    constructor(private http: Http) { }

    ouvertureCompteDat(operationDat: OperationDat): Observable<any> {
       
        const options = createRequestOption({
            dateechu: this.formatDate(operationDat.dateechu),
            comptecarmescaisse: operationDat.comptecarmescaisse,
            montant: operationDat.montant,
            comptecarmesclient: operationDat.comptecarmesclient,
            produitid: operationDat.produitId,
            email: operationDat.email,
            phone: operationDat.telephone,
            sexe: operationDat.sexe,
            typeClientid: operationDat.typeClientId,
            agence_reference: operationDat.agenceReference,
            profession_id: operationDat.professionId,
            birthday: this.formatDate(operationDat.birthDate),
            nomClient: operationDat.nomClient,
            nationalite_id: operationDat.nationalityId

        });
        return this.http
            .get(this.resourceDatUrl
                , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                let data = res.json();
                if (data['resultat'] != 'OK') {
                    throw data;
                }
                return data;
            });
    }

    depotCaisse(operationDat: OperationDat): Observable<any> {

        const options = createRequestOption({
            comptecarmescaisse: operationDat.comptecarmescaisse,
            montant: operationDat.montant,
            comptecarmesclient: operationDat.comptecarmesclient,
            created_by: UserData.getInstance().userReference,
            agence_reference: operationDat.agenceReference

        });
        return this.http
            .get(this.resourceDepotCaisseUrl
                , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                let data = res.json();
                if (data['resultat'] != 'OK') {
                    throw data;
                }
                return data;
            });
    }

    ruptureCaisse(operationDat: OperationDat): Observable<any> {

        const options = createRequestOption({
            comptecarmescaisse: operationDat.comptecarmescaisse,
            montant: operationDat.montant,
            comptecarmesclient: operationDat.comptecarmesclient,
            created_by: UserData.getInstance().userReference,
            agence_reference: operationDat.agenceReference

        });
        return this.http
            .get(this.resourceRuptureCaisseUrl
                , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                let data = res.json();
                if (data['resultat'] != 'OK') {
                    throw data;
                }
                return data;
            });
    }


    create(OperationDat: OperationDat): Observable<OperationDat> {
        const copy = this.convert(OperationDat);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                let data = res.json();
                if (data['resultat'] != 'OK') {
                    throw data;
                }
                return data;
            });
    }

    update(OperationDat: OperationDat): Observable<OperationDat> {
        const copy = this.convert(OperationDat);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                let data = res.json();
                if (data['resultat'] != 'OK') {
                    throw data;
                }
                return data;
            });
    }

    find(id: number): Observable<OperationDat> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                let data = res.json();
                if (data['resultat'] != 'OK') {
                    throw data;
                }
                return data;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, {
            NO_QUERY: true,
            'sfdReference.equals': UserData.getInstance().getSFDReference()
        }));
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(OperationDat: OperationDat): OperationDat {
        const copy: OperationDat = Object.assign({}, OperationDat);
        return copy;
    }

    formatDate(date: any): any {
        let month: string;
        let day: string;
        date.month.toString().length == 1 ? month = '0' + date.month : date.month;
        date.day.toString().length == 1 ? day = '0' + date.day : date.day;

        let dateToString = date.year + '-' + month + '-' + day;

        return dateToString;
    }
}
