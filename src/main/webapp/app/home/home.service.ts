import { HOST } from '../shared/model/request-util';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { ResponseWrapper, createRequestOption, UserData } from '../shared';
import {
    searchRessource,
    nameSFD,
    nameZoneAgence,
    nameAgence
} from '../shared/model/functions';

@Injectable()
export class HomeService {
    private resourceReportUrl = HOST + '/api/sfd/effectif-sfd-client';
    private effectifReportUrl = HOST + '/api/sfd/effectif-utilisateur';
                                        
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }


    reportSfdUtilisateur(userReference?: string, chaineAgence?:string): Observable<any> {
        
        const options = createRequestOption();
        let param;
        if (UserData.getInstance().agencesReference && (
            searchRessource(UserData.getInstance(), nameZoneAgence) ||
            searchRessource(UserData.getInstance(), nameAgence) )
        ) {
            
            param = [
                'chaineAgence',
                UserData.getInstance().agencesReference.join('*')
            ];
        } else if(searchRessource(UserData.getInstance(), nameSFD) ){
            param=["",""];
        }else{
            param = ['user_reference', UserData.getInstance().userReference];
        }
        
        options.params.set(param[0], param[1]);
        return this.http
            .get(this.effectifReportUrl, options)
            .map(
                (res: Response) => {
                 return res.json();
                }
                    /* new ResponseWrapper(res.headers, res.json(), res.status) */
            );


    }



    reportSfdClient(sfdId: string): Observable<any> {
        const options = createRequestOption();

       
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('sfd_id', sfdId);
        options.params = urlParams;

        return this.http
            .get(this.resourceReportUrl, options)
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
