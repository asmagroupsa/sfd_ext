import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Leader } from './leader.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class LeaderService {
  private resourceUrl = HOST + '/api/leaders';
  private resourceSearchUrl = HOST + '/api/_search/leaders';

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}

  create(leader: Leader): Observable<Leader> {
    const copy = this.convert(leader);
 const options = createRequestOption();
    return this.http.post(this.resourceUrl, copy,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  update(leader: Leader): Observable<Leader> {
    const copy = this.convert(leader);
 const options = createRequestOption();
    return this.http.put(this.resourceUrl, copy,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  find(id: number): Observable<Leader> {
    const options = createRequestOption();   return this.http.get(`${this.resourceUrl}/${id}`,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(Object.assign({}, req, {
        NO_QUERY: true
      }));
    return this.http
      .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  }

  delete(id: number): Observable<Response> {
    const options = createRequestOption();   return this.http.delete(`${this.resourceUrl}/${id}`,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
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
    entity.birthDate = this.dateUtils.convertLocalDateFromServer(
      entity.birthDate
    );
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(
      entity.createdDate
    );
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
      entity.lastModifiedDate
    );
  }

  private convert(leader: Leader): Leader {
    const copy: Leader = Object.assign({}, leader);
    copy.birthDate = this.dateUtils.convertLocalDateToServer(leader.birthDate);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      leader.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      leader.lastModifiedDate
    );
    return copy;
  }
}
