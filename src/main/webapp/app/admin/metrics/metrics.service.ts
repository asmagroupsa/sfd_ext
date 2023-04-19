
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class JhiMetricsService {
  constructor(private http: Http) {}

  getMetrics(): Observable<any> {
    const options = createRequestOption(true);
    return this.http
      .get(`${HOST_MVN}/management/metrics`, options)
      .map((res: Response) => res.json());
  }

  threadDump(): Observable<any> {
    const options = createRequestOption(true);
    return this.http
      .get(`${HOST_MVN}/management/dump`, options)
      .map((res: Response) => res.json());
  }
}
