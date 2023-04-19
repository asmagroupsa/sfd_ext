
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Phase } from './phase.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class PhaseService {
  private resourceUrl = HOST + '/api/phases';
  private resourceSearchUrl = HOST + '/api/phases';

  constructor(private http: Http) { }

  create(phase: Phase): Observable<Phase> {
    phase.sfdReference = UserData.getInstance().getSFD().code;
    const copy = this.convert(phase);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(poste: Phase): Observable<Phase> {
    const copy = this.convert(poste);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<Phase> {
    const options = createRequestOption();
    return this.http
      .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(
      Object.assign({}, {
        NO_QUERY: true,
        'sfdReference.equals': UserData.getInstance().getSFD().code,
      }, req)
    );
    return this.http
      .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => this.convertResponse(res));
  }

  queryAll(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(
      Object.assign({}, {
        NO_QUERY: true,
        'sfdReference.equals': UserData.getInstance().getSFD().code,
      }, req)
    );
    return this.http
      .get(this.resourceUrl + '/all', options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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

  private convert(poste: Phase): Phase {
    const copy: Phase = Object.assign({}, poste);
    return copy;
  }
}
