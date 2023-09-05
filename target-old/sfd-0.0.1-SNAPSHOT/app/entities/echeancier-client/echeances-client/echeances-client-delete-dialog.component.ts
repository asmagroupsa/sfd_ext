import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiAlertService, JhiEventManager } from "ng-jhipster";

import { EcheancesClient } from "./echeances-client.model";
import { EcheancesClientPopupService } from "./echeances-client-popup.service";
import { EcheancesClientService } from "./echeances-client.service";

@Component({
  selector: "jhi-echeances-client-delete-dialog",
  templateUrl: "./echeances-client-delete-dialog.component.html"
})
export class EcheancesClientDeleteDialogComponent {
  echeancesClient: EcheancesClient;

  constructor(
    private echeancesClientService: EcheancesClientService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss("cancel");
  }

  confirmDelete(id: number) {
    this.echeancesClientService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: "echeancesClientListModification",
        content: "Deleted an echeancesClient"
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.echeancesClient.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.echeancesClient.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: "jhi-echeances-client-delete-popup",
  template: ""
})
export class EcheancesClientDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancesClientPopupService: EcheancesClientPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.echeancesClientPopupService.open(
        EcheancesClientDeleteDialogComponent,
        params["id"]
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
