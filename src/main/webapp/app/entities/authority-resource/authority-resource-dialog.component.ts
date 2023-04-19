import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AuthorityResource } from './authority-resource.model';
import { AuthorityResourcePopupService } from './authority-resource-popup.service';
import { AuthorityResourceService } from './authority-resource.service';
import { Ressource, RessourceService } from '../ressource';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-authority-resource-dialog',
    templateUrl: './authority-resource-dialog.component.html'
})
export class AuthorityResourceDialogComponent implements OnInit {
    authorityResource: AuthorityResource;
    authorities: any[];
    isSaving: boolean;

    ressources: Ressource[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private authorityResourceService: AuthorityResourceService,
        private ressourceService: RessourceService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.ressourceService.query()
            .subscribe((res: ResponseWrapper) => { this.ressources = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.authorityResource.id !== undefined) {
            this.subscribeToSaveResponse(
                this.authorityResourceService.update(this.authorityResource), false);
        } else {
            this.subscribeToSaveResponse(
                this.authorityResourceService.create(this.authorityResource), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<AuthorityResource>, isCreated: boolean) {
        result.subscribe((res: AuthorityResource) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: AuthorityResource, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.authorityResource.created'
            : 'carmesfnmserviceApp.authorityResource.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'authorityResourceListModification', content: 'OK'});
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

    trackRessourceById(index: number, item: Ressource) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-authority-resource-popup',
    template: ''
})
export class AuthorityResourcePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private authorityResourcePopupService: AuthorityResourcePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.authorityResourcePopupService
                    .open(AuthorityResourceDialogComponent as Component, params['id']);
            } else {
                this.modalRef = this.authorityResourcePopupService
                    .open(AuthorityResourceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
