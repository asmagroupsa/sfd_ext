
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { JhiDateUtils } from 'ng-jhipster';

import { OperationComptable } from './operation-comptable.model';
import { ResponseWrapper, createRequestOption, HOST } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class OperationComptableService {
  private resourceUrl = HOST + '/api/operation-comptables';
  private resourceSearchUrl = HOST + '/api/_search/operation-comptables';
  private listeOperationUrl = HOST + '/api/operation/liste-operation';

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}
  listeOperations(compte: any,req?:any): Observable<ResponseWrapper> {
    const options = createRequestOption({compte,NO_QUERY:true,...req});
    return this.http
      .get(this.listeOperationUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  }
  create(
    operationComptable: OperationComptable
  ): Observable<OperationComptable> {
    const copy = this.convert(operationComptable);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  update(
    operationComptable: OperationComptable
  ): Observable<OperationComptable> {
    const copy = this.convert(operationComptable);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<OperationComptable> {
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
      .get(this.resourceSearchUrl, options).catch((res: Response) => {    
             if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
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
    entity.date = this.dateUtils.convertLocalDateFromServer(entity.date);
  }

  private convert(operationComptable: OperationComptable): OperationComptable {
    const copy: OperationComptable = Object.assign({}, operationComptable);
    copy.date = this.dateUtils.convertLocalDateToServer(
      operationComptable.date
    );
    return copy;
  }
}
