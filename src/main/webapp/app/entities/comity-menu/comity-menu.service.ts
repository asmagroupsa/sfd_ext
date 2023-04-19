import { HOST } from "../../shared/model/request-util";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { JhiDateUtils } from "ng-jhipster";

import { ComityMber } from "./comity-menu.model";
import { ResponseWrapper, createRequestOption, EventBus } from "../../shared";
import { Dossier } from "../dossier/dossier.model";

@Injectable()
export class ComityMberService {
  private resourceUrl = HOST + "/api/comity-mbers";
  private dossiersUrl = HOST + "/api/dossiers";
  private comitableUrl = HOST +
    "/api/client/liste-demande-produit-par-etape?comiter=true";
  private detaillableUrl = HOST +
    "/api/client/liste-demande-produit-par-etape?etudierDetaille=true&etudierPrealable=true";
  private resourceSearchUrl = HOST + "/api/_search/comity-mbers";

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}
  queryDejaComitable(): Observable<ResponseWrapper> {
    const options = createRequestOption();
    return this.http
      .get(this.comitableUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      );
  }
  queryDetaillable(): Observable<ResponseWrapper> {
    const options = createRequestOption();
    return this.http
      .get(this.detaillableUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      );
  }
  create(comityMber: ComityMber): Observable<ComityMber> {
    const copy = this.convert(comityMber);
    const options = createRequestOption();
    return this.http
      .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }
  createComitableDossier(dossier: Dossier): Observable<Dossier> {
    const copy = this.convertDossier(dossier);
    const options = createRequestOption();
    return this.http
      .post(this.dossiersUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        return res.json();
      });
  }

  update(comityMber: ComityMber): Observable<ComityMber> {
    const copy = this.convert(comityMber);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<ComityMber> {
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
    entity.nominationDate = this.dateUtils.convertLocalDateFromServer(
      entity.nominationDate
    );
    entity.endNominationDate = this.dateUtils.convertLocalDateFromServer(
      entity.endNominationDate
    );
    entity.createdDate = this.dateUtils.convertLocalDateFromServer(
      entity.createdDate
    );
    entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
      entity.lastModifiedDate
    );
  }
  private convertDossier(dossier: Dossier): ComityMber {
    const copy: ComityMber = Object.assign({}, dossier);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      dossier.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      dossier.lastModifiedDate
    );
    return copy;
  }
  private convert(comityMber: ComityMber): ComityMber {
    const copy: ComityMber = Object.assign({}, comityMber);
    copy.nominationDate = this.dateUtils.convertLocalDateToServer(
      comityMber.nominationDate
    );
    copy.endNominationDate = this.dateUtils.convertLocalDateToServer(
      comityMber.endNominationDate
    );
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      comityMber.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      comityMber.lastModifiedDate
    );
    return copy;
  }
}
