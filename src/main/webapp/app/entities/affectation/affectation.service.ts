import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Affectation } from './affectation.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class AffectationService {
  private resourceUrl = HOST + '/api/affectation';
  private cpUrl = HOST + '/api/sfd/liste-charge-pret';
  private clientsAffectesUrl = HOST + '/api/client/liste-client-transferer-user';
  private affecteUnClient = HOST + '/api/client/affectation-client';
  private affecteUnDossier = HOST + '/api/client/affectation-dossier';
  private affecteUnAgent = HOST + '/api/sfd/affectation-marchand';
  private dossiersAffectesUrl = HOST + '/api/client/liste-dossier-transferer-user';
  private agentsAffectesUrl = HOST + '/api/sfd/liste-marchand-cp';
  private deleteAffectationsUrl = HOST + '/api/affectation';
  private resourceSearchUrl = HOST + '/api/_search/affectation';
  private marchandUrl: string = HOST + '/api/sfd/liste-marchand-agence';
  private listeMarchandAffectationUrl: string = HOST + '/api/sfd/liste-marchand-affectation';
  constructor(private http: Http, private dateUtils: JhiDateUtils) { }
  queryCP(agence?: string): Observable<ResponseWrapper> {
    const options = createRequestOption();
    if (agence) {
      options.params.set('agence_reference', agence);
    } else {
      options.params.set('sfd_reference', UserData.getInstance().currentSfdReference || UserData.getInstance().sfd);
    }
    return this.http
      .get(this.cpUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
  }
  queryMarchand(agence?: string, status: boolean = false): Observable<ResponseWrapper> {
    const options = createRequestOption();
    if (agence) {
      options.params.set('agence_reference', agence);
      
    }
    options.params.set('status', `${status}`);
    if(UserData.getInstance().sfd_){
        options.params.set('indice',UserData.getInstance().sfd_.indicePrestataire);
        }

    return this.http
      .get(status ? `${HOST}/api/sfd/liste-marchand-affecter-enroler-agence` : this.marchandUrl, options)
      .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
  }
  listeMarchandAffectation(agence?: string, status: boolean = true): Observable<ResponseWrapper> {
    const options = createRequestOption();
    if (agence) {
      options.params.set('agence_reference', agence);
    }
    if(UserData.getInstance().sfd_){
        options.params.set('indice',UserData.getInstance().sfd_.indicePrestataire);
        }
    options.params.set('status', `${status}`);
    return this.http
      .get(this.listeMarchandAffectationUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
  }
  deleteAffectation(type: string, cp: any, id: any) {
    const options = createRequestOption();
    options.params.set('cp', cp);
    let param: any[] = [];
    if (type == 'client') param = ['client', id];
    else if (type == 'dossier') param = ['dossier', id];
    else if (type == 'agent') param = ['agent', id];
    options.params.set(param[0], param[1]);
    return this.http.delete(`${this.deleteAffectationsUrl}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
  }
  queryAffectations(type: string, cp?: any, agence?: string): Observable<ResponseWrapper> {
    const options = createRequestOption();
    agence = agence || UserData.getInstance().agence || UserData.getInstance().agencesReference[0];
    options.params.set('agence_reference', agence);
    options.params.set('created_by', cp);
    options.params.set('reference_cp', cp);
    if(UserData.getInstance().sfd_){
        options.params.set('indice',UserData.getInstance().sfd_.indicePrestataire);
        }
    let url = '';
    if (type == 'client') url = this.clientsAffectesUrl;
    else if (type == 'dossier') url = this.dossiersAffectesUrl;
    else if (type == 'agent') url = this.agentsAffectesUrl;
    return this.http
      .get(url, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
  }

  create(affectation: Affectation, type: string): Observable<any> {
    const copy = this.convert(affectation);
    const options = createRequestOption(Object.assign({}, affectation, { NO_QUERY: true }));
    let url = '';
    if (type == 'client') url = this.affecteUnClient;
    else if (type == 'dossier') url = this.affecteUnDossier;
    else if (type == 'agent') url = this.affecteUnAgent;
    return this.http
      .get(url, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        return jsonResponse;
      });
  }

  update(affectation: Affectation): Observable<Affectation> {
    const copy = this.convert(affectation);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<Affectation> {
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
    const options = createRequestOption(
      Object.assign({}, req, {
        NO_QUERY: true
      })
    );
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

  private convert(affectation: Affectation): Affectation {
    const copy: Affectation = Object.assign({}, affectation);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      affectation.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      affectation.lastModifiedDate
    );
    return copy;
  }
}
