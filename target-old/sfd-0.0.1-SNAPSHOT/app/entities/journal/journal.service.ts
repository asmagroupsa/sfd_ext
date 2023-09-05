
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Journal } from './journal.model';
import { ResponseWrapper, createRequestOption, HOST } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class JournalService {
  private resourceUrl = HOST + '/api/journals';
  private resourceSearchUrl = HOST + '/api/_search/journals';

  constructor(private http: Http) {}

  create(journal: Journal): Observable<Journal> {
    const copy = this.convert(journal);
    return this.http
      .post(this.resourceUrl, copy, createRequestOption())
      .map((res: Response) => {
        return res.json();
      });
  }

  update(journal: Journal): Observable<Journal> {
    const copy = this.convert(journal);
    return this.http
      .put(this.resourceUrl, copy, createRequestOption())
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<Journal> {
    return this.http
      .get(`${this.resourceUrl}/${id}`, createRequestOption())
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
    return this.http.delete(`${this.resourceUrl}/${id}`, createRequestOption());
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

  private convert(journal: Journal): Journal {
    const copy: Journal = Object.assign({}, journal);
    return copy;
  }
}
