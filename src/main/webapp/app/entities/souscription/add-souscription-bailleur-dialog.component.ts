import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {Souscription} from './souscription.model';
import {SouscriptionPopupService} from './souscription-popup.service';
import {SouscriptionService} from './souscription.service';
import {ResponseWrapper} from '../../shared/model/response-wrapper.model';
import {UserService} from '../../shared/user/user.service';
import {JhiProfileService} from '../../admin/profile/profile.service';
import { UserData } from '../../shared/model/singleton';
declare let select_init: any;
@Component({
    selector: 'jhi-add-souscription-bailleur-dialog',
    templateUrl: './add-souscription-bailleur-dialog.component.html'
})
export class AddSouscriptionBailleurDialogComponent implements OnInit {
    bailleursSouscription = {};
    isSaving = false;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private souscriptionService: SouscriptionService,
        private eventManager: JhiEventManager,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private _jhiProfileService: JhiProfileService,
    ) {}

    ngOnInit() {
        // this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        console.log(UserData.getInstance());

    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this._jhiProfileService.createProfile(this.bailleursSouscription)
        .subscribe(
            () => {
                this.alertService.success('Souscription du bailleur créé');
                this.eventManager.broadcast({
                    name: 'souscriptionListModification',
                    content: 'OK'
                });
                this.isSaving = false;
                this.activeModal.dismiss();
            },
            () => {
                this.isSaving = false;
                this.alertService.error('Souscription du bailleur non créé');
            }
        );
    }
}
