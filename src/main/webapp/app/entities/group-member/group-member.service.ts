import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { GroupMember } from './group-member.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class GroupMemberService {
  private resourceUrl = HOST + '/api/group-members';
  private resourceSearchUrl = HOST + '/api/_search/group-members';

  constructor(private http: Http, private dateUtils: JhiDateUtils) {}

  create(groupMember: GroupMember): Observable<any> {
    const options = createRequestOption();
    options.params.set('client_id',`${groupMember.clientId}`);
    options.params.set('clt_id',`${groupMember.cltId}`);
    options.params.set('member_role',groupMember.memberRole);
    options.params.set('user_reference',groupMember.createdBy);
    options.params.set('agence_reference',groupMember.agenceReference);
    
    return this.http
      .get(HOST+'/api/client/insertion-membre-group', options)
      .map((res: Response) => {
        const jsonResponse = res.json().resultat;
        return jsonResponse;
      });
  }

  update(groupMember: GroupMember): Observable<GroupMember> {
    const copy = this.convert(groupMember);
    const options = createRequestOption();
    return this.http
      .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {
        const jsonResponse = res.json();
        this.convertItemFromServer(jsonResponse);
        return jsonResponse;
      });
  }

  find(id: number): Observable<GroupMember> {
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
    const options = createRequestOption(
      Object.assign({}, req, { NO_QUERY: true })
    );
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

  private convert(groupMember: GroupMember): GroupMember {
    const copy: GroupMember = Object.assign({}, groupMember);
    copy.createdDate = this.dateUtils.convertLocalDateToServer(
      groupMember.createdDate
    );
    copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
      groupMember.lastModifiedDate
    );
    return copy;
  }
}
