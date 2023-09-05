import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiAlertService, JhiEventManager } from "ng-jhipster";

import { EcheancesSFD } from "./echeances-sfd.model";
import { EcheancesSFDPopupService } from "./echeances-sfd-popup.service";
import { EcheancesSFDService } from "./echeances-sfd.service";

@Component({
  selector: "jhi-echeances-sfd-delete-dialog",
  templateUrl: "./echeances-sfd-delete-dialog.component.html"
})
export class EcheancesSFDDeleteDialogComponent {
  echeancesSFD: EcheancesSFD;

  constructor(
    private echeancesSFDService: EcheancesSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss("cancel");
  }

  confirmDelete(id: number) {
    this.echeancesSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: "echeancesSFDListModification",
        content: "Deleted an echeancesSFD"
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.echeancesSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.echeancesSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: "jhi-echeances-sfd-delete-popup",
  template: ""
})
export class EcheancesSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancesSFDPopupService: EcheancesSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.echeancesSFDPopupService.open(
        EcheancesSFDDeleteDialogComponent as Component,
        params["id"]
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
