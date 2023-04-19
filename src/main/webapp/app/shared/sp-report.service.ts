import {Injectable} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';
import {UserData} from "./index";

@Injectable()
export class SPReportService {
    constructor(private _http: Http) {}

    private _url(path: string) {
        return HOST + '/api/report/' + path;
    }

    listeCreditImpayesToFile(params: object) {
        const o = createRequestOption({
            qrcode: {type: 'SFD', reference: UserData.getInstance().getSFD().code},
            ...params,
            NO_QUERY: true,
        });
        o.responseType = ResponseContentType.Blob;

        return new Promise((resolve, reject) => {
            this._http.get(this._url('liste-credit-impayes-to-file'), o).toPromise()
            .then((r) => {
                const reader = new FileReader();
                reader.readAsDataURL(r.blob());
                reader.onloadend = () => {
                    resolve(reader.result);                
                }
            })
            .catch(reject);
        });
    }

    listeMembreGroupeByCredit(creditId) {
        return this._http.get(this._url('liste-membre-groupe-by-credit'), createRequestOption({
            credit_id: creditId,
            NO_QUERY: true,
        }))
        .map((r) => r.json())
        .toPromise()
    }
}
