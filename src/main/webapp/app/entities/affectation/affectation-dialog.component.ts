import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy } from '../../shared/model/functions';
import { Affectation } from './affectation.model';
import { AffectationPopupService } from './affectation-popup.service';
import { AffectationService } from './affectation.service';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
declare let clearDropdown: any;
@Component({
    selector: 'jhi-affectation-dialog',
    templateUrl: './affectation-dialog.component.html'
})
export class AffectationDialogComponent implements OnInit {
    affectation: any = {};
    affectations: any[];
    affectationsSelected: any;
    authorities: any[];
    isSaving: boolean;
    params: any;
    title: string = '';
    froms: any[] = [];
    agence: any;
    charges: any[];
    marchands: any[];
    listeAgences: any[] = [];
    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private affectationService: AffectationService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        public activatedRoute: ActivatedRoute
    ) {
        this.listeAgences = UserData.getInstance().listeAgences;
        if (this.listeAgences.length == 1) {
            this.agence = this.listeAgences[0].codeAgence || UserData.getInstance().agence;
            this.queryChargeDePret();
            this.queryMarchand();
        }
        activatedRoute.queryParams.subscribe((params) => {
            this.params = Object.assign({}, params);
            if (this.params['type'] == 'client') this.title = "Les clients";
            else if (this.params['type'] == 'dossier') this.title = "Les dossiers";
            else {
                this.title = "Les agents";
                this.params['type'] = 'agent';
            }
        });
    }
    ngAfterViewInit() {
        select_init();
    }
    queryChargeDePret() {
        clearDropdown('.to .ui.fluid.search.dropdown');
        clearDropdown('.from .ui.fluid.search.dropdown');
        clearDropdown('.affectation .ui.fluid.search.dropdown');
        this.affectation.from = '';
        this.affectation.to = '';
        this.charges = [];
        if (!this.agence) return;
        this.affectationService
            .queryCP(this.agence)
            .subscribe(
                (res: ResponseWrapper) => {
                    this.charges = res.json;
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.queryMarchand();
    }
    onFromChange() {
        this.loadAll();
    }
    loadAll() {
        if (!this.affectation['from']) return;
        this.affectationService
            .queryAffectations(this.params['type'], this.affectation['from'], this.agence)
            .subscribe(
                (res: ResponseWrapper) => {
                    this.affectations = res.json;
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    queryMarchand() {
        let requete;
        let params = this.activatedRoute.snapshot.queryParams;
        this.params = Object.assign({}, params);
        if (this.params['type'] == 'agent') {
            requete = this.affectationService
                .queryMarchand(this.agence)
        }
        else {
            requete = this.affectationService
                .listeMarchandAffectation(this.agence)
        }


        requete.subscribe(
            (res: ResponseWrapper) => {
                this.marchands = res.json.map((m) => {
                    if (m.user_reference) {
                        m.userReference = m.user_reference;
                    }

                    return m;
                });
                this.affectations = this.marchands;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    onTypeChange() {
        clearDropdown('.to .ui.fluid.search.dropdown');
        clearDropdown('.from .ui.fluid.search.dropdown');
        clearDropdown('.affectation .ui.fluid.search.dropdown');
        this.affectation['from'] = '';
        this.affectation['to'] = '';
        if (this.affectation['type'] == 'CP-CP') {
            this.froms = this.charges;
        } else if (this.affectation['type'] == 'AGENT-CP') {
            this.froms = this.marchands;
        }
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                setCreateBy(this.affectation, identity);
                this.affectation['agence_reference'] = this.agence;
                this.affectation['reference_user'] = this.affectation.to;
                this.affectation['created_by'] = UserData.getInstance().userReference;
                this.affectation['observation'] = '';
                if (this.params['type'] == 'client') {
                    this.affectation['chaine_id_client'] = this.affectationsSelected.join('*');
                } else if (this.params['type'] == 'dossier') {
                    this.affectation['chaine_id_request'] = this.affectationsSelected.join('*');
                } else if (this.params['type'] == 'agent') {
                    this.affectation['reference_cp'] = this.affectation.to;
                    this.affectation['chaine_reference_marchand'] = this.affectationsSelected.join('*');
                }
                this.affectation['reference_marchand'] = this.affectation.from;
                this.subscribeToSaveResponse(
                    this.affectationService.create(this.affectation, this.params['type']),
                    true
                );
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Affectation>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Affectation) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Affectation, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.affectation.created' : 'carmesfnmserviceApp.affectation.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'fraisListModification',
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

    getTypeClientLabel(typeClient: string): string {
        switch (typeClient) {
            case "INDIVIDU": return "INDIVIDU";
            case "MUTUEL": return "GROUPE";
            case "ENTREPRISE": return "ENTREPRISE";
            default: return "";
        }
    }
}

@Component({
    selector: 'jhi-affectation-popup',
    template: ''
})
export class AffectationPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private affectationPopupService: AffectationPopupService
    ) { }

    ngOnInit() {
        if (this.route.snapshot.queryParams.type) {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.affectationPopupService.open(
                        AffectationDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.affectationPopupService.open(AffectationDialogComponent as Component);
                }
            });
        } else {
            window.history.back();
        }
    }

    ngOnDestroy() {
        if (this.routeSub)
            this.routeSub.unsubscribe();
    }
}
