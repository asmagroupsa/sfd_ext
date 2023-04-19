
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { EcheancierSFD } from './echeancier-sfd.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class EcheancierSFDService {
  private resourceUrl = HOST + '/api/echeancier-sfds';
  private resourceSearchUrl = HOST + '/api/_search/echeancier-sfds';

  constructor(private http: Http, private dateUtils: JhiDateUtils) { }

  create(echeancierSFD: EcheancierSFD): Observable<EcheancierSFD> {
    const copy = this.convert(echeancierSFD);
    const options = createRequestOption();
    return this.http.post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  update(echeancierSFD: EcheancierSFD): Observable<EcheancierSFD> {
    const copy = this.convert(echeancierSFD);
    const options = createRequestOption();
    return this.http.put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  find(id: number): Observable<EcheancierSFD> {
    const options = createRequestOption(); return this.http.get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http
      .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => this.convertResponse(res));
  }

  delete(id: number): Observable<Response> {
    const options = createRequestOption(); return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
  }

  search(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http
      .get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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
    entity.startDate = this.dateUtils.convertLocalDateFromServer(
      entity.startDate
    );
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(
      entity.createdDate
    );
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
      entity.lastModifiedDate
    );
  }

  private convert(echeancierSFD: EcheancierSFD): EcheancierSFD {
    const copy: EcheancierSFD = Object.assign({}, echeancierSFD);
    copy.startDate = this.dateUtils.convertLocalDateToServer(
      echeancierSFD.startDate
    );
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      echeancierSFD.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      echeancierSFD.lastModifiedDate
    );
    return copy;
  }
}
