import { creditComity } from '../entity.module';
import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy, getNewItems } from '../../shared/model/functions';
import { CreditComity } from './credit-comity.model';
import { CreditComityPopupService } from './credit-comity-popup.service';
import { CreditComityService } from './credit-comity.service';
import { Agence, AgenceService } from '../agence';
import { ResponseWrapper, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import {
    DelegationComity,
    DelegationComityService
} from '../delegation-comity';
declare let select_init: any;
@Component({
    selector: 'jhi-credit-comity-dialog',
    templateUrl: './credit-comity-dialog.component.html'
})
export class CreditComityDialogComponent implements OnInit {
    hasMember: boolean = true;
    @Input() creditComity: CreditComity;
    isAgence: boolean = true;
    authorities: any[];
    isSaving: boolean;
    delegationcomities: DelegationComity[];
    agences: Agence[];
    listeAgences: any[] = [];
    startDateDp: any;
    endDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private creditComityService: CreditComityService,
        private delegationComityService: DelegationComityService,
        private agenceService: AgenceService,
        private eventManager: JhiEventManager,
        public principal: Principal
    ) { }

    ngAfterViewInit() {
        select_init((search, id) => {
            if (id == 'field_delegationComity') {
                this.delegationComityService.query({ 'libelle.contains': search }).subscribe(
                    (res: ResponseWrapper) => {
                        this.delegationcomities = this.delegationcomities.concat(getNewItems(this.delegationcomities, res.json));
                    },
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            }
        });
    }/* 
    onTypeChange() {
        this.typecomites.find(typeComity => {
            this.isAgence =
                typeComity.code == 'AGENCE' &&
                    typeComity.id == this.creditComity.typeComiteId
                    ? true
                    : false;
            return typeComity.id == this.creditComity.typeComiteId;
        });
    } */
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.listeAgences = UserData.getInstance().listeAgences || [];
        this.delegationComityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.delegationcomities = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }
    startDateValidate(): boolean {
        if (this.creditComity) {
            let _start = Object.assign({}, this.creditComity.startDate);
            if (!_start.year || !_start.month || !_start.day) return false;
            _start = new Date(_start.year, _start.month, _start.day);
            if (!_start) return false;
            let today = new Date();
            return _start >= today;
        }
        return false;
    }
    endDateValidate(): boolean {
        if (this.creditComity) {
            let _start = Object.assign({}, this.creditComity.startDate);
            let _end = Object.assign({}, this.creditComity.endDate);
            if (!_start.year || !_start.month || !_start.day) return false;
            if (!_end.year || !_end.month || !_end.day) return false;
            _end = new Date(_end.year, _end.month, _end.day);
            _start = new Date(_start.year, _start.month, _start.day);
            if (_start && _end) {
                if (_start > _end) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    onDelegationChange() {
        let delegation = this.delegationcomities.find((delegation) => {
            return delegation.id == this.creditComity.delegationComityId;
        });
        this.hasMember = delegation && delegation['delegatedMembers'] && delegation['delegatedMembers'].length ? true : false;
    }
    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.creditComity.id !== undefined) {
                    setLastModifyBy(this.creditComity, identity);
                    if (!this.creditComity.nonDisponible) this.creditComity.nonDisponible = false;
                    let creditComity = Object.assign({}, this.creditComity);
                    creditComity.delegationComity = null;
                    delete creditComity.delegationComity;
                    this.subscribeToSaveResponse(this.creditComityService.update(creditComity), false);
                } else {
                    this.creditComity.sfdReference =
                        UserData.getInstance().currentSfdReference ||
                        UserData.getInstance().sfd;
                    setCreateBy(this.creditComity, identity);
                    this.creditComity.ligneAccorde = false;
                    this.creditComity.nbrDossierAssigne = 0;
                    this.creditComity.code = 'xxx';
                    this.creditComity.closed = false;
                    this.creditComity.dossierComplets = false;
                    this.creditComity.nonDisponible = false;
                    this.subscribeToSaveResponse(this.creditComityService.create(this.creditComity), true);
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<CreditComity>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: CreditComity) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: CreditComity, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.creditComity.created'
                : 'carmesfnmserviceApp.creditComity.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'creditComityListModification',
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

    trackAgenceById(index: number, item: Agence) {
        return item.id;
    }
    trackDelegationComityById(index: number, item: DelegationComity) {
        return item.id;
    }
    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-credit-comity-popup',
    template: ''
})
export class CreditComityPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditComityPopupService: CreditComityPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.creditComityPopupService.open(
                    CreditComityDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.creditComityPopupService.open(
                    CreditComityDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
