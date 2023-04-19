import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Response} from "@angular/http";

import {Observable} from "rxjs";
import {NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {JhiEventManager, JhiAlertService} from "ng-jhipster";

import {CompteComptable} from "./compte-comptable.model";
import {PeriodicityPopupService} from "./compte-comptable-popup.service";
import {CompteComptableService} from "./compte-comptable.service";
import {ResponseWrapper, UserData} from "../../shared";
import {Principal} from "../../shared/auth/principal.service";
declare let select_init: any;
@Component({
    selector: "jhi-compte-comptable-dialog",
    templateUrl: "./compte-comptable-dialog.component.html",
    styles: [
        `
  .input-field.col.s8 div.ui.dropdown{
    width: 100% !important;
  }
  `
    ]
})
export class CompteComptableDialogComponent implements OnInit {
    compteComptable: CompteComptable;
    authorities: any[];
    isSaving: boolean;
    createdDateDp: any;
    lastModifiedDateDp: any;
    agences = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private _compteComptableService: CompteComptableService,
        private eventManager: JhiEventManager,
        public principal: Principal
    ) {}
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ["ROLE_USER", "ROLE_ADMIN"];

        this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            this.compteComptable.agenceReference = this.agences[0].codeAgence;
        }
    }

    clear() {
        this.activeModal.dismiss("cancel");
    }

    save() {
        this.isSaving = true;
        if (this.compteComptable.id !== undefined) {
            this.subscribeToSaveResponse(this._compteComptableService.update(this.compteComptable), false);
        } else {
            this.compteComptable.sfdReference = UserData.getInstance().getSFDReference();
            this.subscribeToSaveResponse(this._compteComptableService.create(this.compteComptable), true);
        }
    }

    private subscribeToSaveResponse(
        result: Observable<CompteComptable>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: CompteComptable) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: CompteComptable, isCreated: boolean) {
        this.alertService.success(
            isCreated ? "sfdApp.compteComptable.created" : "sfdApp.compteComptable.updated",
            {param: result.id},
            null
        );

        this.eventManager.broadcast({
            name: "periodicityListModification",
            content: "OK"
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
    selector: "jhi-periodicity-popup",
    template: ""
})
export class PeriodicityPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private periodicityPopupService: PeriodicityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params["id"]) {
                this.modalRef = this.periodicityPopupService.open(
                    CompteComptableDialogComponent as Component,
                    params["id"]
                );
            } else {
                this.modalRef = this.periodicityPopupService.open(
                    CompteComptableDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
