
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ProfileInfo } from './profile-info.model';
import { HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService {
  private profileInfoUrl = `${HOST_MVN}/api/profile-info`;

  constructor(private http: Http) {}

  getProfileInfo(): Observable<ProfileInfo> {
    return this.http.get(this.profileInfoUrl).map((res: Response) => {
      const data = res.json();
      const pi = new ProfileInfo();
      pi.activeProfiles = data.activeProfiles;
      pi.ribbonEnv = data.ribbonEnv;
      pi.inProduction = data.activeProfiles.indexOf('prod') !== -1;
      pi.swaggerEnabled = data.activeProfiles.indexOf('swagger') !== -1;
      return pi;
    });
  }
}
