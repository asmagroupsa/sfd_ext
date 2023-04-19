import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { EcheancierSFD } from './echeancier-sfd.model';
import { EcheancierSFDPopupService } from './echeancier-sfd-popup.service';
import { EcheancierSFDService } from './echeancier-sfd.service';

@Component({
  selector: 'jhi-echeancier-sfd-delete-dialog',
  templateUrl: './echeancier-sfd-delete-dialog.component.html'
})
export class EcheancierSFDDeleteDialogComponent {
  echeancierSFD: EcheancierSFD;

  constructor(
    private echeancierSFDService: EcheancierSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.echeancierSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'echeancierSFDListModification',
        content: 'Deleted an echeancierSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.echeancierSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.echeancierSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-echeancier-sfd-delete-popup',
  template: ''
})
export class EcheancierSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancierSFDPopupService: EcheancierSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.echeancierSFDPopupService.open(
        EcheancierSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
