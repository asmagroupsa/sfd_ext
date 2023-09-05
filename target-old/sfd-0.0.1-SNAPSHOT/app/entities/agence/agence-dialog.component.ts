import { Component, OnDestroy, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { HomeService } from '../../shared/mesServices/home-service';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { UserData } from '../../shared/model/singleton';
import { SFD, SFDService } from '../s-fd';
import { ServiceUser, ServiceUserService } from '../service-user';
import { AgencePopupService } from './agence-popup.service';
import { Agence } from './agence.model';
import { AgenceService } from './agence.service';
import {ZoneAgenceService} from "../zone-agence/zone-agence.service";

declare let select_init: any;
@Component({
    selector: 'jhi-agence-dialog',
    templateUrl: './agence-dialog.component.html'
})
export class AgenceDialogComponent implements OnInit {
    checkPosition: boolean;
    agence: Agence;
    authorities: any[];
    isSaving: boolean;
    serviceusers: ServiceUser[];
    sfds: SFD[];
    createdDateDp: any;
    lastModifiedDateDp: any;
    zones = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private agenceService: AgenceService,
        private serviceUserService: ServiceUserService,
        private sFDService: SFDService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private homeService: HomeService,
        private _zoneService: ZoneAgenceService,
    ) { }
    ngAfterViewInit() {
        select_init();
    }
    userPosition(reload: boolean = false) {
        if (reload && !navigator.onLine) {
            alert("Vous n'avez pas la connexion internet pour charger la géolocalisation");
            return;
        }
        this.homeService.getLocation().then((data) => {
            data = data || {};
            this.agence.geoLat = data.lat;
            this.agence.geoLong = data.lon;
            this.checkPosition = true;
        });
    }
    setPosition() {
        this.userPosition();
    }
    ngOnInit() {
        this.isSaving = false;
        this.setPosition();
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.serviceUserService.query().subscribe(
            (res: ResponseWrapper) => {
                this.serviceusers = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.sFDService.query().subscribe(
            (res: ResponseWrapper) => {
                this.sfds = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this._getZones();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (this.isSaving) {
            return;
        }

        if (!this.isValid()) {
            this.alertService.warning('Formulaire invalide');
            this.isSaving = false;
            return;
        }

        this.agence.zone = this.zones.find((i) => i.id === this.agence.zoneId);

        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.agence.id !== undefined) {
                    setLastModifyBy(this.agence, identity);
                    //this.agence.lastModifiedBy = identity.firstName || "";
                    //this.agence.lastModifiedBy += " " + identity.lastName || "";
                    this.subscribeToSaveResponse(
                        this.agenceService.update(this.agence),
                        false
                    );
                } else {
                    setCreateBy(this.agence, identity);
                    //this.agence.createdBy = identity.firstName || "";
                    //this.agence.createdBy += " " + identity.lastName || "";
                    this.agence.codeAgence = '4FDSG67DYY';
                    this.agence.userReference = UserData.getInstance().userReference;
                    this.agence.sfdId =
                        UserData.getInstance().sfdId;
                    if (!this.agence.sfdId) {
                        this.agence.sfdId = UserData.getInstance().listeAgences ? UserData.getInstance().listeAgences[0].sfdId : '';
                    }
                    this.agence.sfdReference =
                        UserData.getInstance().currentSfdReference;
                    if (!this.agence.sfdReference) {
                        if (typeof (UserData.getInstance().sfd) == 'string') {
                            this.agence.sfdReference = UserData.getInstance().sfd;
                        } else {
                            this.agence.sfdReference = UserData.getInstance().sfd.code;
                        }
                    }
                    this.subscribeToSaveResponse(
                        this.agenceService.create(this.agence),
                        true
                    );
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Agence>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Agence) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Agence, isCreated: boolean) {
        if (!UserData.getInstance().listeAgences) {
            UserData.getInstance().listeAgences = [];
        }
        this.agenceService.find(result.id)
            .subscribe((agence) => {
                UserData.getInstance().listeAgences.push(agence);
            });
        this.alertService.success(isCreated ? 'carmesfnmserviceApp.agence.created' : 'carmesfnmserviceApp.agence.updated', { param: result.id }, null);
        this.eventManager.broadcast({
            name: 'agenceListModification',
            content: 'OK'
        });
        this.isSaving = true;
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

    trackSFDById(index: number, item: SFD) {
        return item.id;
    }

    isValid() {
        if (!this.agence) {
            return false;
        }
        if (!this.agence.initiale && this.agence.initiale.length > 4) {
            return false;
        }
        return true;
    }

    private _getZones() {
        this._zoneService.query().toPromise()
        .then((r) => {
            this.zones = r.json;
        })
        .catch(console.error);
    }
}

@Component({
    selector: 'jhi-agence-popup',
    template: ''
})
export class AgencePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private agencePopupService: AgencePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.agencePopupService.open(
                    AgenceDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.agencePopupService.open(
                    AgenceDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
