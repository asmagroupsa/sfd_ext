
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class AuditsService {
  constructor(private http: Http) {}

  query(req: any): Observable<Response> {
    const options = createRequestOption();
    const params: URLSearchParams = new URLSearchParams();
    params.set('fromDate', req.fromDate);
    params.set('toDate', req.toDate);
    params.set('page', req.page);
    params.set('size', req.size);
    params.set('sort', req.sort);
    options.params = params;
    return this.http.get(`${HOST_MVN}/management/audits`, options);
  }
}
