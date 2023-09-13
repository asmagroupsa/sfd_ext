import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';

@Injectable()
export class MainService {
    private resourceReportUrl = HOST + '/api/sfd/update-entete-pied-page';
   
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }


    
    updateHeaderFooter(args:any): Observable<any> {
        const options = createRequestOption();
       // sfdRef: any, header:string,footer:string
        
        options.params.set('sfd_reference', args.sfdRef);
        options.params.set('entete', args.header);
        options.params.set('pied', args.footer);
        options.params.set('entete_paysage', args.header_pay);
        options.params.set('pied_paysage', args.footer_pay);
        
        return this.http
            .get(this.resourceReportUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) =>{
                return res.json()
            })

    }


    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(data: any): any {
        const copy: any = Object.assign({}, data);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            data.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            data.lastModifiedDate
        );
        return copy;
    }
}
