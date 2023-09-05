import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TranchePenalSFD } from './tranche-penal-sfd.model';
import { TranchePenalSFDPopupService } from './tranche-penal-sfd-popup.service';
import { TranchePenalSFDService } from './tranche-penal-sfd.service';

@Component({
  selector: 'jhi-tranche-penal-sfd-delete-dialog',
  templateUrl: './tranche-penal-sfd-delete-dialog.component.html'
})
export class TranchePenalSFDDeleteDialogComponent {
  tranchePenalSFD: TranchePenalSFD;

  constructor(
    private tranchePenalSFDService: TranchePenalSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.tranchePenalSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'tranchePenalSFDListModification',
        content: 'Deleted an tranchePenalSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.tranchePenalSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.tranchePenalSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-tranche-penal-sfd-delete-popup',
  template: ''
})
export class TranchePenalSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tranchePenalSFDPopupService: TranchePenalSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.tranchePenalSFDPopupService.open(
        TranchePenalSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
