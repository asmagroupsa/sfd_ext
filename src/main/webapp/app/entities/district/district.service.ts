import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { District } from './district.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class DistrictService {
  private resourceUrl = HOST + '/api/districts';
  private resourceSearchUrl = HOST + '/api/_search/districts';

  constructor(private http: Http) {}

  create(district: District): Observable<District> {
    const copy = this.convert(district);
 const options = createRequestOption();
    return this.http.post(this.resourceUrl, copy,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      return res.json();
    });
  }

  update(district: District): Observable<District> {
    const copy = this.convert(district);
 const options = createRequestOption();
    return this.http.put(this.resourceUrl, copy,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      return res.json();
    });
  }

  find(id: number): Observable<District> {
    const options = createRequestOption();   return this.http.get(`${this.resourceUrl}/${id}`,options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       }).map((res: Response) => {
      return res.json();
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
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
    return new ResponseWrapper(res.headers, jsonResponse, res.status);
  }

  private convert(district: District): District {
    const copy: District = Object.assign({}, district);
    return copy;
  }
}
