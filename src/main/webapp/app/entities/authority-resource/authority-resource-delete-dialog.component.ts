import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { AuthorityResource } from './authority-resource.model';
import { AuthorityResourcePopupService } from './authority-resource-popup.service';
import { AuthorityResourceService } from './authority-resource.service';

@Component({
    selector: 'jhi-authority-resource-delete-dialog',
    templateUrl: './authority-resource-delete-dialog.component.html'
})
export class AuthorityResourceDeleteDialogComponent {

    authorityResource: AuthorityResource;

    constructor(
        private authorityResourceService: AuthorityResourceService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.authorityResourceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'authorityResourceListModification',
                content: 'Deleted an authorityResource'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.authorityResource.deleted', { param: id }, null);
        }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.authorityResource.deleted', { param: id }, null);
        });

    }
}

@Component({
    selector: 'jhi-authority-resource-delete-popup',
    template: ''
})
export class AuthorityResourceDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private authorityResourcePopupService: AuthorityResourcePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.authorityResourcePopupService
                .open(AuthorityResourceDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
