import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiLanguageService, JhiAlertService } from 'ng-jhipster';
import {
    Principal,
    AccountService,
    JhiLanguageHelper,
    sendFileToServer,
    createRequestOption,
    UserService,
    ResponseWrapper,
    EventBus,
    READBITFILEURL
} from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
declare let select_init: any;

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    label: string = 'Selectionnez une photo';
    error: string;
    success: string;
    settingsAccount: any = {};
    languages: any[];
    picture: boolean;
    taken: boolean;
    @ViewChild('video') video: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('file') file: ElementRef;
    @ViewChild('labelPhoto') labelPhoto: ElementRef;

    constructor(
        private account: AccountService,
        private principal: Principal,
        private http: Http,
        private userService: UserService,
        public domSanitizer: DomSanitizer,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        public langue: LanguesService,
        private alertService: JhiAlertService
    ) { }
    ngOnInit() {
        this.principal.identity().then(account => {
            this.settingsAccount = this.copyAccount(account);
            select_init();
            let excludes = ['../../../content/coreUi/assets/img/avatars/6.jpg'];
            if (excludes.indexOf(this.settingsAccount.image_url) == -1) {
                this.onLoaded(this.settingsAccount, this.settingsAccount.image_url);
            }
        });
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });
    }
    onLoaded(settings: any, url: string = '1.png') {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
            .get(`${READBITFILEURL}${url}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            })
            .subscribe(url => {
                settings.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(
                    url
                );
                this.labelPhoto.nativeElement.style.backgroundImage =
                    'url(' + url + ')';
            });
    }
    updatePhoto() {
        this.userService
            .changePhoto(this.settingsAccount.image_url)
            .subscribe(
                response =>
                    this.onSaveSuccess(response),
                () => this.onSaveError()
            );
    }
    private onSaveSuccess(result) {
        if (result && result.json == 'OK') {
            this.principal.userIdentity.imageUrl = this.settingsAccount.image_url;
            this.principal.photoState.next(this.principal.userIdentity);
            this.alertService.success("Votre photo de profil a été mise à jour");
        } else {
            this.onSaveError();
        }
    }
    private onSaveError() {
        this.error =
            "La mise à jour de votre photo de profil a échoué, veuillez réessayer";
        this.alertService.warning(this.error);
    }
    save() {
        this.userService.create(this.settingsAccount).subscribe(
            (res: ResponseWrapper) => {
                this.error = null;
                this.success = 'OK';
                this.alertService.success(
                    'La validation des paramètres du compte effectué'
                );
                this.languageService.getCurrent().then(current => {
                    if (this.settingsAccount.langKey !== current) {
                        this.languageService.changeLanguage(
                            this.settingsAccount.langKey
                        );
                    }
                });
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
                this.alertService.error(
                    'La validation des paramètres du compte a échoué'
                );
            }
        );
    }

    copyAccount(account) {
        return {
            id: account.id,
            activated: account.activated,
            email: account.email,
            created_by: account.createdBy,
            first_name: account.firstName,
            langKey: account.langKey,
            last_name: account.lastName,
            login: account.login,
            image_url: account.imageUrl,
            imageUrl: '',
            chaine_authorities: account.authorities.join('*')
        };
    }
    takePicture(ev) {
        ev.stopPropagation();
        this.taken = true;
        this.picture = false;
        this.canvas.nativeElement
            .getContext('2d')
            .drawImage(
                this.video.nativeElement,
                0,
                0,
                this.canvas.nativeElement.width,
                this.canvas.nativeElement.height
            );
        this.canvas.nativeElement.toBlob(blob => {
            blob.name = Date.now() + '.png';
            sendFileToServer(blob, resp => {
                if (resp && resp != 'NONE') {
                    this.settingsAccount.imageUrl = resp;
                    this.settingsAccount.image_url = resp;
                    this.updatePhoto();
                } else {
                    this.alertService.warning("La mise à jour de votre photo de profil a échoué, veuillez réessayer");
                }
            });
        });
    }
    showCamera() {
        if (this.picture) return;
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                this.video.nativeElement.srcObject = stream;
                this.picture = true;
                this.taken = false;
            })
            .catch(() => {
                alert("votre camera ne fonctionne pas ou veuillez l'autoriser");
            });
    }
    onChangeFile(labelPhoto) {
        if (
            this.file.nativeElement.files &&
            this.file.nativeElement.files.length
        ) {
            if (
                !/\.(gif|jpg|jpeg|tiff|png)$/i.test(
                    this.file.nativeElement.files[0].name
                )
            ) {
                alert('Veuillez sélectionner une image');
                return;
            }
            let reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result)
                    labelPhoto.style.backgroundImage =
                        'url(' + e.target.result + ')';
                sendFileToServer(this.file.nativeElement.files[0], resp => {
                    this.settingsAccount.imageUrl = '';
                    if (resp && resp != 'NONE') {
                        this.settingsAccount.imageUrl = resp;
                        this.settingsAccount.image_url = resp;
                        this.updatePhoto();
                    } else {
                        this.alertService.warning("La mise à jour de votre photo de profil a échoué, veuillez réessayer");
                    }
                });
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
            this.label = '';
        } else this.label = 'Selectionnez une photo';
    }
}
