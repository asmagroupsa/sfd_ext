import { EventBus } from '../../shared/model/functions';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';
import { Http, Response, URLSearchParams } from '@angular/http';

import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
import { Sinistre } from './sinistre';
@Injectable()
export class SinistreService {
  private resourceUrl = HOST + '/api/addresses';
  private resourceSearchUrl = HOST + '/api/_search/addresses';
  private sinistreURL = HOST + '/api/sinistres';
  private listAyantDroit = HOST + '/api/assurance/liste-ayant-droit';
  private reglementUrl = HOST + '/api/sinistre-reglements';


  constructor(private http: Http, private dateUtils: JhiDateUtils) { }

  create(sisnistre: Sinistre): Observable<Sinistre> {
    const copy = this.convert(sisnistre);
    const options = createRequestOption();
    return this.http.post(this.sinistreURL, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  update(sinistre: Sinistre): Observable<Sinistre> {
    const copy = this.convert(sinistre);
    const options = createRequestOption();
    return this.http.put(this.sinistreURL, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  getAyantDroit(numPolice): Observable<ResponseWrapper> {
    const options = createRequestOption();
    
    options.params.set('num_police', '' + numPolice);
    
    return this.http
        .get(this.listAyantDroit, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
        .map((res: Response) => {return res.json()});
}

saveReglementSinistre(reglement) {
    const options = createRequestOption();
    return this.http.post(this.reglementUrl, reglement, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });

}

  find(id: number): Observable<Sinistre> {
    const options = createRequestOption(); return this.http.get(`${this.sinistreURL}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
      const jsonResponse = res.json();
      this.convertItemFromServer(jsonResponse);
      return jsonResponse;
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http
      .get(this.sinistreURL, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
      .map((res: Response) => this.convertResponse(res));
  }

  delete(id: number): Observable<Response> {
    const options = createRequestOption(); return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
  }

  search(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http
      .get(this.sinistreURL, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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

  private convert(sinistre: Sinistre): Sinistre {
    const copy: Sinistre = Object.assign({}, sinistre);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
        sinistre.createdDate
    );
    // copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
    //     sinistre.lastModifiedDate
    // );
    return copy;
  }
}
