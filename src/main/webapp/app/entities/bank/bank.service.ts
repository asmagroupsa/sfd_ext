
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Bank } from './bank.model';
import { ResponseWrapper, createRequestOption, HOST,UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class BankService {
  private resourceUrl = HOST + '/api/banks';
  private resourceSearchUrl = HOST + '/api/_search/banks';

  constructor(private http: Http) {}

  create(bank: Bank): Observable<Bank> {
    const copy = this.convert(bank);
    return this.http
      .post(this.resourceUrl, copy, createRequestOption())
      .map((res: Response) => {
        return res.json();
      });
  }

  update(bank: Bank): Observable<Bank> {
    const copy = this.convert(bank);
    return this.http
      .put(this.resourceUrl, copy, createRequestOption())
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<Bank> {
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
    // options.params.set('sfdReference.equals',UserData.getInstance().currentSfdReference);
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

  private convert(bank: Bank): Bank {
    const copy: Bank = Object.assign({}, bank);
    return copy;
  }
}
