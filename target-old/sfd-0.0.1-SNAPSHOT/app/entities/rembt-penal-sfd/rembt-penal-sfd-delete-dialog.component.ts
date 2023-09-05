import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { RembtPenalSFD } from './rembt-penal-sfd.model';
import { RembtPenalSFDPopupService } from './rembt-penal-sfd-popup.service';
import { RembtPenalSFDService } from './rembt-penal-sfd.service';

@Component({
  selector: 'jhi-rembt-penal-sfd-delete-dialog',
  templateUrl: './rembt-penal-sfd-delete-dialog.component.html'
})
export class RembtPenalSFDDeleteDialogComponent {
  rembtPenalSFD: RembtPenalSFD;

  constructor(
    private rembtPenalSFDService: RembtPenalSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.rembtPenalSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'rembtPenalSFDListModification',
        content: 'Deleted an rembtPenalSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.rembtPenalSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.rembtPenalSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-rembt-penal-sfd-delete-popup',
  template: ''
})
export class RembtPenalSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private rembtPenalSFDPopupService: RembtPenalSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.rembtPenalSFDPopupService.open(
        RembtPenalSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
