import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { SouscriptionGouvernanceUniverselle } from './souscription-gouvernance-universelle.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST, HOST_MVN } from '../../shared/model/request-util';

@Injectable()
export class SouscriptionGouvernanceUniverselleService {
    private baseUrlGouvernanceUniverselle = 'http://185.98.137.71:9002';
    private resourceUrl = HOST + '/api/s-fds';
    private resourceSearchUrl = HOST + '/api/s-fds';
    private resourceUrlNew = HOST + '/api/s-fds-partner';
    private subscriptionUrl = HOST_MVN + '/api/user/souscription-gouvernance-universelle-sfd';
    private indicePrestataireUrl = 'http://185.98.137.71:4002/user/check-indice-prestataire';


    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    checkCARMESAccount(compteCarmes: string/* , pin: number */): Observable<any> {
        const options = createRequestOption();
        options.params.set('comptecarmes', compteCarmes);
        // options.params.set('pin', pin.toString());

        return this.http
            .get(`${HOST}/api/util/verifer-compte-carmes-complet`, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }

    checkIndicePrestataire(indice: string): Observable<any> {
        const options = createRequestOption();
        options.params.set('indice_prestataire', indice);

        return this.http
            .post(this.indicePrestataireUrl, {
                'indice_prestataire': indice
            }, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }


    create(souscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle): Observable<SouscriptionGouvernanceUniverselle> {
        const copy = this.convert(souscriptionGouvernanceUniverselle);
        console.log(copy);
        const options = createRequestOption({
            created_by: souscriptionGouvernanceUniverselle.createdBy || UserData.getInstance().user_reference,
        });
        /* return this.http
            .get(this.subscriptionUrl, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);

                return jsonResponse;
            }); */

        return this.http
            .post(`${this.baseUrlGouvernanceUniverselle}/api/gouvernance/souscription`, copy, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                if (jsonResponse.resultat != 'OK') {
                    throw jsonResponse;
                }
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(souscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle): Observable<SouscriptionGouvernanceUniverselle> {
        const copy = this.convert(souscriptionGouvernanceUniverselle);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                if (jsonResponse.resultat != 'OK') {
                    throw jsonResponse;
                }
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<SouscriptionGouvernanceUniverselle> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        //options.params.set('partner', UserData.getInstance().partnerId ?   UserData.getInstance().partnerId.toString() : '30060' );
        options.params.set('partner', UserData.getInstance().sfdId ? UserData.getInstance().sfdId.toString() : '0');
        //options.params.set('partner', UserData.getInstance().partnerId.toString());
        console.log(UserData.getInstance().sfdId);

        return this.http
            .get(this.resourceUrlNew, options)
            .map((res: Response) => this.convertResponse(res));
    }

    queryProduct(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(`${this.baseUrlGouvernanceUniverselle}/api/produits`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    queryPartner(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(`${this.baseUrlGouvernanceUniverselle}/api/partenaires`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    queryTarif(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(`${this.baseUrlGouvernanceUniverselle}/api/tarifs`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        if (entity.createdDate) {
            entity.createdDate = this.dateUtils.convertLocalDateFromServer(
                entity.createdDate
            );
        }
        if (entity.lastModifiedDate) {
            entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
                entity.lastModifiedDate
            );
        }
    }

    private convert(souscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle): SouscriptionGouvernanceUniverselle {
        const copy: SouscriptionGouvernanceUniverselle = Object.assign({}, souscriptionGouvernanceUniverselle);
        try {
            if (copy.createdDate) {
                copy.createdDate = this.dateUtils.convertLocalDateToServer(souscriptionGouvernanceUniverselle.createdDate);
            }
            if (copy.lastModifiedDate) {
                copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
                    souscriptionGouvernanceUniverselle.lastModifiedDate
                );
            }

        } catch (e) {
            //
        }
        return copy;
    }
}
