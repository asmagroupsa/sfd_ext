import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Poste } from './poste.model';
import { PostePopupService } from './poste-popup.service';
import { PosteService } from './poste.service';

@Component({
    selector: 'jhi-poste-delete-dialog',
    templateUrl: './poste-delete-dialog.component.html'
})
export class PosteDeleteDialogComponent {

    poste: Poste;

    constructor(
        private posteService: PosteService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.posteService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'posteListModification',
                content: 'Deleted an poste'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.poste.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.poste.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-poste-delete-popup',
    template: ''
})
export class PosteDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private postePopupService: PostePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.postePopupService
                .open(PosteDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
