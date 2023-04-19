import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, UserData } from '../shared';
import { HOST } from '../shared/model/request-util';

@Injectable()
export class StatsService {
    private situationGlobaleUrl = HOST + '/api/stat/liste-sfd-situation';
    private situationLigneUrl = HOST + '/api/stat/liste-ligne-situation';
    private situationCreditsUrl = HOST + '/api/stat/liste-credit-situation-by-ligne';
    private situationCreditIndividuUrl = HOST + '/api/stat/liste-credit-membre-situation'
    private situationAgenceUrl = HOST + '/api/stat/liste-agence-situation'
    private situationCreditsAgenceUrl = HOST + '/api/stat/liste-credit-situation-by-agence'
    private situationComitesUrl = HOST + '/api/stat/liste-comite-situation';
    private situationComityAgenceUrl = HOST + '/api/stat/liste-credit-situation-by-comite';
    private _url = HOST + '/api/stat/';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
bilanGlobal(req?:any): Observable<any> {
const options = createRequestOption(req);
return this.http
            .get(`${HOST}/api/stat/circulation-monnaie-electronique-fudiciaire`, options)
            .map((res: Response) => {
                return res.json();
            });
}
    situationGlobale(): Observable<any> {
        const options = createRequestOption();
        options.params.set('sfd_reference', UserData.getInstance().getSFDReference());
        return this.http
            .get(this.situationGlobaleUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationLigne(): Observable<any> {
        const options = createRequestOption();
        options.params.set('sfd_reference', UserData.getInstance().getSFDReference());
        return this.http
            .get(this.situationLigneUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationCredits(ligneId): Observable<any> {
        const options = createRequestOption();
        options.params.set('ligne_credit_id', ligneId);
        return this.http
            .get(this.situationCreditsUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationCreditIndividu(creditId): Observable<any> {
        const options = createRequestOption();
        options.params.set('credit_id', creditId);
        return this.http
            .get(this.situationCreditIndividuUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationAgence(agence): Observable<any> {
        const options = createRequestOption();
        options.params.set('sfd_reference', UserData.getInstance().getSFDReference());
        options.params.set('agence_reference', agence);
        return this.http
            .get(this.situationAgenceUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationCreditsAgence(agence): Observable<any> {
        const options = createRequestOption();
        options.params.set('agence_reference', agence);
        return this.http
            .get(this.situationCreditsAgenceUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationComites(ligneId): Observable<any> {
        const options = createRequestOption();
        options.params.set('ligne_credit_id', ligneId);
        return this.http
            .get(this.situationComitesUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }
    situationComityAgence(comityId): Observable<any> {
        const options = createRequestOption();
        options.params.set('credit_comity_id', comityId);
        return this.http
            .get(this.situationComityAgenceUrl, options)
            .map((res: Response) => {
                if (!UserData.getInstance().getSFDReference()) {
                    return [];
                }
                return res.json();
            });
    }

    listeSituation(level, queryParams) {       
        
        return this.http.get(this._url + level, createRequestOption(queryParams))
            .map((rs) => rs.json());
    }
}