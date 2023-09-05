import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { EcheancierClient } from './echeancier-client.model';
import { EcheancierClientPopupService } from './echeancier-client-popup.service';
import { EcheancierClientService } from './echeancier-client.service';

@Component({
  selector: 'jhi-echeancier-client-delete-dialog',
  templateUrl: './echeancier-client-delete-dialog.component.html'
})
export class EcheancierClientDeleteDialogComponent {
  echeancierClient: EcheancierClient;

  constructor(
    private echeancierClientService: EcheancierClientService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.echeancierClientService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'echeancierClientListModification',
        content: 'Deleted an echeancierClient'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.echeancierClient.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.echeancierClient.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-echeancier-client-delete-popup',
  template: ''
})
export class EcheancierClientDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancierClientPopupService: EcheancierClientPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.echeancierClientPopupService.open(
        EcheancierClientDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
