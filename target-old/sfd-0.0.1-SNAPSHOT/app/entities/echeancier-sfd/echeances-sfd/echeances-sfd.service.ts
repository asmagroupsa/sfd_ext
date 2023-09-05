import { HOST } from "../../../shared/model/request-util";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { JhiDateUtils } from "ng-jhipster";

import { EcheancesSFD } from "./echeances-sfd.model";
import { ResponseWrapper, createRequestOption, EventBus } from "../../../shared";

@Injectable()
export class EcheancesSFDService {
  private resourceUrl = HOST + "/api/echeances-sfds";
  private resourceSearchUrl = HOST + "/api/_search/echeances-sfds";

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}

  create(echeancesSFD: EcheancesSFD): Observable<EcheancesSFD> {
    const copy = this.convert(echeancesSFD);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  update(echeancesSFD: EcheancesSFD): Observable<EcheancesSFD> {
    const copy = this.convert(echeancesSFD);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<EcheancesSFD> {
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
    entity.echeanceDate = this.dateUtils.convertLocalDateFromServer(
      entity.echeanceDate
    );
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(
      entity.createdDate
    );
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
      entity.lastModifiedDate
    );
  }

  private convert(echeancesSFD: EcheancesSFD): EcheancesSFD {
    const copy: EcheancesSFD = Object.assign({}, echeancesSFD);
    copy.echeanceDate = this.dateUtils.convertLocalDateToServer(
      echeancesSFD.echeanceDate
    );
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      echeancesSFD.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      echeancesSFD.lastModifiedDate
    );
    return copy;
  }
}
