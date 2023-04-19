import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeCaisse } from './type-caisse.model';
import { TypeCaissePopupService } from './type-caisse-popup.service';
import { TypeCaisseService } from './type-caisse.service';

@Component({
    selector: 'jhi-type-caisse-delete-dialog',
    templateUrl: './type-caisse-delete-dialog.component.html'
})
export class TypeCaisseDeleteDialogComponent {

    typeCaisse: TypeCaisse;

    constructor(
        private typeCaisseService: TypeCaisseService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.typeCaisseService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'typeCaisseListModification',
                content: 'Deleted an typeCaisse'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.typeCaisse.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.typeCaisse.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-type-caisse-delete-popup',
    template: ''
})
export class TypeCaisseDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private typeCaissePopupService: TypeCaissePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.typeCaissePopupService
                .open(TypeCaisseDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
