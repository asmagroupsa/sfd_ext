
import { EventBus } from '../../shared/model/functions';
import { Http, Response,BaseRequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Dossier } from './dossier.model';
import { ResponseWrapper, createRequestOption, CARMES_HOST } from '../../shared';
import { HOST, CARMES_URL } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class DossierService {
  private resourceUrl = HOST + '/api/dossiers';
  private resourceSearchUrl = HOST + '/api/_search/dossiers';

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}
  verificationActivationCarmes(chaineComptesCARMES){
        const options = createRequestOption();
        return this.http.post(`${CARMES_URL}/monnaies/verificationActivationCartesCARMES`, {
          chaineComptesCARMES
        }, options).map((res: Response) => {
        const jsonResponse = res.json();
        return jsonResponse;
      });
  }
retireDossier(id:any): Observable<any>{
   const options = createRequestOption();
        options.params.set('dossier_id', id);

        return this.http.get(`${HOST}/api/sfd/delete-commity-dossier`, options).map((res: Response) => {
        const jsonResponse = res.json();
        return jsonResponse;
      });
}
  create(dossier: Dossier): Observable<Dossier> {
    const copy = this.convert(dossier);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  update(dossier: Dossier): Observable<Dossier> {
    const copy = this.convert(dossier);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<Dossier> {
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
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(
      entity.createdDate
    );
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
      entity.lastModifiedDate
    );
  }

  private convert(dossier: Dossier): Dossier {
    const copy: Dossier = Object.assign({}, dossier);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      dossier.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      dossier.lastModifiedDate
    );
    return copy;
  }
}
