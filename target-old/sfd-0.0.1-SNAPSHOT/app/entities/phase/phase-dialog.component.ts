import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {Phase} from './phase.model';
import {PhasePopupService} from './phase-popup.service';
import {PhaseService} from './phase.service';
import {ProduitService} from "../produit/produit.service";
import {numberToLocalString} from "../../shared/index";
declare let select_init: any;

@Component({
    selector: 'jhi-phase-dialog',
    templateUrl: './phase-dialog.component.html'
})
export class PhaseDialogComponent implements OnInit {
    phase: Phase;
    isSaving: boolean;
    loading = {produit: false};
    produits = [];
    phaseMontant;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private posteService: PhaseService,
        private eventManager: JhiEventManager,
        private _produitService: ProduitService,
        private _activatedRoute: ActivatedRoute,
    ) {}
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;

        this.loading.produit = true;
        this._produitService.query({
            'phasable.equals': 'true',
        }).toPromise()
        .then((r) => {
            this.loading.produit = false;
            this.produits = r.json;
            select_init();
        })
        .catch(() => {
            this.loading.produit = false;
        });

        const produitId = +this._activatedRoute.snapshot.queryParams.produitId;

        if (!this.phase.produitId && produitId) {
            this.phase.produitId = produitId;
        }

        if (this.phase.montant) {
            this.phaseMontant = numberToLocalString(this.phase.montant.toString());
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.phase.id !== undefined) {
            this.subscribeToSaveResponse(this.posteService.update(this.phase));
        } else {
            this.subscribeToSaveResponse(this.posteService.create(this.phase));
        }
    }

    private subscribeToSaveResponse(result: Observable<Phase>) {
        result.subscribe(
            (res: Phase) => this.onSaveSuccess(res),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Phase) {
        this.eventManager.broadcast({
            name: 'posteListModification',
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
}

@Component({
    selector: 'jhi-poste-popup',
    template: ''
})
export class PhasePopupComponent implements OnInit, OnDestroy {
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private postePopupService: PhasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.postePopupService.open(
                    PhaseDialogComponent as Component,
                    params['id']
                );
            } else {
                this.postePopupService.open(PhaseDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
