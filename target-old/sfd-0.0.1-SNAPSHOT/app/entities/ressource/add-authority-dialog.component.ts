import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {Ressource} from './ressource.model';
import {RessourcePopupService} from './ressource-popup.service';
import {RessourceService} from './ressource.service';
import {ResponseWrapper} from '../../shared/model/response-wrapper.model';
import {UserService} from '../../shared/user/user.service';
import {JhiProfileService} from '../../admin/profile/profile.service';
declare let select_init: any;
@Component({
    selector: 'jhi-add-authority-dialog',
    templateUrl: './add-authority-dialog.component.html'
})
export class AddAuthorityDialogComponent implements OnInit {
    authority = {};
    isSaving = false;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private ressourceService: RessourceService,
        private eventManager: JhiEventManager,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private _jhiProfileService: JhiProfileService,
    ) {}

    ngOnInit() {
        // this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this._jhiProfileService.createProfile(this.authority)
        .subscribe(
            () => {
                this.alertService.success('Profil créé');
                this.eventManager.broadcast({
                    name: 'ressourceListModification',
                    content: 'OK'
                });
                this.isSaving = false;
                this.activeModal.dismiss();
            },
            () => {
                this.isSaving = false;
                this.alertService.error('Profil non créé');
            }
        );
    }
}
