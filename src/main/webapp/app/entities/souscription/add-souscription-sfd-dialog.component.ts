import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Souscription } from './souscription.model';
import { SouscriptionPopupService } from './souscription-popup.service';
import { SouscriptionService } from './souscription.service';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { UserService } from '../../shared/user/user.service';
import { JhiProfileService } from '../../admin/profile/profile.service';
import { Periodicity } from '../periodicity/periodicity.model';
import { PeriodicityService } from '../periodicity';
declare let select_init: any;
@Component({
    selector: 'jhi-add-souscription-sfd-dialog',
    templateUrl: './add-souscription-sfd-dialog.component.html',
    styles: [
        `
  .advervable{
position:relative;
  }
.advervable label{
  display: inline;
}
.advervable span.lever{
  position: absolute;
    right: 0;
}
  `
    ]
})
export class AddSouscriptionSfdDialogComponent implements OnInit {
    sfdSouscription = {};
    isSaving = false;

    periodicities: Periodicity[];
    loadingArray = {
        typeClient: false,
        periodicities: false,
        typeGaranties: false,
        frais: false,
        conditionAccess: false,
        tranchePenals: false,
        contrats: false,
        penalities: false
    };

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private souscriptionService: SouscriptionService,
        private periodicityService: PeriodicityService,
        private eventManager: JhiEventManager,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private _jhiProfileService: JhiProfileService,
    ) { }

    ngOnInit() {
        // this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.loadingArray.periodicities = true;
        this.periodicityService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.periodicities = res.json;
                this.loadingArray.periodicities = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    trackPeriodicityById(item: Periodicity) {
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

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    save() {
        this.isSaving = true;

        this._jhiProfileService.createProfile(this.sfdSouscription)
            .subscribe(
                () => {
                    this.alertService.success('Souscription SFD créé');
                    this.eventManager.broadcast({
                        name: 'souscriptionListModification',
                        content: 'OK'
                    });
                    this.isSaving = false;
                    this.activeModal.dismiss();
                },
                () => {
                    this.isSaving = false;
                    this.alertService.error('Souscription SFD non créé');
                }
            );
    }
}
