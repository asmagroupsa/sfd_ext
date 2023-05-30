import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { UtilisateurCaisse } from './utilisateur-caisse.model';
import { UtilisateurCaissePopupService } from './utilisateur-caisse-popup.service';
import { CaisseNouvelleService } from '../caisse-nouvelle.service';
import { LanguesService } from '../../../shared/myTranslation/langues';
import { ResponseWrapper, UserData } from '../../../shared';
declare let select_init: any;
@Component({
    selector: 'jhi-utilisateur-caisse-dialog',
    templateUrl: './utilisateur-caisse-dialog.component.html'
})
export class UtilisateurCaisseDialogComponent implements OnInit {
    utilisateurCaisse: UtilisateurCaisse;
    authorities: any[];
    isSaving: boolean;
    agences = [];
    caissiers: any[] = [];;
    nameCaisse: string;
    nameAgence: string;
    codeCaisse: string;
    params: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private caisseNouvelleService: CaisseNouvelleService,
        private eventManager: JhiEventManager,
        public langue: LanguesService,
        activatedRoute: ActivatedRoute
    ) {
        this.utilisateurCaisse = new UtilisateurCaisse();
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
            this.utilisateurCaisse.comptecarmeagence = this.params.agence;
            this.utilisateurCaisse.comptecarmescaisse = this.params.caisse;
            this.utilisateurCaisse.reference = this.params.codeCaisse;
            this.nameCaisse = this.params.nameCaisse;
            this.nameAgence = this.params.nameAgence;
            this.codeCaisse = this.params.codeCaisse;
        });
        /* this.utilisateurCaisse.comptecarmeagence = activatedRoute.snapshot.queryParams['agence'];
        this.utilisateurCaisse.comptecarmescaisse = activatedRoute.snapshot.queryParams['caisse'];
        this.utilisateurCaisse.reference = activatedRoute.snapshot.queryParams['codeCaisse'];
        this.nameCaisse = activatedRoute.snapshot.queryParams['nameCaisse'];
        this.nameAgence = activatedRoute.snapshot.queryParams['nameAgence'];
        this.codeCaisse = activatedRoute.snapshot.queryParams['codeCaisse']; */
        console.log(activatedRoute.snapshot.queryParams);
        console.log(this.utilisateurCaisse);
    }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            this.utilisateurCaisse.reference = this.agences[0].codeAgence;
        }


        this.caisseNouvelleService.queryListeCaissierAgence('', this.agences[0].codeAgence).subscribe(
            (res: ResponseWrapper) => {
                this.caissiers = res.json;
                console.log(res.json);

            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
            this.caisseNouvelleService.affecterCaisseToUser(this.utilisateurCaisse),
            true
        );
    }

    private subscribeToSaveResponse(
        result: Observable<any>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: any) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        if (result.resultat != 'OK') {
            let msg: string = "Une erreur s'est produite";
            switch (result.resultat) {
                case 'COMPTE_CAISSE_ERRONEE':
                    msg = "Le compte Carmes de la caisse est erronné";
                    break;
                case 'COMPTE_AGENCE_ERRONEE':
                    msg = "Le compte Carmes de l'agence est erronné";
                    break;
                case 'SOLDE INSUFFISANT':
                    msg = "Le solde est insuffisant";
                    break;
            }
            this.isSaving = false;
            this.alertService.error(msg, null, null);
            return;
        }
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.utilisateurCaisse.created' : 'carmesfnmserviceApp.utilisateurCaisse.updated',
            { param: result.id },
            null
        );
        this.eventManager.broadcast({
            name: 'utilisateurCaisseListModification',
            content: 'OK'
        });
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

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-utilisateur-caisse-popup',
    template: ''
})
export class UtilisateurCaissePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private utilisateurCaissePopupService: UtilisateurCaissePopupService
    ) { }

    ngOnInit() {
        // if (LOCAL_FLAG) {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.utilisateurCaissePopupService.open(
                    UtilisateurCaisseDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.utilisateurCaissePopupService.open(
                    UtilisateurCaisseDialogComponent as Component
                );
            }
        });
        // } else {
        //   window.history.back();
        // }
    }

    ngOnDestroy() {
        if (this.routeSub)
            this.routeSub.unsubscribe();
    }
}
