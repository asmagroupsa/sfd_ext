import {Injectable} from '@angular/core';
import {Http, URLSearchParams, ResponseContentType} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';
import {Observable} from 'rxjs';
import {UserData, getImgSrc} from "./index";
import { ImageService } from './image.service';

@Injectable()
export class UtilService {
    constructor(private _http: Http, private _image: ImageService) {}

    toFileRequest(path, params, isPaysage:boolean = false) {
        const header_url = (isPaysage) ? getImgSrc(UserData.getInstance().getSFD().entetePaysage) : getImgSrc(UserData.getInstance().getSFD().entete);
        const o = createRequestOption({
            qrcode: JSON.stringify({type: 'SFD', reference: UserData.getInstance().getSFD().code}),            
            page_header: header_url,
            user: UserData.getInstance().account.firstName+" "+UserData.getInstance().account.lastName,
            ...params,
            NO_QUERY: true,
        });
        o.responseType = ResponseContentType.Blob;

        return new Promise((resolve, reject) => {
            this._http.get(this._url(path), o).toPromise()
            .then((r) => {
                this.blobToDataURL(r.blob(), resolve);
            })
            .catch(reject);
        });
    }

    blobToDataURL(blob: any, resolve) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            resolve(reader.result);                
        }
    }

    private _url(path) {
        return HOST + '/api/' + path;
    }
}
