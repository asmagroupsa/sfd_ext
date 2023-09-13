
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
    options.params.set('fromDate', req.fromDate);
    options.params.set('toDate', req.toDate);
    options.params.set('page', req.page);
    options.params.set('size', req.size);
    options.params.set('sort', req.sort);
    return this.http.get(`${HOST_MVN}/management/audits`, options);
  }
}
