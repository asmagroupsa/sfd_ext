import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { ComityMber } from './comity-mber.model';
import { ComityMberPopupService } from './comity-mber-popup.service';
import { ComityMberService } from './comity-mber.service';
import { ServiceUser, ServiceUserService } from '../service-user';
import { TypeMembre, TypeMembreService } from '../type-membre';
import { ResponseWrapper, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { Agence, AgenceService } from '../agence';
declare let select_init: any;
@Component({
    selector: 'jhi-comity-mber-dialog',
    templateUrl: './comity-mber-dialog.component.html'
})
export class ComityMberDialogComponent implements OnInit {
    agences: Agence[] = [];
    comityMber: ComityMber;
    authorities: any[];
    isSaving: boolean;

    serviceusers: ServiceUser[];

    typemembres: TypeMembre[];
    nominationDateDp: any;
    endNominationDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private comityMberService: ComityMberService,
        private serviceUserService: ServiceUserService,
        private typeMembreService: TypeMembreService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        public agenceService: AgenceService
    ) { }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            this.comityMber.agenceReference = this.agences[0].codeAgence;
        }

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.comityMberService
            .query({
                size: 1000,
                NO_QUERY: true
            })
            .subscribe(
                (res: ResponseWrapper) => {
                    let comitiesMbers: string[] = res.json.map(element => {
                        return element.user;
                    });
                    this.serviceUserService.query({ size: 1000, NO_QUERY: true }, true).subscribe(
                        (res: ResponseWrapper) => {
                            this.serviceusers = res.json.filter(serviceUserOption => {
                                let already: boolean = false;
                                comitiesMbers.forEach(element => {
                                    if ((element == serviceUserOption.last_name + ' ' + serviceUserOption.first_name) || (element == serviceUserOption.first_name + ' ' + serviceUserOption.last_name)) {
                                        already = true;
                                        return;
                                    }
                                });
                                return !already;
                            });
                        },
                        (res: ResponseWrapper) => this.onError(res.json)
                    );
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.typeMembreService.query().subscribe(
            (res: ResponseWrapper) => {
                this.typemembres = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.comityMber.id !== undefined) {
                    setLastModifyBy(this.comityMber, identity);
                    this.subscribeToSaveResponse(
                        this.comityMberService.update(this.comityMber),
                        false
                    );
                } else {
                    setCreateBy(this.comityMber, identity);
                    let serviceUser = this.serviceusers.find(
                        serviceUserOption => {
                            return (
                                serviceUserOption.firstName +
                                ' ' +
                                serviceUserOption.lastName ==
                                this.comityMber.user
                            );
                        }
                    );
                    if (serviceUser) {
                        this.comityMber.userReference = serviceUser.reference;
                    }
                    this.comityMber.sfdReference =
                        UserData.getInstance().currentSfdReference ||
                        UserData.getInstance().sfd;
                    this.subscribeToSaveResponse(
                        this.comityMberService.create(this.comityMber),
                        true
                    );
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<ComityMber>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: ComityMber) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: ComityMber, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.comityMber.created'
                : 'carmesfnmserviceApp.comityMber.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'comityMberListModification',
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

    trackTypeMembreById(index: number, item: TypeMembre) {
        return item.id;
    }

    /* getAgence(reference) {
        let p = new Promise((resolve, reject) => {
            if(reference) {
                let a = this.agences.find((ag) => ag.codeAgence === reference);
    
                if(a) resolve(a.name);
    
                this.agenceService.query({'agenceReference.equals': reference, NO_QUERY: true}).subscribe((r) => {
                    if (0 === r.json.length && r.json.length > 2) resolve('');
                    return resolve(r.json[0].name); 
                });
    
            } else resolve('');
        });

        return p;
    } */
}

@Component({
    selector: 'jhi-comity-mber-popup',
    template: ''
})
export class ComityMberPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private comityMberPopupService: ComityMberPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.comityMberPopupService.open(
                    ComityMberDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.comityMberPopupService.open(
                    ComityMberDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
