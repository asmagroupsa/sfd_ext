import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiAlertService, JhiEventManager } from "ng-jhipster";

import { Ecriture } from "./ecriture.model";
import { EcriturePopupService } from "./ecriture-popup.service";
import { EcritureService } from "./ecriture.service";

@Component({
  selector: "jhi-ecriture-delete-dialog",
  templateUrl: "./ecriture-delete-dialog.component.html"
})
export class EcritureDeleteDialogComponent {
  ecriture: Ecriture;

  constructor(
    private ecritureService: EcritureService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss("cancel");
  }

  confirmDelete(id: number) {
    this.ecritureService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: "ecritureListModification",
        content: "Deleted an ecriture"
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.ecriture.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.ecriture.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: "jhi-ecriture-delete-popup",
  template: ""
})
export class EcritureDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private ecriturePopupService: EcriturePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.ecriturePopupService.open(
        EcritureDeleteDialogComponent,
        params["id"]
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
