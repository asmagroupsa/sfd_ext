import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, LOCAL_FLAG, ResponseWrapper, UserData } from '../../shared';
import { EventBus } from '../../shared/model/functions';
import { HOST } from '../../shared/model/request-util';
import { Produit } from './produit.model';

@Injectable()
export class ProduitService {
    private resourceUrl = HOST + '/api/produits';
    private resourceSearchUrl = HOST + '/api/_search/produits';
    private categorieUrl = HOST + '/api/categorie-produits';
    private produitsByCategoryUrl = HOST + '/api/produit/by-category';
    private produitsEligiblesUrl = HOST + '/api/eligibles';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    queryCategories(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        return this.http
            .get(this.categorieUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }

    queryProduitsEligibles(req: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, { size: 1000000 }, req));
        return this.http
            .get(this.produitsEligiblesUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }

    produitsEligibles(req?): Observable<ResponseWrapper> {
        return this.queryProduitsEligibles(Object.assign({}, req, {
            'sfdReference.equals': UserData.getInstance().getSFDReference(),
            NO_QUERY: true
        })).map((res: ResponseWrapper) => this.eligibleProduits(res));
    }

    queryProduitsByCategory(
        code: string,
        req?: any
    ): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, { NO_QUERY: true }));
        options.params.set('category_code', code);
        return this.http
            .get(this.produitsByCategoryUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    create(produit: Produit): Observable<Produit> {
        const copy = this.convert(produit);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(produit: Produit): Observable<Produit> {
        const copy = this.convert(produit);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Produit> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }
getTauxCommissions() {
        const o = createRequestOption();
        o.params = o.params || new URLSearchParams();
        o.params.append('sfd_reference', UserData.getInstance().getSFDReference());
        return this.http.get(HOST+'/api/operation/liste-taux-commission', o)
            .map((r) => r.json());
    }
    updateTauxCommission(model:any) {
        const o = createRequestOption();
        o.params = o.params || new URLSearchParams();
        o.params.append('acteur', model.acteur);
        o.params.append('code_type_operation', model.code_type_operation);
        o.params.append('code_produit', model.code_produit);
        o.params.append('type_commission', model.type_commission);
        o.params.append('taux_commission', model.taux_commission);
        return this.http.get(HOST+'/api/operation/update-taux-commission', o)
            .map((r) => r.json());
    }

    getGroupProduits() {
        const o = createRequestOption();

        o.params = o.params || new URLSearchParams();
        o.params.append('typeProduit.in', 'CREDIT,LIGNE_PRODUIT');
        o.params.append('sfdReference.equals', 'FNM');
        o.params.append('sfdReference.equals', UserData.getInstance().getSFDReference());
        o.params.append('condition', 'OR');
        o.params.append('sfdReference.specified', 'false');

        return this.http.get(this.resourceUrl, o)
            .map((r) => r.json());
    }

    getFnmAndSfdProduits(req?, typeProduit: string[] = ['CREDIT', 'LIGNE_PRODUIT']): Promise<Produit[]> {
        return new Promise((resolve, reject) => {
            function concatProduits() {
                i++;

                if (i == 2) {
                    resolve(sfdProduits.concat(produitsEligible));
                }
            }

            let sfdProduits = [];
            let produitsEligible = [];
            let i = 0;

            this.query(Object.assign({}, req, { 'typeProduit.in': typeProduit.length ? typeProduit.join(',') : null }))
                .subscribe(
                    (r) => {
                        sfdProduits = r.json;
                        concatProduits();
                    },
                    (e) => {
                        reject(e);
                    },
                );

            this.produitsEligibles({ size: 1000000 })
                .subscribe(
                    (r) => {
                        produitsEligible = r.json.filter((p) => {
                            return typeProduit.indexOf(p.typeProduit) != -1;
                        });
                        concatProduits();
                    },
                    (e) => {
                        reject(e);
                    },
                );
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        let isLocal = req && req.products ? true : LOCAL_FLAG;
        if (req) delete req.products;
        // if (isLocal) {
        const options = createRequestOption(
            Object.assign({}, req, {
                NO_QUERY: true,
                'sfdReference.equals': UserData.getInstance().getSFD().code,
                // 'sfdReference.equals': UserData.getInstance().getSFDReference(),
            })
        );
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return this.convertResponse(res);
            });
        // } else {
        //     let sfdRef =
        //         UserData.getInstance().currentSfdReference ||
        //         UserData.getInstance().sfd;
        //     return this.queryProduitsEligibles({
        //         'sfdReference.equals': sfdRef,
        //         NO_QUERY: true
        //     }).map((res: ResponseWrapper) => this.eligibleProduits(res));
        // }
    }
    private eligibleProduits(res: ResponseWrapper): ResponseWrapper {
        let jsonResponse = [];
        let ids = [];
        res.json.forEach(element => {
            if(ids.indexOf(element.produit.id) == -1){
            jsonResponse.push(element.produit);
            ids.push(element.produit.id);
            }
        });
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        res.json = jsonResponse;
        return res;
    }
    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
        // entity.createdDate = {
        //   year:entity.createdDate[0],
        //   month:entity.createdDate[1],
        //   day:entity.createdDate[2]
        // };
        // entity.lastModifiedDate = {
        //   year:entity.lastModifiedDate[0],
        //   month:entity.lastModifiedDate[1],
        //   day:entity.lastModifiedDate[2]
        // };
    }

    private convert(produit: Produit): Produit {
        const copy: Produit = Object.assign({}, produit);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            produit.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            produit.lastModifiedDate
        );
        return copy;
    }
}
