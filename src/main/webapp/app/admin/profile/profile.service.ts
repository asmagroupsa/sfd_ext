
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { createRequestOption, HOST_MVN } from '../../shared';
import { UserData } from '../../shared/model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class JhiProfileService {
  private url: string = HOST_MVN +
    '/api/authoritys?sfd_reference=' +
    (UserData.getInstance().sfd || UserData.getInstance().currentSfdReference);
  constructor(private http: Http) {}

  getProfiles(): Observable<any> {
    const options = createRequestOption();
    options.params.set('typeUser.equals', 'SFD');
    return this.http
      .get(`${this.url}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => res.json());
  }
  createProfile(model: any): Observable<any> {
    const options = createRequestOption();
    options.params.set('typeUser', 'SFD');
    return this.http
      .post(`${this.url}`, Object.assign(model, {typeUser: 'SFD'}), options)
      .map((res: Response) => res.json());
  }
  updateProfile(model: any): Observable<any> {
    const options = createRequestOption();
    return this.http
      .put(`${this.url}`, model, options)
      .map((res: Response) => res.json());
  }
  deleteProfile(id: any): Observable<any> {
    const options = createRequestOption();
    return this.http
      .delete(`${this.url}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => res.json());
  }

  deleteProfileRessource(id: any): Observable<any> {
    const options = createRequestOption();
    return this.http
      // .get(`${this.url}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .get(``, options)
      .map((res: Response) => res.json());
  }
}
