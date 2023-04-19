

import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { HOST_MVN, createRequestOption } from '../../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class PasswordResetFinishService {
  constructor(private http: Http) {}

  save(keyAndPassword: any): Observable<any> {
    const options = createRequestOption();
    return this.http.post(
      `${HOST_MVN}/api/account/reset_password/finish`,
      keyAndPassword,
      options
    );
  }
}
