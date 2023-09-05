import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RembtPenal } from './rembt-penal.model';
import { RembtPenalPopupService } from './rembt-penal-popup.service';
import { RembtPenalService } from './rembt-penal.service';
import { ResponseWrapper, UserData, LOCAL_FLAG } from '../../shared';
import { EcheancesClient } from '../echeancier-client/echeances-client/echeances-client.model';
import { EcheancesClientService } from '../echeancier-client/echeances-client/echeances-client.service';
declare let select_init: any;
@Component({
    selector: 'jhi-rembt-penal-dialog',
    templateUrl: './rembt-penal-dialog.component.html'
})
export class RembtPenalDialogComponent implements OnInit {
    rembtPenal: RembtPenal;
    authorities: any[];
    isSaving: boolean;

    echeancesclients: EcheancesClient[];
    rembPenalDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private rembtPenalService: RembtPenalService,
        private echeancesClientService: EcheancesClientService,
        private eventManager: JhiEventManager
    ) {}
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.echeancesClientService
            .query({ filter: 'rembtpenal-is-null' })
            .subscribe(
                (res: ResponseWrapper) => {
                    if (!this.rembtPenal.echeancesClientId) {
                        this.echeancesclients = res.json;
                    } else {
                        this.echeancesClientService
                            .find(this.rembtPenal.echeancesClientId)
                            .subscribe(
                                (subRes: EcheancesClient) => {
                                    this.echeancesclients = [subRes].concat(
                                        res.json
                                    );
                                },
                                (subRes: ResponseWrapper) =>
                                    this.onError(subRes.json)
                            );
                    }
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.rembtPenal.id !== undefined) {
            this.subscribeToSaveResponse(
                this.rembtPenalService.update(this.rembtPenal),
                false
            );
        } else {
            this.subscribeToSaveResponse(
                this.rembtPenalService.create(this.rembtPenal),
                true
            );
        }
    }

    private subscribeToSaveResponse(
        result: Observable<RembtPenal>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: RembtPenal) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: RembtPenal, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.rembtPenal.created'
                : 'carmesfnmserviceApp.rembtPenal.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'rembtPenalListModification',
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

    trackEcheancesClientById(index: number, item: EcheancesClient) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-rembt-penal-popup',
    template: ''
})
export class RembtPenalPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private rembtPenalPopupService: RembtPenalPopupService
    ) {}

    ngOnInit() {
        /* if(LOCAL_FLAG){
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.rembtPenalPopupService.open(
          RembtPenalDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.rembtPenalPopupService.open(
          RembtPenalDialogComponent as Component
        );
      }
    });
     } else { */
        window.history.back();
        //}
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
