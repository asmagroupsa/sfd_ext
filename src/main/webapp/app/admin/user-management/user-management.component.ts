import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response, Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
    JhiEventManager,
    JhiPaginationUtil,
    JhiParseLinks,
    JhiAlertService
} from 'ng-jhipster';

import {
    ITEMS_PER_PAGE,
    Principal,
    User,
    UserService,
    ResponseWrapper,
    createRequestOption,
    READFILEURL,
    EventBus,
    READBITFILEURL
} from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { styles } from '../../entities/remboursement-sfd/remboursement-sfd.component.scss.shim.ngstyle';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthorityResourceService } from '../../entities/authority-resource';
import { Observable } from 'rxjs';
import { CountryService } from '../../entities/country';
declare let select_init: any;
declare let modal: any;
declare let modalHide: any;
@Component({
    selector: 'jhi-user-mgmt',
    templateUrl: './user-management.component.html',
    styles: [
        `
        .lever{
            margin-left: 0px !important;
        }
        .badge{
          color: white;
        }
        `
    ]
})
export class UserMgmtComponent implements OnInit, OnDestroy {
    isProcessing: boolean;
    password: any;
    currentUser: any;
    currentAccount: any;
    users: User[];
    error: any;
    success: any;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    authorities: any[] = [];
    showPhoto: boolean = false;
    imgShownUrl: string;
    titleShown: string;
    profils: any[] = [];
    currentProfil = 'ALL';
    currentCountry;
    countries:any = [];

    constructor(
        private userService: UserService,
        private countryService: CountryService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private activatedRoute: ActivatedRoute,
        public domSanitizer: DomSanitizer,
        private http: Http,
        private router: Router,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
    }
    ngAfterViewInit() {
        this._slectInit();
    }
    isDG(user,field){
        return user && (user.authority.indexOf('DG') != -1 || user.authority.indexOf('DIRECTEUR_EXECUTIF') != -1) && field  && field.indexOf('content/coreUi/assets/img') == -1;
    }
    onCountryChange(){
        this.loadAll();
    }
    onProfilChange(){
        select_init();
    }
getDoc(url: string): string {
        return READFILEURL + `${url}`;
    }
    showLargePhoto(user) {
        if (user) {
            this.titleShown = "La photo de l'utilisateur " + user.first_name + ' ' + user.last_name;
            this.imgShownUrl = user.picture;
            this.showPhoto = true;
        }
    }
    onPhotoClose(ev) {
        this.titleShown = '';
        this.imgShownUrl = '';
        this.showPhoto = false;
    }
    onLoaded(user: any, url: string = '1.png') {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
            .get(`${READBITFILEURL}${url}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            })
            .subscribe(url => {
                user.picture = this.domSanitizer.bypassSecurityTrustUrl(
                    url
                );
            });
    }
    changePassword() {
        if (this.currentUser) {
            this.isProcessing = true;
            this.userService
                .changePassword(this.currentUser.login, this.password)
                .subscribe((response: ResponseWrapper) => {
                    if (response.json.resultat == 'OK') {
                        this.alertService.success("Mot de passe réinitialisé");
                        this.isProcessing = false;
                        this.closeModal();

                    } else {
                        this.isProcessing = false;
                        this.alertService.error("Une erreur s'est produite lors de la réinitialisation");
                    }
                }, (error) => {
                    this.isProcessing = false;
                    this.alertService.error("Une erreur s'est produite lors de la réinitialisation");
                });
        }
    }
    closeModal(selector: string = '.ui.tiny.modal.changePass') {
        modalHide(selector);
        this.currentUser = null;
        this.password = "";
    }
    showModal(user: any, classe = "changePass") {
        if (!user) return;
        this.currentUser = user;
        this.password = "";
        modal(`.ui.tiny.modal.${classe}`);
    }
    deconnecter(user: any) {
        if (!user.login || !user.connecter) return;
        this.userService
            .deconnecterUser(user.login)
            .subscribe((response: ResponseWrapper) => {
                if (response.json.resultat == 'OK') {
                    user.connecter = false;
                }
            });
    }
    ngOnInit() {
        //this.authorities =   || [];
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.countryService.query()
            .subscribe(
                (res: ResponseWrapper)=>{
                    this.countries = res.json;
                    if(this.countries.length){
                       this.currentCountry = this.countries[0].id;
                    this.loadAll();   
                    }
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
            
            this.registerChangeInUsers();
        });

        this._loadProfils({ size: 1000 });
    }

    ngOnDestroy() {
        this.routeData.unsubscribe();
    }

    registerChangeInUsers() {
        this.eventManager.subscribe('userListModification', response =>
            this.loadAll()
        );
    }

    setActive(user, isActivated: boolean) {
        if (!user) return;
        this.isProcessing = true;
        this.userService.activerDesactiverUser(user.login, isActivated).subscribe(response => {
            if (response.status === 200 && response.json == 'OK') {
                this.error = null;
                this.success = 'OK';
                user.activated = isActivated;
                this.isProcessing = false;
                this.closeModal('.ui.tiny.modal.confirm-activated');
                //this.loadAll();
            } else {
                this.success = null;
                this.error = 'ERROR';
                this.isProcessing = false;
                this.closeModal('.ui.tiny.modal.confirm-activated');
            }
        });
    }

    loadAll() {
        this.userService
            .queryUsers(this.currentCountry)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    trackIdentity(index, item: User) {
        return item.id;
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    createUser(){
        this.router.navigate(['/admin', { outlets: { popup: ['user-management-new'] } }], {
            queryParams: {
                country: this.currentCountry
            }
        });
}

    transition() {
        this.router.navigate(['/admin', 'user-management'], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        this.users = data.map(user => {
            let excludes = ['../../../content/images/avatar.png', "../../../content/coreUi/assets/img/avatars/6.jpg"];
            if (user.image_url && excludes.indexOf(user.image_url) == -1) this.onLoaded(user, user.image_url);
            else user.picture = '../../../content/images/avatar.png';
            return user;
        });
    }

    private onError(error) {
        this.alertService.error(error.error, error.message, null);
    }

    getUsers() {
        return this.currentProfil === 'ALL' ? this.users : this.users.filter((user: any) => user.authority.indexOf(this.currentProfil) !== -1);
    }

    private _slectInit() {
        select_init((query, id) => {
            if (id === 'profiles') {
                this._loadProfils({});
            }
        });
    }

    private _loadProfils(queries: any = {}) {
        this.userService.authoritys(queries)
            .subscribe((profils) => {
                this.profils = this.profils.concat(profils);
                this._slectInit();
            });
    }
}
