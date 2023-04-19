
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Log } from './log.model';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class LogsService {
  constructor(private http: Http) {}

  changeLevel(log: Log): Observable<Response> {
    const options = createRequestOption();
    return this.http.put(`${HOST_MVN}/management/logs`, log, options);
  }

  findAll(): Observable<Log[]> {
    const options = createRequestOption();
    return this.http
      .get(`${HOST_MVN}/management/logs`, options)
      .map((res: Response) => res.json());
  }
}
