import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";

import { Observable } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager, JhiAlertService } from "ng-jhipster";

import { EcheancesClient } from "./echeances-client.model";
import { EcheancesClientPopupService } from "./echeances-client-popup.service";
import { EcheancesClientService } from "./echeances-client.service";
import { RembtPenal, RembtPenalService } from "../../rembt-penal";
import { Compte, CompteService } from "../../compte";
import { UserData } from "../../../shared";
import {
  EcheancierClient,
  EcheancierClientService
} from "..";
import { ResponseWrapper } from "../../../shared";
declare let select_init: any;
@Component({
  selector: "jhi-echeances-client-dialog",
  templateUrl: "./echeances-client-dialog.component.html"
})
export class EcheancesClientDialogComponent implements OnInit {
  echeancesClient: EcheancesClient;
  authorities: any[];
  isSaving: boolean;

  rembtpenals: RembtPenal[];

  comptes: Compte[];

  echeancierclients: EcheancierClient[];
  echeanceDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private echeancesClientService: EcheancesClientService,
    private rembtPenalService: RembtPenalService,
    private compteService: CompteService,
    private echeancierClientService: EcheancierClientService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ["ROLE_USER", "ROLE_ADMIN"];
    this.rembtPenalService.query().subscribe(
      (res: ResponseWrapper) => {
        this.rembtpenals = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.compteService.query().subscribe(
      (res: ResponseWrapper) => {
        this.comptes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.echeancierClientService.query().subscribe(
      (res: ResponseWrapper) => {
        this.echeancierclients = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss("cancel");
  }

  save() {
    this.isSaving = true;
    if (this.echeancesClient.id !== undefined) {
      this.subscribeToSaveResponse(
        this.echeancesClientService.update(this.echeancesClient),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.echeancesClientService.create(this.echeancesClient),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<EcheancesClient>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: EcheancesClient) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: EcheancesClient, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? "sfdApp.echeancesClient.created"
        : "sfdApp.echeancesClient.updated",
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: "echeancesClientListModification",
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

  trackRembtPenalById(index: number, item: RembtPenal) {
    return item.id;
  }

  trackCompteById(index: number, item: Compte) {
    return item.id;
  }

  trackEcheancierClientById(index: number, item: EcheancierClient) {
    return item.id;
  }
}

@Component({
  selector: "jhi-echeances-client-popup",
  template: ""
})
export class EcheancesClientPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancesClientPopupService: EcheancesClientPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params["id"]) {
        this.modalRef = this.echeancesClientPopupService.open(
          EcheancesClientDialogComponent as Component,
          params["id"]
        );
      } else {
        this.modalRef = this.echeancesClientPopupService.open(
          EcheancesClientDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
