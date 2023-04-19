import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CustomUser } from './custom-user.model';
import { CustomUserPopupService } from './custom-user-popup.service';
import { CustomUserService } from './custom-user.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-custom-user-dialog',
    templateUrl: './custom-user-dialog.component.html'
})
export class CustomUserDialogComponent implements OnInit {

    customUser: CustomUser;
    authorities: any[];
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private customUserService: CustomUserService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.customUser.id !== undefined) {
            this.subscribeToSaveResponse(
                this.customUserService.update(this.customUser), false);
        } else {
            this.subscribeToSaveResponse(
                this.customUserService.create(this.customUser), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<CustomUser>, isCreated: boolean) {
        result.subscribe((res: CustomUser) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CustomUser, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.customUser.created'
            : 'carmesfnmserviceApp.customUser.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'customUserListModification', content: 'OK'});
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

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-custom-user-popup',
    template: ''
})
export class CustomUserPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private customUserPopupService: CustomUserPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.customUserPopupService
                    .open(CustomUserDialogComponent, params['id']);
            } else {
                this.modalRef = this.customUserPopupService
                    .open(CustomUserDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
