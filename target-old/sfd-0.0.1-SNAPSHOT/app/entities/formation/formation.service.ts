import { HOST } from "../../shared/model/request-util";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { JhiDateUtils } from "ng-jhipster";

import { Formation } from "./formation.model";
import { ResponseWrapper, createRequestOption, EventBus } from "../../shared";

@Injectable()
export class FormationService {
  private resourceUrl = HOST + "/api/formations";
  private resourceSearchUrl = HOST + "/api/_search/formations";

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}

  create(formation: Formation): Observable<Formation> {
    const copy = this.convert(formation);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  update(formation: Formation): Observable<Formation> {
    const copy = this.convert(formation);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<Formation> {
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
    const options = createRequestOption(Object.assign({},req,{NO_QUERY:true}));
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
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(entity.lastModifiedDate);
    entity.dateFormation = this.dateUtils.convertLocalDateFromServer(entity.dateFormation);
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(entity.createdDate);
  }

  private convert(formation: Formation): Formation {
    const copy: Formation = Object.assign({}, formation);
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(formation.lastModifiedDate);
    copy.dateFormation = this.dateUtils.convertLocalDateToServer(formation.dateFormation);

    if (formation.createdDate) {
      let a = new Date(formation.createdDate);
      let d = {
        year: a.getFullYear(),
        month: a.getMonth(),
        day: a.getDay(),
      };
      copy.createdDate = this.dateUtils.convertLocalDateToServer(d);
    }
    return copy;
  }
}
