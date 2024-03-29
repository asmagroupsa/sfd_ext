
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { HOST_MVN, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class ActivateService {
  constructor(private http: Http) {}

  get(key: string): Observable<any> {
    const options = createRequestOption();
    options.params.set('key', key);

    return this.http
      .get(`${HOST_MVN}/api/activate`, options)
      .map((res: Response) => res);
  }
}
