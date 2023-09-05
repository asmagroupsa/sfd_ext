import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";

import { Observable } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager, JhiAlertService } from "ng-jhipster";

import { Annee } from "./guichet.model";
import { AnneePopupService } from "./guichet-popup.service";
import { AnneeService } from "./guichet.service";

@Component({
  selector: "jhi-guichet-dialog",
  templateUrl: "./guichet-dialog.component.html",
  styles: [
    `
      select{


       height: 50px;
       font-size:15px;
border:none;
border-bottom:1.5px solid;
      }
       `
  ]
})
export class AnneeDialogComponent implements OnInit {
  annee: Annee;
  authorities: any[];
  isSaving: boolean;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private anneeService: AnneeService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ["ROLE_USER", "ROLE_ADMIN"];
  }

  clear() {
    this.activeModal.dismiss("cancel");
  }

  save() {
    this.isSaving = true;
    if (this.annee.id !== undefined) {
      this.subscribeToSaveResponse(this.anneeService.update(this.annee), false);
    } else {
      this.subscribeToSaveResponse(this.anneeService.create(this.annee), true);
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Annee>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Annee) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Annee, isCreated: boolean) {
    this.alertService.success(
      isCreated ? "sfdApp.annee.created" : "sfdApp.annee.updated",
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: "anneeListModification",
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
  selector: "jhi-annee-popup",
  template: ""
})
export class AnneePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private anneePopupService: AnneePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params["id"]) {
        this.modalRef = this.anneePopupService.open(
          AnneeDialogComponent,
          params["id"]
        );
      } else {
        this.modalRef = this.anneePopupService.open(AnneeDialogComponent);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
