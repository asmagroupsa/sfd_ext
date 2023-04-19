import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { TypeCreditRetard } from './type-credit-retard.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { EventBus } from '../../shared/model/functions';


@Injectable()
export class TypeCreditRetardService {
  private resourceUrl = HOST + '/api/sfd/create-type-retard-credit?';
  private getResourceUrl = HOST + '/api/sfd/type-retard-credit-par-sfd?';
  private resourceSearchUrl = HOST + '/api/_search/account-types';

  constructor(private http: Http) { }

  create(typeCreditRetard: TypeCreditRetard): Observable<TypeCreditRetard> {
    const copy = this.convert(typeCreditRetard);
    console.log(copy);
    console.log(typeCreditRetard);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl + `intitule=${copy.intitule}` + `&duree=${copy.duree}`+ `&sfd_id=${UserData.getInstance().sfdId}`, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(typeCreditRetard: TypeCreditRetard): Observable<TypeCreditRetard> {
    const copy = this.convert(typeCreditRetard);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => {
        return res.json();
      });
  }

  find(id: number): Observable<TypeCreditRetard> {
    const options = createRequestOption();
    return this.http
      .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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
      .get(this.getResourceUrl + `sfd_id=${UserData.getInstance().sfdId}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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

  private convert(typeCreditRetard: TypeCreditRetard): TypeCreditRetard {
    const copy: TypeCreditRetard = Object.assign({}, typeCreditRetard);
    return copy;
  }
}
