import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";

import { Observable } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager, JhiAlertService } from "ng-jhipster";

import { Periodicity } from "./periodicity.model";
import { PeriodicityPopupService } from "./periodicity-popup.service";
import { PeriodicityService } from "./periodicity.service";
import { ResponseWrapper } from "../../shared";
import { Principal } from "../../shared/auth/principal.service";
declare let select_init: any;
@Component({
  selector: "jhi-periodicity-dialog",
  templateUrl: "./periodicity-dialog.component.html",
  styles: [
    `
  .input-field.col.s8 div.ui.dropdown{
    width: 100% !important;
  }
  `
  ]
})
export class PeriodicityDialogComponent implements OnInit {
  periodicity: Periodicity;
  authorities: any[];
  isSaving: boolean;

  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private periodicityService: PeriodicityService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ["ROLE_USER", "ROLE_ADMIN"];
  }

  clear() {
    this.activeModal.dismiss("cancel");
  }

  save() {
    this.isSaving = true;
    if (this.periodicity.id !== undefined) {
      this.subscribeToSaveResponse(
        this.periodicityService.update(this.periodicity),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.periodicityService.create(this.periodicity),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Periodicity>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Periodicity) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Periodicity, isCreated: boolean) {
    this.alertService.success(
      isCreated ? "sfdApp.periodicity.created" : "sfdApp.periodicity.updated",
      { param: result.id },
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
          PeriodicityDialogComponent as Component,
          params["id"]
        );
      } else {
        this.modalRef = this.periodicityPopupService.open(
          PeriodicityDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
