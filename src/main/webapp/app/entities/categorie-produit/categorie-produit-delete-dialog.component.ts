import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorieProduit } from './categorie-produit.model';
import { CategorieProduitPopupService } from './categorie-produit-popup.service';
import { CategorieProduitService } from './categorie-produit.service';

@Component({
    selector: 'jhi-categorie-produit-delete-dialog',
    templateUrl: './categorie-produit-delete-dialog.component.html'
})
export class CategorieProduitDeleteDialogComponent {

    categorieProduit: CategorieProduit;

    constructor(
        private categorieProduitService: CategorieProduitService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categorieProduitService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categorieProduitListModification',
                content: 'Deleted an categorieProduit'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.categorieProduit.deleted', { param: id }, null)
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.categorieProduit.deleted', { param: id }, null)
        });
    }
}

@Component({
    selector: 'jhi-categorie-produit-delete-popup',
    template: ''
})
export class CategorieProduitDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorieProduitPopupService: CategorieProduitPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categorieProduitPopupService
                .open(CategorieProduitDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
