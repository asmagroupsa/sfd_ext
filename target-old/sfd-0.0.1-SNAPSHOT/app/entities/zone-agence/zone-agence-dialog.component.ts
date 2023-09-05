import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ZoneAgence } from './zone-agence.model';
import { ZoneAgencePopupService } from './zone-agence-popup.service';
import { ZoneAgenceService } from './zone-agence.service';
import { SFD, SFDService } from '../s-fd';
import { ResponseWrapper } from '../../shared';
import { UserData } from '../../shared/model/singleton';

@Component({
    selector: 'jhi-zone-agence-dialog',
    templateUrl: './zone-agence-dialog.component.html'
})
export class ZoneAgenceDialogComponent implements OnInit {
    zoneAgence: ZoneAgence;
    isSaving: boolean;

    sfds: SFD[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private zoneAgenceService: ZoneAgenceService,
        private sFDService: SFDService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.sFDService.query().subscribe(
            (res: ResponseWrapper) => {
                this.sfds = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.zoneAgence.id !== undefined) {
            this.subscribeToSaveResponse(
                this.zoneAgenceService.update(this.zoneAgence)
            );
        } else {
            this.zoneAgence.reference = Date.now() + '';
            this.zoneAgence.sfdId =
                UserData.getInstance().sfdId ||
                UserData.getInstance().listeAgences[0].sfdId;
            this.subscribeToSaveResponse(
                this.zoneAgenceService.create(this.zoneAgence)
            );
        }
    }

    private subscribeToSaveResponse(result: Observable<ZoneAgence>) {
        result.subscribe(
            (res: ZoneAgence) => this.onSaveSuccess(res),
            (res: Response) => this.onSaveError()
        );
    }

    private onSaveSuccess(result: ZoneAgence) {
        if (!UserData.getInstance().listeZones) {
            UserData.getInstance().listeZones = [];
        }
        UserData.getInstance().listeZones.push(result);
        this.eventManager.broadcast({
            name: 'zoneAgenceListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSFDById(index: number, item: SFD) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-zone-agence-popup',
    template: ''
})
export class ZoneAgencePopupComponent implements OnInit, OnDestroy {
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private zoneAgencePopupService: ZoneAgencePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.zoneAgencePopupService.open(
                    ZoneAgenceDialogComponent as Component,
                    params['id']
                );
            } else {
                this.zoneAgencePopupService.open(
                    ZoneAgenceDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
