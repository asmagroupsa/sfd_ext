import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, ResponseWrapper, READFILEURL, READBITFILEURL } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { HomeService } from '../../shared/mesServices/home-service';
import { EventBus, formatNumberToLocalString, setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { ClientService } from '../client';
import { CreditRequest } from '../credit-request/credit-request.model';
import { CreditRequestService } from '../credit-request/credit-request.service';
import { etude } from '../entity.module';
import { ServiceUser, ServiceUserService } from '../service-user';
import { EtudePopupService } from './etude-popup.service';
import { Etude } from './etude.model';
import { EtudeService } from './etude.service';

declare let select_init: any;

@Component({
    selector: 'jhi-etude-dialog',
    templateUrl: './etude-dialog.component.html'
})
export class EtudeDialogComponent implements OnInit {
    http: any;
    montant: number = 0;
    request: CreditRequest;
    reference: any;
    params: { [key: string]: any };
    checkPosition: boolean;
    isUpdate: boolean = false;
    etude: Etude;
    authorities: any[];
    isSaving: boolean;

    serviceusers: ServiceUser[];

    creditrequests: any[] = [];
    visitDateDp: any;
    etudeDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;
    etudeAmount: string;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private etudeService: EtudeService,
        private serviceUserService: ServiceUserService,
        private creditRequestService: CreditRequestService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public principal: Principal,
        public domSanitizer: DomSanitizer,
        private clientService: ClientService,
        private homeService: HomeService,
        private _http: Http
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }
    ngAfterViewInit() {
        if (this.etude.creditRequestId) this.isUpdate = true;
        select_init();
    }
    userPosition(reload: boolean = false) {
        if (reload && !navigator.onLine) {
            alert("Vous n'avez pas la connexion internet pour charger la géolocalisation");
            return;
        }
        this.homeService.getLocation().then((data) => {
            data = data || {};
            this.etude.geoLat = data.lat;
            this.etude.geoLong = data.lon;
            this.checkPosition = true;
        });
    }
    setPosition() {
        this.userPosition();
        if (!this.etude.etudeTypeId) {
            if (this.params['type'] == 'detaille') {
                this.etude.etudeTypeId = 2;
            } else if (this.params['type'] == 'prealable') {
                this.etude.etudeTypeId = 1;
            }
        }
        if (this.etude.etudeTypeId == 2) {
            this.etudeService
                .queryMontant(+this.params['demande'], 'PREALABLE')
                .subscribe((res: ResponseWrapper) => {
                    this.montant = +res.json.resultat;
                });
        }
        if (!this.etude.creditRequestId) {
            this.etude.creditRequestId = +this.params['demande'];
            if (!this.etude.etudeTypeId) this.etude.etudeTypeId = 1;
        }
    }

    photo(id, url: string = '1.png') {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');

        this.clientService.find(id).subscribe(client => {
            if (client.pictureUrl) {
                this._http
                    .get(`${READBITFILEURL}${client.pictureUrl}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
                    .map((response: any) => {
                        return 'data:image/png;base64,' + response._body;
                    })
                    .subscribe(url => {
                        this.picture = this.domSanitizer.bypassSecurityTrustUrl(
                            url
                        );
                    });
            } else {
                this.picture = null;
            }
        });
    }
    picture: any = null;
    ngOnInit() {
        if (this.etude.id) this.etudeAmount = formatNumberToLocalString(this.etude.amount);

        this.isSaving = false;
        this.setPosition();
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.creditRequestService.find(+this.params['demande']).subscribe(
            (res: any) => {
                this.reference = res.reference;
                this.request = res;
                if (this.request.produit.libelle == 'MCM') {
                    this.etude.amount = this.request.amount;
                    this.etudeAmount = formatNumberToLocalString(this.etude.amount);
                    this.montant = this.etude.amount;
                }
                this.photo(this.request.clientId);

                this.etude.duration = this.request.duration;
                document.querySelector('#myEtudeLabel #lib').innerHTML += ' ' + (this.request.clientLib || ((this.request.client.name || '') + ' ' + (this.request.client.firstName || '') + ' ' + (this.request.denomination || '')));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.serviceUserService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.serviceusers = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        if (this.params['type'] == 'detaille') {
            this.etudeService
                .queryPrealable()
                .subscribe((res: ResponseWrapper) => {
                    this.creditrequests = res.json.resultat;
                });
        } else if (this.params['type'] == 'prealable') {
            this.etudeService
                .queryPrealable('false', true)
                .subscribe((res: ResponseWrapper) => {
                    this.creditrequests = res.json;
                });
        }

        const now = new Date();
        this.etude.etudeDate = {
            day: now.getDate(),
            month: now.getMonth() + 1,
            year: now.getFullYear(),
        };
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, etude, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, base64Data => {
                etude[field] = base64Data;
                etude[`${field}ContentType`] = file.type;
            });
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.etude.id !== undefined) {
                    setLastModifyBy(this.etude, identity);
                    this.subscribeToSaveResponse(
                        this.etudeService.update(this.etude),
                        false
                    );
                } else {
                    setCreateBy(this.etude, identity);
                    this.etude.client = identity.firstName || '';
                    this.etude.client += this.etude.userReference = this.etude.client; //' ' + identity.lastName || '';
                    this.subscribeToSaveResponse(
                        this.etudeService.create(this.etude),
                        true
                    );
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Etude>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Etude) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Etude, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.etude.created'
                : 'carmesfnmserviceApp.etude.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'etudeListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackServiceUserById(index: number, item: ServiceUser) {
        return item.id;
    }

    trackCreditRequestById(index: number, item: CreditRequest) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-etude-popup',
    template: ''
})
export class EtudePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private etudePopupService: EtudePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.etudePopupService.open(
                    EtudeDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.etudePopupService.open(
                    EtudeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
