
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { GatewayRoute } from './gateway-route.model';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class GatewayRoutesService {
  constructor(private http: Http) {}

  findAll(): Observable<GatewayRoute[]> {
    const options = createRequestOption();
    return this.http
      .get(`${HOST_MVN}/api/gateway/routes/`, options)
      .map((res: Response) => res.json());
  }
}
