import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";

import { Observable } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager, JhiAlertService } from "ng-jhipster";

import { EcheancesSFD } from "./echeances-sfd.model";
import { EcheancesSFDPopupService } from "./echeances-sfd-popup.service";
import { EcheancesSFDService } from "./echeances-sfd.service";
import { EcheancierSFD, EcheancierSFDService } from "..";
import { ResponseWrapper, UserData } from "../../../shared";
declare let select_init: any;
@Component({
  selector: "jhi-echeances-sfd-dialog",
  templateUrl: "./echeances-sfd-dialog.component.html"
})
export class EcheancesSFDDialogComponent implements OnInit {
  echeancesSFD: EcheancesSFD;
  authorities: any[];
  isSaving: boolean;

  echeanciersfds: EcheancierSFD[];
  echeanceDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private echeancesSFDService: EcheancesSFDService,
    private echeancierSFDService: EcheancierSFDService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ["ROLE_USER", "ROLE_ADMIN"];
    this.echeancierSFDService.query().subscribe(
      (res: ResponseWrapper) => {
        this.echeanciersfds = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss("cancel");
  }

  save() {
    this.isSaving = true;
    if (this.echeancesSFD.id !== undefined) {
      this.subscribeToSaveResponse(
        this.echeancesSFDService.update(this.echeancesSFD),
        false
      );
    } else {
      this.echeancesSFD.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.echeancesSFDService.create(this.echeancesSFD),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<EcheancesSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: EcheancesSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: EcheancesSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated ? "sfdApp.echeancesSFD.created" : "sfdApp.echeancesSFD.updated",
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: "echeancesSFDListModification",
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

  trackEcheancierSFDById(index: number, item: EcheancierSFD) {
    return item.id;
  }
}

@Component({
  selector: "jhi-echeances-sfd-popup",
  template: ""
})
export class EcheancesSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancesSFDPopupService: EcheancesSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params["id"]) {
        this.modalRef = this.echeancesSFDPopupService.open(
          EcheancesSFDDialogComponent as Component,
          params["id"]
        );
      } else {
        this.modalRef = this.echeancesSFDPopupService.open(
          EcheancesSFDDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
