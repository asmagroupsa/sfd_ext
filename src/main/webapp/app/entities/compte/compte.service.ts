import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Compte } from './compte.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class CompteService {
  private resourceUrl = HOST + '/api/comptes';
  private resourceSearchUrl = HOST + '/api/_search/comptes';

  constructor(private http: Http, private dateUtils: JhiDateUtils) { }

  create(compte: Compte): Observable<Compte> {
    const copy = this.convert(compte);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  update(compte: Compte): Observable<Compte> {
    const copy = this.convert(compte);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<Compte> {
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
    if (UserData.getInstance().agencesReference) {
      let agencesRef = UserData.getInstance().agencesReference.join(',');
      options.params.set('agenceReference.in', agencesRef);
    }
    return this.http
      .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => this.convertResponse(res));
  }

  query_(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    // let agencesRef = UserData.getInstance().agencesReference.join(',');
    // options.params.set('agenceReference.in', agencesRef);
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

  getByCARMESAccount(carmesAccount): Promise<any[]> {
    return new Promise((resolve, reject) => {
          const o = createRequestOption();
          o.params.set('cpteCarmes.equals', carmesAccount);

          this.http.get(HOST + '/api/clients', o)
          .subscribe(
              (r) => {
                  const json = r.json();
                  const id = json[0] ? json[0].id : null;

                  if (!id) {
                      reject();
                      return;
                  }

                  this.query({'clientId.equals': id})
                  .subscribe(
                      (r) => {
                          resolve(r.json);
                      },
                      (e) => {
                          reject(e);
                      },
                  );
              },
              (e) => {
                  reject(e);
              },
          );
      });
  }

  private convertResponse(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    for (let i = 0; i < jsonResponse.length; i++) {
      this.convertItemFromServer(jsonResponse[i]);
    }
    return new ResponseWrapper(res.headers, jsonResponse, res.status);
  }

  private convertItemFromServer(entity: any) {
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(
      entity.createdDate
    );
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
      entity.lastModifiedDate
    );
  }

  private convert(compte: Compte): Compte {
    const copy: Compte = Object.assign({}, compte);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      compte.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      compte.lastModifiedDate
    );
    return copy;
  }
}
