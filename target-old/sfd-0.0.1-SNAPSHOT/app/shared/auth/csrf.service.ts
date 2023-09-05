
import { EventBus } from '../model/functions';
import { CookieService } from 'ngx-cookie';
import { Injectable } from '@angular/core';
@Injectable()
export class CSRFService {

    constructor(private cookieService: CookieService) {}

    getCSRF(name?: string) {
        name = `${name ? name : 'XSRF-TOKEN'}`;
        return this.cookieService.get(name);
    }
}
