import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { RemboursementSFD } from './remboursement-sfd.model';
import { RemboursementSFDPopupService } from './remboursement-sfd-popup.service';
import { RemboursementSFDService } from './remboursement-sfd.service';

@Component({
  selector: 'jhi-remboursement-sfd-delete-dialog',
  templateUrl: './remboursement-sfd-delete-dialog.component.html'
})
export class RemboursementSFDDeleteDialogComponent {
  remboursementSFD: RemboursementSFD;

  constructor(
    private remboursementSFDService: RemboursementSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.remboursementSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'remboursementSFDListModification',
        content: 'Deleted an remboursementSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.remboursementSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.remboursementSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-remboursement-sfd-delete-popup',
  template: ''
})
export class RemboursementSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private remboursementSFDPopupService: RemboursementSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.remboursementSFDPopupService.open(
        RemboursementSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
