
import { EventBus } from '../../shared/model/functions';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class PasswordService {
  constructor(private http: Http) {}

  save(newPassword: string): Observable<any> {
    const options = createRequestOption();
    return this.http.post(
      `${HOST_MVN}/api/account/change_password`,
      newPassword,
      options
    );
  }
}
