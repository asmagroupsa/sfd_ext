
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { TauxEpargne } from './taux-epargne.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class TauxEpargneService {
  private resourceUrl = HOST + '/api/taux-epargnes';
  private resourceSearchUrl = HOST + '/api/_search/taux-epargnes';

  constructor(private http: Http) {}

  create(tauxEpargne: TauxEpargne): Observable<TauxEpargne> {
    const copy = this.convert(tauxEpargne);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(tauxEpargne: TauxEpargne): Observable<TauxEpargne> {
    const copy = this.convert(tauxEpargne);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<TauxEpargne> {
    const options = createRequestOption();
    return this.http
      .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(Object.assign({}, req, {
      NO_QUERY: true,
      'sfdReference.equals': UserData.getInstance().getSFDReference()
    }));
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

  private convert(tauxEpargne: TauxEpargne): TauxEpargne {
    const copy: TauxEpargne = Object.assign({}, tauxEpargne);
    return copy;
  }
}
