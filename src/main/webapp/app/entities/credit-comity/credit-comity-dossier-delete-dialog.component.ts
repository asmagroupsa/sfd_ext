import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import {CreditComity} from './credit-comity.model';
import {CreditComityPopupService} from './credit-comity-popup.service';
import {DossierService} from '../dossier';
import {SPSFDService} from '../../shared/sp-sfd.service';

@Component({
    selector: 'jhi-credit-comity-dossier-delete-dialog',
    templateUrl: './credit-comity-dossier-delete-dialog.component.html'
})
export class CreditComityDossierDeleteDialogComponent {
    creditComity: CreditComity;
    dossier: any;
    constructor(
        private dossierService: DossierService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private _spSFDService: SPSFDService
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete() {
        let id: any = this.dossier.dossier_id;

        this.dossierService.retireDossier(id)
        .subscribe(
            (resp) => {
                if(resp.resultat == 'DEJA_OBJET_DE_LIGNE_CREDIT'){
this.alertService.warning("La demande a déjà fait l'objet d'une demande de ligne de crédit", null, null);
                }else if(resp.resultat == 'DEJA_VALIDE'){
                    this.alertService.warning("La demande a déja été validée", null, null);
                }else if(resp.resultat == 'NON'){
                this.alertService.warning("Une erreur s'est produite lors du retrait du dossier", null, null);
                }else if(resp.resultat == 'OK'){
                this.alertService.success('Le dossier a été retiré', {param: id}, null);
                }
                this.eventManager.broadcast({
                    name: 'creditComityDossiers',
                    content: 'Dossier retiré'
                });

                this.activeModal.dismiss(true);
            },
            () => {
                this.alertService.error('carmesfnmserviceApp.dossier.error', {param: id}, null);
            }
        );


        // this.dossierService.delete(id).subscribe((response) => {
        //     this.eventManager.broadcast({
        //         name: 'creditComityListModification',
        //         content: 'Deleted an creditComity'
        //     });
        //     this.activeModal.dismiss(true);
        //     this.alertService.success('carmesfnmserviceApp.dossier.deleted', {param: id}, null);
        // }, (e) => {
        //     this.alertService.error('carmesfnmserviceApp.dossier.error', {param: id}, null);
        // });
    }
}

@Component({
    selector: 'jhi-credit-comity-dossier-delete-popup',
    template: ''
})
export class CreditComityDossierDeletePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditComityPopupService: CreditComityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.creditComityPopupService.open(
                CreditComityDossierDeleteDialogComponent as Component,
                params['id'], params['dossier']
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
