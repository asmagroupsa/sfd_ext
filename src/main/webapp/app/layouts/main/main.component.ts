import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiLanguageService } from 'ng-jhipster';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Observable';

import { SFDService } from '../../entities/s-fd';
import {
    createRequestOption,
    JhiLanguageHelper,
    LOCAL_FLAG,
    ResponseWrapper,
    sendFileToServer,
    UserData,
    inactivityTime,
    READBITFILEURL,
    Account,
} from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { ThemePalette } from '../../shared/constants/theme';
import { LoginService } from '../../shared/login/login.service';
import { HomeService } from '../../shared/mesServices/home-service';
import { EventBus } from '../../shared/model/functions';
import { LanguesService } from '../../shared/myTranslation/langues';
import { ProfileService } from '../profiles/profile.service';
import { MainService } from './main.service';
import { FirstConnectionModalService } from '../../shared/first-connection/modal-service';

declare let jQuery: any;
declare let select_init: any;
declare const modalHide: any;
@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.scss']
})
export class JhiMainComponent implements OnInit, AfterViewInit {
    affectationsRessources: string[];
    errorSession: boolean = false;
    agenceNameReste: number;
    agenceNameTitle = '';
    sfdName: string;
    creditsRessources: any[];
    comitiesRessources: any[];
    dossiersRessources: any[];
    clientsRessources: any[];
    userTime: number = 0;
    //picture: any = 'http://lab.groupasma.com:8787/fileupload/api/files/img_202103-1617121256813.jpg';
    //picture: any = 'http://185.98.137.71:9000/uploads/img_202103-1617121256813.jpg';
    //picture: any = 'http://185.98.137.71:9000/uploads/ads_aveboakx-1689593791034.jpg';
    picture: any = 'http://185.98.137.71:8989/uploads/ads_aveboakx-1689593791034.jpg';
    public disabled = false;
    public height: string;
    public status: { isopen: boolean } = { isopen: false };
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    account: Account | any;
    produitsRessources: string[] = null;
    partnersRessources: string[] = null;
    /*   private isPrintSheet: boolean; */
    sessionOff: string = '';
    agenceName: string = '';
    clearTimed;
    leftTime: number = 0;
    valideSession: string = 'Continuer ma session';
    clearFiveTimed;
    tapePassword: boolean = false;
    password: string = '';
    @ViewChild('file') file: ElementRef;
    @ViewChild('labelPhoto') labelPhoto: ElementRef;
    @ViewChild('labelPhoto2') labelPhoto2: ElementRef;
    @ViewChild('labelPhoto3') labelPhoto3: ElementRef;
    @ViewChild('labelPhoto4') labelPhoto4: ElementRef;
    isSavingPicture: boolean = false;
    headFootImage: any = {};
    ImageHasBeenSend: boolean = false;
    headPlaceholder: string = "Chargez l'image";
    footerPlaceholder: string = "Chargez l'image";
    label: any = {
        head: "Selectionnez l'image d'en-tête de page",
        foot: "Selectionnez l'image de pied de page"
    };
    requis: boolean = false;
    imageHeight: any;
    imageWidth: any;
    isHeader: boolean = false;
    headPictureUrl: any = null;
    footPictureUrl: any = null;
    headerHasBeenSend: boolean = false;
    footerHasBeenSend: boolean = false;
    isHeaderPaysage: boolean = false;
    isFootPaysage: boolean = false;
    headPaysagePictureUrl: any = null;
    footPaysagePictureUrl: any = null;
    headerPaysageHasBeenSend: boolean = false;
    footerPaysageHasBeenSend: boolean = false;
    localFlag: boolean;
    hasManyAgences: boolean = false;
    agences: any[] = [];
    currentAgence: any = 'ALL_AGENCE';
    appOpened: string = '';
    t;

    initialize() {
        this.agenceName = '';
        this.agenceNameReste = null;
        this.agenceNameTitle = '';
        this.sfdName = '';
        this.picture = '../../../content/coreUi/assets/img/avatars/6.jpg';
        this.disabled = false;
        this.account = null;
        this.hasManyAgences = false;
        this.activeModal.dismiss({});
    }
    inactivityHandler() {
        let t;
        //window.onload = resetTimer;
        window.onmousemove = resetTimer; // catches mouse movements
        window.onmousedown = resetTimer; // catches mouse movements
        window.onclick = resetTimer; // catches mouse clicks
        window.onscroll = resetTimer; // catches scrolling
        window.onkeypress = resetTimer; //catches keyboard actions


        function resetTimer() {
            clearTimeout(t);
            //t = setTimeout(logout, 1000 * 60 * 10); // time is in milliseconds (1000 is 1 second)
        }
    }

    onAgenceChange(ev) {
        if (!ev) return;
        if (ev == 'ALL_AGENCE') UserData.getInstance().currentAgence = null;
        else
            UserData.getInstance().currentAgence = ev;
        const url: string = this.router.url;
        this.router.navigate(['/']).then(() => {
            this.router.navigateByUrl(url);
        });
    }

    constructor(
        private router: Router,
        public activeModal: NgbActiveModal,
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private langues: LanguesService,
        private languageHelper: JhiLanguageHelper,
        public principal: Principal,
        private profileService: ProfileService,
        public themePalette: ThemePalette,
        private homeService: HomeService,
        private http: Http,
        private domSanitizer: DomSanitizer,
        private sfdService: SFDService,
        private cookieService: CookieService,
        private mainService: MainService,
        private _alertService: JhiAlertService,
        private firstPopupService: FirstConnectionModalService
    ) {

        this.localFlag = LOCAL_FLAG;
        //this.appOpened = this.cookieService.get('tab');
        this.activeModal.dismiss({});
/*         this.isPrintSheet = UserData.getInstance().isPrintSheet.cle;
 */        let isChrome =
            /Chrome/i.test(navigator.userAgent) &&
            /Google Inc/i.test(navigator.vendor);
        if (!isChrome) {
            alert(
                "Ce navigateur n'est pas autoriser,Veuillez vous connecter avec le navigateur Chrome s'il vous plaît !!!"
            );
            this.logout();
            this.router.navigate(['/error', 'accessdenied']);
        } else {
            let verOffset = navigator.userAgent.indexOf('Chrome');
            let fullVersion: any = navigator.userAgent.substring(verOffset + 7);
            fullVersion = parseInt('' + fullVersion, 10);
            if (fullVersion < 60) {
                alert(
                    "Votre navigateur Chrome est un peu vieux, Veuillez télécharger un navigateur Chrome plus récent s'il vous plaît !!!"
                );
                this.logout();
                this.router.navigate(['/error', 'accessdenied']);
            }
        }
        this.height = window.innerHeight - 55 + 'px';
        this.loadRessources();
        if (!this.appOpened) {
            principal.identity().then(() => { }).catch(() => { });
        }

    }


    onChangeFile(labelPhoto, labelPhoto2, labelPhoto3, labelPhoto4) {
        if (this.file.nativeElement.files && this.file.nativeElement.files.length) {
            if (
                !/\.(gif|jpg|jpeg|tiff|png)$/i.test(
                    this.file.nativeElement.files[0].name
                )
            ) {
                this._alertService.error('Veuillez sélectionner une image');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.isSavingPicture = true;
                let img = new Image;
                img.onload = () => {
                    if (
                        (!this.isHeader && img.width == 500 && img.height == 50)
                        ||
                        (this.isHeader && img.height == 60 && img.width == 500)
                        ||
                        (this.isHeaderPaysage && img.height == 60 && img.width == 750)
                        ||
                        (this.isFootPaysage && img.height == 50 && img.width == 750)
                    ) {
                        sendFileToServer(this.file.nativeElement.files[0], resp => {
                            if (resp != 'NONE') {
                                if (this.isHeaderPaysage) {
                                    this.headPaysagePictureUrl = resp;
                                    this.isSavingPicture = false;
                                    this.headerPaysageHasBeenSend = true;
                                    this.headPlaceholder = "Image chargée"
                                    labelPhoto3.style.backgroundImage = 'url(' + e.target.result + ')';
                                    this.label.head = '';

                                    this.headPictureUrl = (this.headPictureUrl == undefined) ? null : this.headPictureUrl;
                                    this.footPictureUrl = (this.footPictureUrl == undefined) ? null : this.footPictureUrl;
                                    this.footPaysagePictureUrl = (this.footPaysagePictureUrl == undefined) ? null : this.footPaysagePictureUrl;
                                } else if (this.isHeader) {
                                    this.headPictureUrl = resp;
                                    this.isSavingPicture = false;
                                    this.headerHasBeenSend = true;
                                    this.headPlaceholder = "Image chargée"
                                    labelPhoto.style.backgroundImage = 'url(' + e.target.result + ')';
                                    this.label.head = '';

                                    this.headPaysagePictureUrl = (this.headPaysagePictureUrl == undefined) ? null : this.headPaysagePictureUrl;
                                    this.footPictureUrl = (this.footPictureUrl == undefined) ? null : this.footPictureUrl;
                                    this.footPaysagePictureUrl = (this.footPaysagePictureUrl == undefined) ? null : this.footPaysagePictureUrl;
                                } else if (this.isFootPaysage) {
                                    this.footPaysagePictureUrl = resp;
                                    this.isSavingPicture = false;
                                    this.footerPaysageHasBeenSend = true;
                                    this.headPlaceholder = "Image chargée"
                                    labelPhoto4.style.backgroundImage = 'url(' + e.target.result + ')';
                                    this.label.head = '';

                                    this.headPaysagePictureUrl = (this.headPaysagePictureUrl == undefined) ? null : this.headPaysagePictureUrl;
                                    this.footPictureUrl = (this.footPictureUrl == undefined) ? null : this.footPictureUrl;
                                    this.headPictureUrl = (this.headPictureUrl == undefined) ? null : this.headPictureUrl;
                                } else {
                                    this.footPictureUrl = resp;
                                    this.isSavingPicture = false;
                                    this.footerHasBeenSend = true;
                                    this.footerPlaceholder = "Image chargée"
                                    this.label.foot = '';
                                    labelPhoto2.style.backgroundImage = 'url(' + e.target.result + ')';

                                    this.headPaysagePictureUrl = (this.headPaysagePictureUrl == undefined) ? null : this.headPaysagePictureUrl;
                                    this.footPaysagePictureUrl = (this.footPaysagePictureUrl == undefined) ? null : this.footPaysagePictureUrl;
                                    this.headPictureUrl = (this.headPictureUrl == undefined) ? null : this.headPictureUrl;
                                }

                            } else this._alertService.error('le chargement du fichier a échoué. Veuillez réessayer');
                            this.file.nativeElement.value = "";
                        });
                    } else this._alertService.error(" Dimensions non respectées")
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
        } else this.label = 'Selectionnez une image';
    }

    public saveTo() {
        //let sfdRef =
        const args = {
            sfdRef: UserData.getInstance().currentSfdReference,
            header: this.headPictureUrl,
            footer: this.footPictureUrl,
            header_pay: this.headPaysagePictureUrl,
            footer_pay: this.footPaysagePictureUrl,
        }
        this.mainService.updateHeaderFooter(args)
            .subscribe(res => {
                if (res.resultat == "OK") {
                    this._alertService.success("ajout avec succès");
                    UserData.getInstance().sfd_.entete = this.headPictureUrl;
                    UserData.getInstance().sfd_.piedPage = this.footPictureUrl;
                    UserData.getInstance().sfd_.entetePaysage = this.headPaysagePictureUrl;
                    UserData.getInstance().sfd_.piedPagePaysage = this.footPaysagePictureUrl;
                }
                else this._alertService.error("un problème est survenu, veuillez rééssayer");
            })
    }

    getUSerTime(): number {
        let userTime: string = window.localStorage.getItem('userTime') || '0';
        this.userTime = parseInt(userTime, 10);
        return this.userTime;
    }

    setUSerTime(clear: boolean = false) {
        if (!window.localStorage.getItem('userTime')) {
            if (clear) {
                window.localStorage.removeItem('userTime');
            } else {
                let userTime: number = Date.now();
                window.localStorage.setItem('userTime', '' + userTime);
            }
        }
    }

    ngAfterViewInit() {

        jQuery(document).ready(function () {
            jQuery('.drop .drop-content a').click(function () {
                jQuery(this)
                    .parent()
                    .addClass('hide');
            });
            jQuery('.drop').hover(function () {
                jQuery(this)
                    .find('.drop-content')
                    .removeClass('hide');
            });
        });
        this.homeService.getLocation().then(() => {

        });
    }

    changeTheme(theme: number) {
        this.themePalette.changeTheme(theme);
    }

    public toggled(): void {
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string =
            routeSnapshot.data && routeSnapshot.data['pageTitle']
                ? routeSnapshot.data['pageTitle']
                : 'sfdApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    changeLanguage(languageKey: string) {
        this.langues.changeLang(languageKey);
        this.languageService.changeLanguage(languageKey);
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.router.navigate(['/login']);
    }

    onFileClick(file: any, isHead: boolean) {
        file.click();
        this.isHeader = isHead;
    }

    onPaysageFileClick(file: any, isHead: boolean) {
        file.click();
        //this.isHeaderPaysage = isHead;
        if (isHead) {
            this.isHeaderPaysage = true;
        } else {
            this.isFootPaysage = true;
        }
    }

    logout(state: boolean = false) {
        this.activeModal.dismiss({});
        this.loginService
            .logout(state)
            .then(() => {
                window.localStorage.removeItem('userTime');
                EventBus.publish('ressources', null);
                this.initialize();
                this.router.navigate(['/login']);
            })
            .catch(() => {
                //this.router.navigate(['/login']);
            });
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    closeModal(continueSession: boolean = false) {
        if (continueSession) {
            if (!this.tapePassword || !this.password) {
                this.tapePassword = true;
                this.valideSession = 'Validez';
                return;
            }
            this.errorSession = false;
            this.valideSession = 'Continuer ma session';
            this.sessionOff = '';
            let credentials = {
                username: this.principal.userIdentity
                    ? this.principal.userIdentity.login
                    : '',
                password: this.password,
                rememberMe: false
            };
            this.loginService
                .login(credentials)
                .then(account => {
                    if (account) {
                        clearTimeout(this.clearTimed);
                        clearInterval(this.clearFiveTimed);
                        this.leftTime = 0;
                        this.password = '';
                        this.errorSession = false;
                        this.tapePassword = false;
                        modalHide('#session-modal');
                    } else {
                        this.errorSession = true;
                    }
                })
                .catch(() => {
                    this.errorSession = true;
                });
        } else {
            this.errorSession = false;
            modalHide('#session-modal');
        }
    }

    ngOnInit() {
        //this.firstPopupService.open();
        this.principal.getFirstAuthenticationState().subscribe((isFirst) => {
            if (isFirst === true) {
                // console.log('valuer de isFirst', isFirst);
                // this._router.navigate(['/first-connection']);
                this.firstPopupService.open();
                //this.router.navigate(['/']);
            } else if (isFirst === false) {
                // console.log('valuer de isFirst', isFirst);
                // this._router.navigate(['/first-connection'], { queryParams: { step: 1 } });

                this.router.navigate(['/']);
            }
        });

        EventBus.subscribe('NOT_AUTHORIZED', value => {
            if (value) {
                //this.logout(true);
            }
        });

        EventBus.subscribe('agences', agences => {
            if (agences && typeof agences == 'string') {
                this.sfdService
                    .query({ 'code.equals': agences })
                    .subscribe((res: ResponseWrapper) => {
                        let sfd = res.json;
                        if (sfd && sfd[0]) {


                            this.sfdName = sfd[0].name;
                            UserData.getInstance().sfdName = sfd[0].name;
                            // UserData.getInstance().sfd = sfd[0]
                            // EventBus.publish('sfd', UserData.getInstance().sfd)
                            this.agenceName = 'Toutes les agences';
                        }
                    });
                return true;
            }
            this.agences = Array.isArray(agences) ? agences : [agences];
            const ags = [];

            this.sfdService.find(agences[0].sfdId).subscribe(sfd => {
                this.sfdName = sfd.name;
                UserData.getInstance().sfdName = sfd.name;
            });

            this.agenceName = agences[0] ? agences[0].name : agences[0];

            for (const a of agences) ags.push(a.name);

            if (agences.length > 1) {
                this.agenceName = `${this.agenceName}(+${agences.length - 1})`;
                this.hasManyAgences = true;
            }
            this.agenceNameTitle = ags.join(', ');
            select_init();
        });

        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });
        this.principal.photoUpdateState().subscribe(account => {
            this.account = account;
            this.onLoaded();
        });

        this.principal.getAuthenticationState().subscribe(account => {
            this.account = account;
            if (account) {

                this.cookieService.put('tab', '-~-|_#_*_*');
                window.sessionStorage.setItem('tab', '-~-|_#_*_*');
                this.setUSerTime();
                this.getUSerTime();
                this.inactivityHandler();
                this.onLoaded();
                this.langues.getEnglish().subscribe(
                    () => {
                        //
                    },
                    () => {
                        //
                    }
                );
            } else {
                this.setUSerTime(true);
                clearTimeout(this.clearTimed);
                clearInterval(this.clearFiveTimed);
                this.leftTime = 0;
                this.sessionOff = '';
                this.hasManyAgences = false;
            }
        });
        this.profileService.getProfileInfo().subscribe(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.languageHelper.updateTitle(
                    this.getPageTitle(this.router.routerState.snapshot.root)
                );
            }
        });

        /* addEventListener('unload', async () => {
            console.log('this.logout();');
            await this.logout();
        }); */

        window.onbeforeunload = async () => {
            await this.logout();
            return '';
        };

        //console.log("ENtete : "+UserData.getInstance().getSFD().entete);
        this.headPlaceholder = (UserData.getInstance().getSFD() && UserData.getInstance().getSFD().entete) ? UserData.getInstance().getSFD().entete : "Chargez l'image";
    }

    onLoaded() {
        if (!this.account) return;
        let url = this.account['imageUrl'] || this.account['imageURL'];
        this.picture = this.domSanitizer.bypassSecurityTrustUrl(`${READBITFILEURL}${url}`);
        console.log(this.account);
        if (!url) return;
        if (
            url.indexOf('../../../content/coreUi/assets/img/avatars/6.jpg') !=
            -1
        ) {
            return;
        }

        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
       // options.headers.append('Access-Control-Allow-Origin', 'http://localhost:9003');
        //options.headers.append('Access-Control-Allow-Credentials', 'true');
        this.http
            .get(`${READBITFILEURL}${url}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            })
            .subscribe(url => {
                this.picture = this.domSanitizer.bypassSecurityTrustUrl(url);
            });
    }

    loadRessources() {
        this.produitsRessources = [
            'carmesfnmservice/api/produits/getAllProduits',
            'carmesfnmservice/api/type-garanties/getAllTypeGaranties',
            'carmesfnmservice/api/taux-epargnes/getAllTauxEpargnes',
            'carmesfnmservice/api/frais/getAllFrais',
            'carmesfnmservice/api/peridicities/getAllPeridicities',
            'carmesfnmservice/api/account-types/getAllAccountTypes',
            'carmesfnmservice/api/tranche-penals/getAllTranchePenals'
        ];
        this.partnersRessources = [
            'carmesfnmservice/api/partners/getAllPartners',
            'carmesfnmservice/api/ligne-credits/getAllLigneCredits',
            'carmesfnmservice/api/getAllRemboursementSFDS',
            'carmesfnmservice/api/rembt-penal-sfds/getAllRembtPenalSFDS',
            'carmesfnmservice/api/ligne-requests/getAllLigneRequests'
        ];
        this.clientsRessources = [
            'carmesfnmservice/api/clients/getAllClients',
            'carmesfnmservice/api/leaders/gatAllLeaders',
            'carmesfnmservice/api/comptes/gatAllComptes',
            'carmesfnmservice/api/condition-acces/getAllConditionAcces'
        ];
        this.dossiersRessources = [
            'carmesfnmservice/api/credit-requests/getAllCreditRequests',
            'carmesfnmservice/api/etudes/getAllEtudes'
        ];
        this.comitiesRessources = [
            'carmesfnmservice/api/credit-comities/getAllCreditComities',
            'carmesfnmservice/api/disponibilites/getAllDisponibilites',
            'carmesfnmservice/api/validations/getAllValidations',
            'carmesfnmservice/api/notification-clients/getAllNotificationClients'
        ];
        this.affectationsRessources = [
            'carmesfnmservice/api/sfd/listeMarchandPourAffectation',
            'carmesfnmservice/api/client/listeClientTransfererParUser',
            'carmesfnmservice/api/client/listeDossierTransfererParUser'
        ];
        this.creditsRessources = [
            'carmesfnmservice/api/credits/getAllCredits',
            'carmesfnmservice/api/echeancier-clients/getAllEcheancierlients'
        ];
    }

    jhiHasAnyRessources(r) {
        return this.principal.hasAnyRessources(r);
    }

    isSousTraitant() {
        return UserData.getInstance().isSousTraitant();
    }

    @HostListener('document:click', ['$event'])
    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:wheel', ['$event'])
    @HostListener('document:keyup', ['$event'])

    inactive() {
        clearTimeout(this.t);

        if (!this.principal.isAuthenticated() && !this.account) {
            return;
        }

        for (const role of ['DASHBOARD_SFD', 'ROLE_ADMIN']) {
            if ((this.account.authorities || []).indexOf(role) !== -1) {
                return;
            }
        }

        const f = () => {
            this.t = setTimeout(async () => {
                clearTimeout(this.t);

                try {
                    await this.loginService.logout();
                    await this.router.navigate(['/login']);
                    this.login();
                }
                catch (e) {
                    console.error(e);
                    f();
                }
            }, inactivityTime);
        };

        f();
    }
}
