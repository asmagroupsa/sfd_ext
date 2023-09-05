import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TranchePenal } from './tranche-penal.model';
import { TranchePenalPopupService } from './tranche-penal-popup.service';
import { TranchePenalService } from './tranche-penal.service';

@Component({
  selector: 'jhi-tranche-penal-delete-dialog',
  templateUrl: './tranche-penal-delete-dialog.component.html'
})
export class TranchePenalDeleteDialogComponent {
  tranchePenal: TranchePenal;

  constructor(
    private tranchePenalService: TranchePenalService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.tranchePenalService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'tranchePenalListModification',
        content: 'Deleted an tranchePenal'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.tranchePenal.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.tranchePenal.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-tranche-penal-delete-popup',
  template: ''
})
export class TranchePenalDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tranchePenalPopupService: TranchePenalPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.tranchePenalPopupService.open(
        TranchePenalDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
