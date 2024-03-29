
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { Disponibilite } from './disponibilite.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class DisponibiliteService {
  private resourceUrl = HOST + '/api/disponibilites';
  private disponibleUrl = HOST + '/api/client/liste-disponibiltes';
  private resourceSearchUrl = HOST + '/api/_search/disponibilites';

  constructor(private http: Http) {}
  queryDisponibles(comityId: any): Observable<ResponseWrapper> {
    const options = createRequestOption();
    
    options.params.set('credit_comity_id', '' + comityId);
    
    return this.http
      .get(this.disponibleUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      );
  }
  create(disponibilite: Disponibilite): Observable<Disponibilite> {
    const copy = this.convert(disponibilite);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(disponibilite: Disponibilite): Observable<Disponibilite> {
    const copy = this.convert(disponibilite);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<Disponibilite> {
    const options = createRequestOption();
    return this.http
      .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
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

  private convert(disponibilite: Disponibilite): Disponibilite {
    const copy: Disponibilite = Object.assign({}, disponibilite);
    return copy;
  }
}
