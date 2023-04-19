
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class JhiConfigurationService {
  constructor(private http: Http) {}

  get(): Observable<any> {
    const options = createRequestOption();
    return this.http
      .get(`${HOST_MVN}/management/configprops`, options)
      .map((res: Response) => {
        const properties: any[] = [];

        const propertiesObject = res.json();

        for (const key in propertiesObject) {
          if (propertiesObject.hasOwnProperty(key)) {
            properties.push(propertiesObject[key]);
          }
        }

        return properties.sort((propertyA, propertyB) => {
          return propertyA.prefix === propertyB.prefix
            ? 0
            : propertyA.prefix < propertyB.prefix ? -1 : 1;
        });
      });
  }

  getEnv(): Observable<any> {
    const options = createRequestOption();
    return this.http
      .get(`${HOST_MVN}/management/env`, options)
      .map((res: Response) => {
        const properties: any = {};

        const propertiesObject = res.json();

        for (const key in propertiesObject) {
          if (propertiesObject.hasOwnProperty(key)) {
            const valsObject = propertiesObject[key];
            const vals: any[] = [];

            for (const valKey in valsObject) {
              if (valsObject.hasOwnProperty(valKey)) {
                vals.push({ key: valKey, val: valsObject[valKey] });
              }
            }
            properties[key] = vals;
          }
        }

        return properties;
      });
  }
}
