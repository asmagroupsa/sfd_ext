import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { HOST_MVN } from '../../shared/model/request-util';
import { EventBus } from '../../shared/model/functions';
import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleStatut } from './caisse-nouvelle-statut.model';


@Injectable()
export class CaisseNouvelleService {
    private resourceUrl = HOST + '/api/sfd/create-type-retard-credit';
    private resourceSearchUrl = HOST + '/api/_search/account-types';
    private createCaisseUrl = HOST_MVN + '/api/user/add-caisse';
    private getInfosCaisseUrl = HOST + '/api/sfd/liste-caisse-agence';
    private getListeCaisseUrl = HOST + '/api/sfd/liste-caisse-agence';
    private alimenterCaisseAgenceUrl = HOST + '/api/sfd/alimentation-caisse-agence';
    private alimenterCaisseSfdUrl = HOST + '/api/sfd/alimentation-caisse-agence';
    private soldeCaisseUrl = HOST + '/api/sfd/affiche-solde-caisse';
    private statutCaisseUrl = HOST + '/api/sfd/update-caisse-etat';


    
    constructor(private http: Http) {
        EventBus.subscribe('agences', agences => {
            console.log('agences in Caisse Nouvelle',agences);
        });
     }

    //http://185.98.137.71:8989/api/user/add-caisse?name=Caisse2&first_name=Marc&username=AGRAN&tel=965874856&password=admin123&email=jojopo@gmail.com&agence_reference=0000AG43&created_by=121&retraitmax=15000&soldemax=2000&comptecarmes=981421234

    /* create(caisseNouvelle: CaisseNouvelle): Observable<CaisseNouvelle> {
      const copy = this.convert(caisseNouvelle);
      console.log(copy);
      console.log(caisseNouvelle);
      const options = createRequestOption();
      return this.http
        .post(this.createCaisseUrl +
          `name=${copy.libelle}` + `&first_name=${copy.firstname}`
          + `&username=${copy.username}` + `&tel=${copy.telephone}`
          + `&password=${copy.password}` + `&email=${copy.email}`
          + `&agence_reference=${copy.agenceReference}` + `&created_by=${copy.firstname}`
          + `&retraitMaxAmount=${copy.libelle}` + `&soldetMaxAmount=${copy.firstname}` + `&comptecarmes=${copy.compteCarmes}`
        , copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
        .map((res: Response) => {
          return res.json();
        });
    } */

    create(caisseNouvelle: CaisseNouvelle): Observable<CaisseNouvelle> {
        const copy = this.convert(caisseNouvelle);
        console.log(copy);
        console.log(caisseNouvelle);
        const options = createRequestOption();
        options.params.delete('country_id');
        return this.http
            .get(this.createCaisseUrl +
                `name=${copy.libelle}` + `&first_name=${copy.firstname}`
                + `&username=${copy.username}` + `&tel=${copy.telephone}`
                + `&password=${copy.password}` + `&email=${copy.email}`
                + `&agence_reference=${copy.agenceReference}` + `&created_by=${UserData.getInstance().userReference}`
                + `&retraitMax=${copy.retraitMaxAmount}` + `&soldeMax=${copy.soldetMaxAmount}` + `&comptecarmes=${copy.compteCarmes}`
                , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    update(caisseNouvelle: CaisseNouvelle): Observable<CaisseNouvelle> {
        const copy = this.convert(caisseNouvelle);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    find(id: number): Observable<CaisseNouvelle> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    queryTest(agence,req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, {
            NO_QUERY: true,
            agence_reference: agence,
            'sfdReference.equals': UserData.getInstance().getSFDReference()
        }));
        return this.http
            .get(this.getInfosCaisseUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    // http://185.98.137.71:8787/api/sfd/liste-caisse-agence?agence_reference=0000AG13&codecaisse=
    query(req?: any, agence_reference? : any, codeCaisse?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, {
            NO_QUERY: true,
            'sfdReference.equals': UserData.getInstance().getSFDReference()
        }));
        return this.http
            .get(this.getListeCaisseUrl
                + `agence_reference=${agence_reference}`
                + `&codecaisse=${codeCaisse}`
            , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    // http://185.98.137.71:8787/api/sfd/affiche-solde-caisse?comptecarmescaisse=014674251453653
    soldeCaisse(compteCarmesCaisse: number): Observable<any> {
        console.log(compteCarmesCaisse);
        const options = createRequestOption();
        return this.http
            .get(this.soldeCaisseUrl +
                `comptecarmescaisse=${compteCarmesCaisse}`
                , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                console.log(res);
                console.log(res.json());
                return res.json();
            });
    }


    // http://185.98.137.71:8787/api/sfd/update-caisse-etat?id=15&etat=OUVERT
    statutCaisse(caisseNouvelleStatut: CaisseNouvelleStatut): Observable<any> {
        const copy = this.convertStatutCaisse(caisseNouvelleStatut);
        console.log(copy);
        console.log(caisseNouvelleStatut);
        const options = createRequestOption();
        return this.http
            .get(this.statutCaisseUrl +
                `id=${copy.id}` +
                `&etat=${copy.etat}`
                , options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                console.log(res);
                console.log(res.json());
                return res.json();
            });
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

    private convert(caisseNouvelle: CaisseNouvelle): CaisseNouvelle {
        const copy: CaisseNouvelle = Object.assign({}, caisseNouvelle);
        return copy;
    }

    private convertStatutCaisse(caisseNouvelle: CaisseNouvelleStatut): CaisseNouvelleStatut {
        const copy: CaisseNouvelleStatut = Object.assign({}, caisseNouvelle);
        return copy;
    }


}
