import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {createRequestOption, READFILEURL, READBITFILEURL} from './model/request-util';
import { EventBus } from '.';
import {UserData} from './model/singleton';


@Injectable() 
export class ImageService {

    constructor(
        private _http: Http,
        private _domSanitizer: DomSanitizer
    ) {}

    getImageData(imageName: string): Promise<SafeUrl> {
        const requestOptions = createRequestOption();
        requestOptions.headers.set('Accept', 'image/*');

        return this._http
        .get(`${READBITFILEURL}${imageName}`, requestOptions).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
        .map((response: any) => {
            return this._domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response._body}`);
        }).toPromise();
    }

    getImageDataString(imageName: string): Promise<string> {
        return this.getImageData(imageName)
        .then((safeUrl: any) => safeUrl.changingThisBreaksApplicationSecurity)
    }

    getSFDHeaderImage() {
        return this.getImageDataString(UserData.getInstance().getSFD().entete);
    }
}
