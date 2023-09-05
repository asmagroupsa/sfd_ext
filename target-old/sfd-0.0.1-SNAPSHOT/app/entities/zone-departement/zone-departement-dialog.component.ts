import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ZoneDepartement } from './zone-departement.model';
import { ZoneDepartementPopupService } from './zone-departement-popup.service';
import { ZoneDepartementService } from './zone-departement.service';

@Component({
    selector: 'jhi-zone-departement-dialog',
    templateUrl: './zone-departement-dialog.component.html'
})
export class ZoneDepartementDialogComponent implements OnInit {

    zoneDepartement: ZoneDepartement;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private zoneDepartementService: ZoneDepartementService,
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
        if (this.zoneDepartement.id !== undefined) {
            this.subscribeToSaveResponse(
                this.zoneDepartementService.update(this.zoneDepartement));
        } else {
            this.subscribeToSaveResponse(
                this.zoneDepartementService.create(this.zoneDepartement));
        }
    }

    private subscribeToSaveResponse(result: Observable<ZoneDepartement>) {
        result.subscribe((res: ZoneDepartement) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: ZoneDepartement) {
        this.eventManager.broadcast({ name: 'zoneDepartementListModification', content: 'OK'});
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
    selector: 'jhi-zone-departement-popup',
    template: ''
})
export class ZoneDepartementPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private zoneDepartementPopupService: ZoneDepartementPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.zoneDepartementPopupService
                    .open(ZoneDepartementDialogComponent as Component, params['id']);
            } else {
                this.zoneDepartementPopupService
                    .open(ZoneDepartementDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
