import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { DocumentGarantie } from './document-garantie.model';
import { DocumentGarantiePopupService } from './document-garantie-popup.service';
import { DocumentGarantieService } from './document-garantie.service';

@Component({
  selector: 'jhi-document-garantie-delete-dialog',
  templateUrl: './document-garantie-delete-dialog.component.html'
})
export class DocumentGarantieDeleteDialogComponent {
  documentGarantie: DocumentGarantie;

  constructor(
    private documentGarantieService: DocumentGarantieService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.documentGarantieService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'documentGarantieListModification',
        content: 'Deleted an documentGarantie'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.documentGarantie.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.documentGarantie.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-document-garantie-delete-popup',
  template: ''
})
export class DocumentGarantieDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private documentGarantiePopupService: DocumentGarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.documentGarantiePopupService.open(
        DocumentGarantieDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
