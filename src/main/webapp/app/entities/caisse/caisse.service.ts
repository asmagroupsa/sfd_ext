
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HOST } from '../../shared/model/request-util';

import { JhiDateUtils } from 'ng-jhipster';

import { Caisse } from './caisse.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class CaisseService {
  private resourceUrl = HOST + '/api/caisses';
  private resourceSearchUrl = HOST + '/api/_search/caisses';

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}

  create(caisse: Caisse): Observable<Caisse> {
    const copy = this.convert(caisse);
    const options = createRequestOption();
    return this.http.post(this.resourceUrl, copy,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  update(caisse: Caisse): Observable<Caisse> {
    const copy = this.convert(caisse);
    const options = createRequestOption();
    return this.http.put(this.resourceUrl, copy,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  find(id: number): Observable<Caisse> {
      const options = createRequestOption();
    return this.http.get(`${this.resourceUrl}/${id}`,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http
      .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  }

  delete(id: number): Observable<Response> {
      const options = createRequestOption();
    return this.http.delete(`${this.resourceUrl}/${id}`,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
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
    entity.dateOuverture = this.dateUtils.convertLocalDateFromServer(
      entity.dateOuverture
    );
  }

  private convert(caisse: Caisse): Caisse {
    const copy: Caisse = Object.assign({}, caisse);
    copy.dateOuverture = this.dateUtils.convertLocalDateToServer(
      caisse.dateOuverture
    );
    return copy;
  }
}
