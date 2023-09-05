
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JhiDateUtils } from 'ng-jhipster';

import { BankAccount } from './bank-account.model';
import { ResponseWrapper, createRequestOption, HOST,UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class BankAccountService {
  private resourceUrl = HOST + '/api/bank-accounts';
  private resourceSearchUrl = HOST + '/api/_search/bank-accounts';

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}

  create(bankAccount: BankAccount): Observable<BankAccount> {
    const copy = this.convert(bankAccount);
    const options = createRequestOption();
    if(!copy.sfdReference){
      copy.sfdReference = UserData.getInstance().currentSfdReference;
    }
    return this.http
      .post(this.resourceUrl, copy, options)
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  update(bankAccount: BankAccount): Observable<BankAccount> {
    const copy = this.convert(bankAccount);
    return this.http
      .put(this.resourceUrl, copy, createRequestOption())
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<BankAccount> {
    return this.http
      .get(`${this.resourceUrl}/${id}`, createRequestOption())
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(
      Object.assign({}, req, {
        NO_QUERY: true
      })
    );
    options.params.set('sfdReference.equals',UserData.getInstance().currentSfdReference);
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
    for (let i = 0; i < jsonResponse.length; i++) {
      this.convertItemFromServer(jsonResponse[i]);
    }
    return new ResponseWrapper(res.headers, jsonResponse, res.status);
  }

  private convertItemFromServer(entity: any) {
    entity.date = this.dateUtils.convertLocalDateFromServer(entity.date);
  }

  private convert(bankAccount: BankAccount): BankAccount {
    const copy: BankAccount = Object.assign({}, bankAccount);
    copy.date = this.dateUtils.convertLocalDateToServer(bankAccount.date);
    return copy;
  }
}
