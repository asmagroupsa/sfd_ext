
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import {
    setCreateBy,
    setLastModifyBy
} from '../../shared/model/functions';
import { CreditRequest } from './credit-request.model';
import { CreditRequestPopupService } from './credit-request-popup.service';
import { CreditRequestService } from './credit-request.service';
import {
    ResponseWrapper
} from '../../shared';
import { Principal } from '../../shared/auth/principal.service';

@Component({
    selector: 'jhi-credit-request-montants',
    templateUrl: './credit-request-montants.component.html'
})
export class CreditRequestMontantComponent implements OnInit {
    data: any = [];
    authorities: any[];
    isSaving: boolean;
    creditRequest: CreditRequest;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private creditRequestService: CreditRequestService,
        public principal: Principal,
        private activateRoute: ActivatedRoute
    ) {

    }
    ngOnInit() {
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        if (this.creditRequest && this.creditRequest) {
            this.creditRequest = this.creditRequestService.convert(this.creditRequest);
        }
        this.activateRoute.params.subscribe(params => {
            console.log(params)
            this.creditRequestService.queryMontants(params['id'] || this.creditRequest.id).subscribe(
                (res: ResponseWrapper) => {
                    this.data = res.json;
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.onSaveSuccess('', true);
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
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
}

@Component({
    selector: 'jhi-credit-request-popup',
    template: ''
})
export class CreditRequestMontantsPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditRequestPopupService: CreditRequestPopupService
    ) { }

    ngOnInit() {

        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.creditRequestPopupService.open(
                    CreditRequestMontantComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.creditRequestPopupService.open(
                    CreditRequestMontantComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
