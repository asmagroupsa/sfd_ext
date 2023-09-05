
import { EventBus } from '../../shared/model/functions';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { HOST_MVN, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class Register {
  constructor(private http: Http) {}

  save(account: any): Observable<any> {
    const options = createRequestOption();
    return this.http.post(`${HOST_MVN}/api/register`, account, options);
  }
}
