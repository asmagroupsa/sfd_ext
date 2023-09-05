import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { CreditMenu } from './credit-menu.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class CreditMenuService {
  private resourceUrl = HOST + '/api/unities';
  private debloqueUrl = HOST + '/api/client/liste-credits?decaisse=true';
  private decaissementUrl = HOST + '/api/request/decaissement-credit';
  private deblocageUrl = HOST + '/api/credit/credit-non-decaisse';
  private resourceSearchUrl = HOST + '/api/_search/unities';
  private ficheUrl = HOST + '/api/report/fiche-credit-client/infos';
  private ficheLigneUrl = HOST + '/api/sfd/fiche-ligne-credit';
  private echeancesLigneUrl = HOST + '/api/sfd/echeances-ligne-credit';
  private echeancesUrl = HOST + '/api/report/fiche-credit-client/echeances';
  private planAmortisUrl = HOST + '/api/util/liste-echeances-simuler';
  constructor(private http: Http) { }

  ficheCreditMember(id: number, c_id: number) {
    return this.http
      .get(`${HOST}/api/report/client/fiche-credit-membre?client_id=${id}&credit_group_id=${c_id}`, createRequestOption())
      .map((res: Response) => this.convertResponse(res));
  }

  echeanceCreditMember(id: number, c_id: number) {
    return this.http
      .get(`${HOST}/api/report/client/echeance-credit-membre?client_id=${id}&credit_group_id=${c_id}`, createRequestOption())
      .map((res: Response) => this.convertResponse(res));
  }

  planAmortis(model: any) {
    const options = createRequestOption();
    const urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('periodicite', model.periodicity);
    urlParams.set('mode_calcul', model.mode);
    urlParams.set('montantpret', model.montant);
    urlParams.set('duree', model.duree);
    urlParams.set('tauxInteret', model.interet);
    urlParams.set('differe', model.differe);
    urlParams.set('cumulInteretDiffere', model.cumul);
    urlParams.set('tauxEpargne', model.epargne);
    urlParams.set('JOURFERIER', model.ferie);
    urlParams.set('periodeGrace', model.grace);
    options.params = urlParams;
    return this.http
      .get(this.planAmortisUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => this.convertResponse(res));
  }
  ficheEcheances(creditId: string) {
    const options = createRequestOption();
    const urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('credit_id', creditId);
    options.params = urlParams;
    return this.http
      .get(this.echeancesUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => this.convertResponse(res));
  }
  ficheClient(creditId: string) {
    const options = createRequestOption();
    const urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('credit_id', creditId);
    options.params = urlParams;
    return this.http
      .get(this.ficheUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => this.convertResponse(res));
  }

  ficheEcheancesLigne(creditId: string) {
    const options = createRequestOption();
    const urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('ligne_credit_id', creditId);
    options.params = urlParams;
    return this.http
      .get(this.echeancesLigneUrl, options)
      .map((res: Response) => this.convertResponse(res));
  }
  ficheLigne(creditId: string) {
    const options = createRequestOption();
    const urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set('ligne_credit_id', creditId);
    options.params = urlParams;
    return this.http
      .get(this.ficheLigneUrl, options)
      .map((res: Response) => this.convertResponse(res));
  }
  /* getDebloquer() {
    const options = createRequestOption();
    return this.http
      .get(this.debloqueUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  } */
  /* getDeblocage() {
    const options = createRequestOption();
    return this.http
      .get(this.deblocageUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  } */
  /* getDecaissement() {
    const options = createRequestOption();
    return this.http
      .get(this.decaissementUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  } */
  create(unity: CreditMenu): Observable<CreditMenu> {
    const copy = this.convert(unity);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(unity: CreditMenu): Observable<CreditMenu> {
    const copy = this.convert(unity);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<CreditMenu> {
    const options = createRequestOption();
    return this.http
      .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
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

  private convert(unity: CreditMenu): CreditMenu {
    const copy: CreditMenu = Object.assign({}, unity);
    return copy;
  }
}
