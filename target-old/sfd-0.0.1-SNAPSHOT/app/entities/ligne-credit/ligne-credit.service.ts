import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';
import { UserData } from '../../shared/model/singleton';
import {
    searchRessource,
    nameSFD,
    nameZoneAgence,
    nameAgence
} from '../../shared/model/functions';
import { LigneCredit } from './ligne-credit.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class LigneCreditService {
    private echeancesLigneCreditUrl: string = HOST + '/api/sfd/echeances-ligne-credit';
    private ficheLigneCreditUrl: string = HOST + '/api/sfd/fiche-ligne-credit';
    private resourceUrl = HOST + '/api/ligne-credits';
    private resourceSearchUrl = HOST + '/api/_search/ligne-credits';
    
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    insertLigneCreditLocal(v) {
        const o = createRequestOption();
        o.params = new URLSearchParams;
        o.params.set('libelle', v.libelle);
        o.params.set('amount', v.amount);
        o.params.set('duree', v.duree);
        o.params.set('taux', v.taux);
        o.params.set('mode_calcul', v.mode_calcul);
        o.params.set('preiodicite', v.preiodicite);
        o.params.set('bailleur', v.bailleur);
        o.params.set('differe', v.differe);
        o.params.set('sdf_id', v.sdf_id);
        o.params.set('produit', v.produit);
        o.params.set('created_by', v.created_by);
        o.params.set('chaine_comite', v.chaine_comite.join('*'));

        return this.http.get(HOST + '/api/sfd/insert-ligne-credit-local', o);
    }
    queryComplements(req?): Observable<ResponseWrapper>{
         const options = createRequestOption(Object.assign({},req,{NO_QUERY:true,'sort':'id,desc'}));
        return this.http
            .get(HOST+"/api/complement-lignes", options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }
getLigneComplements(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        options.params.set('sfd_reference', UserData.getInstance().getSFDReference());
        return this.http
            .get(`${HOST}/api/fnm/liste-ligne-credit-complement`, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }
    addComplement(model:any): Observable<any>{
        const options = createRequestOption();
        return this.http
            .post(`${HOST}/api/complement-lignes`, model, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }
    create(ligneCredit: LigneCredit): Observable<LigneCredit> {
        const copy = this.convert(ligneCredit);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(ligneCredit: LigneCredit): Observable<LigneCredit> {
        const copy = this.convert(ligneCredit);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }
    ficheLigneCredit(id: any): Observable<any> {
        const options = createRequestOption();
        options.params.set('ligne_credit_id', id);
        return this.http
            .get(`${this.ficheLigneCreditUrl}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
               /*  const jsonResponse = res.json(); */
                return new ResponseWrapper(res.headers, res.json(), res.status);
               /*  return jsonResponse; */
            });
    }
    echeancesLigneCredit(id: any): Observable<any> {
        const options = createRequestOption();
        options.params.set('ligne_credit_id', id);
        return this.http
            .get(`${this.echeancesLigneCreditUrl}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse;
            });
    }
    find(id: number): Observable<LigneCredit> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        const options = createRequestOption(
            Object.assign({}, req, {
                NO_QUERY: true,
                'sfdReference.equals': sfdRef
            })
        );
        /* options.params.set('sfd_reference', UserData.getInstance().sfd); */
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: any) => this.convertResponse(res));
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

    private convert(ligneCredit: LigneCredit): LigneCredit {
        const copy: LigneCredit = Object.assign({}, ligneCredit);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            ligneCredit.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            ligneCredit.lastModifiedDate
        );
        return copy;
    }

    getLigneRapatriement() {
        
    }
}
