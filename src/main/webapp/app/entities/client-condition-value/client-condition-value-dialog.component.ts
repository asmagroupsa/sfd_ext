import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ClientConditionValue } from './client-condition-value.model';
import { ClientConditionValuePopupService } from './client-condition-value-popup.service';
import { ClientConditionValueService } from './client-condition-value.service';
import { UserData } from '../../shared';

@Component({
    selector: 'jhi-client-condition-value-dialog',
    templateUrl: './client-condition-value-dialog.component.html'
})
export class ClientConditionValueDialogComponent implements OnInit {

    clientConditionValue: ClientConditionValue;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private clientConditionValueService: ClientConditionValueService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.clientConditionValue.id !== undefined) {
            this.subscribeToSaveResponse(this.clientConditionValueService.update(this.clientConditionValue));
        } else {
            this.subscribeToSaveResponse(this.clientConditionValueService.create(this.clientConditionValue));
        }
    }

    private subscribeToSaveResponse(result: Observable<ClientConditionValue>) {
        result.subscribe((res: ClientConditionValue) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: ClientConditionValue) {
        this.eventManager.broadcast({ name: 'clientConditionValueListModification', content: 'OK' });
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
}

@Component({
    selector: 'jhi-client-condition-value-popup',
    template: ''
})
export class ClientConditionValuePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private clientConditionValuePopupService: ClientConditionValuePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.clientConditionValuePopupService
                    .open(ClientConditionValueDialogComponent as Component, params['id']);
            } else {
                this.clientConditionValuePopupService
                    .open(ClientConditionValueDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
