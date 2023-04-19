import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { IdCardType } from './id-card-type.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class IdCardTypeService {
  private resourceUrl = HOST + '/api/id-card-types';
  private resourceSearchUrl = HOST + '/api/_search/id-card-types';

  constructor(private http: Http) {}

  create(idCardType: IdCardType): Observable<IdCardType> {
    const copy = this.convert(idCardType);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(idCardType: IdCardType): Observable<IdCardType> {
    const copy = this.convert(idCardType);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<IdCardType> {
    const options = createRequestOption();
    return this.http
      .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
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
    return new ResponseWrapper(res.headers, jsonResponse, res.status);
  }

  private convert(idCardType: IdCardType): IdCardType {
    const copy: IdCardType = Object.assign({}, idCardType);
    return copy;
  }
}
