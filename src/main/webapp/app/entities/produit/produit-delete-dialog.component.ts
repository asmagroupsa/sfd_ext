import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Produit } from './produit.model';
import { ProduitPopupService } from './produit-popup.service';
import { ProduitService } from './produit.service';
import { LOCAL_FLAG } from '../../shared';

@Component({
    selector: 'jhi-produit-delete-dialog',
    templateUrl: './produit-delete-dialog.component.html'
})
export class ProduitDeleteDialogComponent {
    produit: Produit;

    constructor(
        private produitService: ProduitService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.produitService.delete(id).subscribe(
            response => {
                this.eventManager.broadcast({
                    name: 'produitListModification',
                    content: 'Deleted an produit'
                });
                this.activeModal.dismiss(true);
                this.alertService.success(
                    'sfdApp.carmesfnmserviceApp.produit.deleted',
                    { param: id },
                    null
                );
            },
            e => {
                this.alertService.error(
                    'sfdApp.carmesfnmserviceApp.produit.deleted',
                    { param: id },
                    null
                );
            }
        );
    }
}

@Component({
    selector: 'jhi-produit-delete-popup',
    template: ''
})
export class ProduitDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private produitPopupService: ProduitPopupService
    ) {}

    ngOnInit() {
        // if (LOCAL_FLAG) return;
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.produitPopupService.open(
                ProduitDeleteDialogComponent as Component,
                params['id']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
