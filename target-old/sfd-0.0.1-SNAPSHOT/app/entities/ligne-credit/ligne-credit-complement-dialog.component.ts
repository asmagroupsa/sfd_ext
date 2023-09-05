import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { LigneCredit } from './ligne-credit.model';
import { LigneCreditPopupService } from './ligne-credit-popup.service';
import { LigneCreditService } from './ligne-credit.service';
import { Principal } from '../../shared';
declare let select_init: any;

@Component({
    selector: 'jhi-ligne-credit-complement-dialog',
    templateUrl: './ligne-credit-complement-dialog.component.html'
})
export class LigneCreditComplementDialogComponent {
    localModel: any = {
        ligneCreditId: '',
requestRaison:'',
amountRequest:'',
etat:'ATTENTE'
    };
    lignes: any;
    requestAmount: string;
    isSaving:boolean = false;
    constructor(
        private ligneCreditService: LigneCreditService,
        public principal: Principal,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) { }
    ngOnInit() {
       this.getLignes();
    }
    ngAfterViewInit() {
        select_init();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }
    getLignes(){
        this.ligneCreditService.getLigneComplements().subscribe(
            response => {
                this.lignes = response.json;
            });
    }

    addComplement(invalid) {
        if(invalid){
            alert("Le formulaire est incorrect")
            return ;
        }
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
        setCreateBy(this.localModel, identity);
        this.ligneCreditService.addComplement(this.localModel).subscribe(
            response => {
                /* this.eventManager.broadcast({
                    name: 'ligneCreditListModification',
                    content: 'Complementd an ligneCredit'
                }); */
                this.activeModal.dismiss(true);
                this.isSaving = false;
                this.alertService.success(
                    "Le complément a été ajouté à la ligne de crédit",
                    null,
                    null
                );
            },
            e => {
                this.isSaving = false;
                this.alertService.error(
                    "Une erreur s'est produite lors de l'ajout de complément",
                    null,
                    null
                );
            }
        );
            });
    }
}

@Component({
    selector: 'jhi-ligne-credit-complement-popup',
    template: ''
})
export class LigneCreditComplementPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private ligneCreditPopupService: LigneCreditPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.ligneCreditPopupService.open(
                LigneCreditComplementDialogComponent as Component
            );
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
