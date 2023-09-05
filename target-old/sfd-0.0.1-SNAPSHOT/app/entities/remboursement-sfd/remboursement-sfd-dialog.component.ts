import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RemboursementSFD } from './remboursement-sfd.model';
import { RemboursementSFDPopupService } from './remboursement-sfd-popup.service';
import { RemboursementSFDService } from './remboursement-sfd.service';
import { ResponseWrapper, UserData, LOCAL_FLAG } from '../../shared';
import { EcheancesSFD } from '../echeancier-sfd/echeances-sfd/echeances-sfd.model';
import { EcheancesSFDService } from '../echeancier-sfd/echeances-sfd/echeances-sfd.service';
declare let select_init: any;
@Component({
    selector: 'jhi-remboursement-sfd-dialog',
    templateUrl: './remboursement-sfd-dialog.component.html'
})
export class RemboursementSFDDialogComponent implements OnInit {
    remboursementSFD: RemboursementSFD;
    authorities: any[];
    isSaving: boolean;

    echeancessfds: EcheancesSFD[];
    rembDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private remboursementSFDService: RemboursementSFDService,
        private echeancesSFDService: EcheancesSFDService,
        private eventManager: JhiEventManager
    ) {}
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.echeancesSFDService.query().subscribe(
            (res: ResponseWrapper) => {
                this.echeancessfds = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.remboursementSFD.id !== undefined) {
            this.subscribeToSaveResponse(
                this.remboursementSFDService.update(this.remboursementSFD),
                false
            );
        } else {
            this.remboursementSFD.sfdReference = UserData.getInstance().currentSfdReference;
            this.subscribeToSaveResponse(
                this.remboursementSFDService.create(this.remboursementSFD),
                true
            );
        }
    }

    private subscribeToSaveResponse(
        result: Observable<RemboursementSFD>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: RemboursementSFD) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: RemboursementSFD, isCreated: boolean) {
        this.alertService.success(
            isCreated
                ? 'carmesfnmserviceApp.remboursementSFD.created'
                : 'carmesfnmserviceApp.remboursementSFD.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'remboursementSFDListModification',
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

    trackEcheancesSFDById(index: number, item: EcheancesSFD) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-remboursement-sfd-popup',
    template: ''
})
export class RemboursementSFDPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private remboursementSFDPopupService: RemboursementSFDPopupService
    ) {}

    ngOnInit() {
        /* if(LOCAL_FLAG){
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.remboursementSFDPopupService.open(
          RemboursementSFDDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.remboursementSFDPopupService.open(
          RemboursementSFDDialogComponent as Component
        );
      }
    }); */
        // } else {
        window.history.back();
        //  }
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
