import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ZoneSfd } from './zone-sfd.model';
import { ZoneSfdPopupService } from './zone-sfd-popup.service';
import { ZoneSfdService } from './zone-sfd.service';

@Component({
    selector: 'jhi-zone-sfd-dialog',
    templateUrl: './zone-sfd-dialog.component.html'
})
export class ZoneSfdDialogComponent implements OnInit {

    zoneSfd: ZoneSfd;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private zoneSfdService: ZoneSfdService,
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
        if (this.zoneSfd.id !== undefined) {
            this.subscribeToSaveResponse(
                this.zoneSfdService.update(this.zoneSfd));
        } else {
            this.subscribeToSaveResponse(
                this.zoneSfdService.create(this.zoneSfd));
        }
    }

    private subscribeToSaveResponse(result: Observable<ZoneSfd>) {
        result.subscribe((res: ZoneSfd) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: ZoneSfd) {
        this.eventManager.broadcast({ name: 'zoneSfdListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-zone-sfd-popup',
    template: ''
})
export class ZoneSfdPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private zoneSfdPopupService: ZoneSfdPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.zoneSfdPopupService
                    .open(ZoneSfdDialogComponent as Component, params['id']);
            } else {
                this.zoneSfdPopupService
                    .open(ZoneSfdDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
