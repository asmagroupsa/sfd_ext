import { JhiHttpInterceptor } from 'ng-jhipster';
import { RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserData } from '../../shared';

export class CountryIdInterceptor extends JhiHttpInterceptor {

    constructor() {
        super();
    }

   processRequestInterception(options?: RequestOptionsArgs): RequestOptionsArgs {
    try {
        //console.log("processRequestInterception ",options.method,options.url);
        if(!options) options = {};
        let countryId = UserData.getInstance().countryId || 1;
        if(!options.params) options.params = {};
        if(!options.params['country_id']) options.params['country_id'] = countryId;
        if(options.body && typeof(options.body) == 'object' && !options.body['country_id']){
            options.body['country_id'] = countryId;
        }

    } catch (_) {
       //console.log("processRequestInterception error ",_); 
    }   
    return options;
   }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        try {
            //console.log("requestIntercept ",options.method,options.url); 
            let countryId = UserData.getInstance().countryId || 1;
            if(!options) options = {};
            if(!options.params) options.params = {};
            if(!options.params['country_id']) options.params['country_id'] = countryId;
            if(options.body && typeof(options.body) == 'object' && !options.body['country_id']){
                options.body['country_id'] = countryId;
            }

        } catch (_) {
           //console.log("requestIntercept error ",_); 
        }
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        return observable;
    }
}
