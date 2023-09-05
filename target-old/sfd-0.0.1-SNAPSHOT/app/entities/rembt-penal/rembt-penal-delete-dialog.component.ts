import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { RembtPenal } from './rembt-penal.model';
import { RembtPenalPopupService } from './rembt-penal-popup.service';
import { RembtPenalService } from './rembt-penal.service';

@Component({
  selector: 'jhi-rembt-penal-delete-dialog',
  templateUrl: './rembt-penal-delete-dialog.component.html'
})
export class RembtPenalDeleteDialogComponent {
  rembtPenal: RembtPenal;

  constructor(
    private rembtPenalService: RembtPenalService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.rembtPenalService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'rembtPenalListModification',
        content: 'Deleted an rembtPenal'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.rembtPenal.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.rembtPenal.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-rembt-penal-delete-popup',
  template: ''
})
export class RembtPenalDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private rembtPenalPopupService: RembtPenalPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.rembtPenalPopupService.open(
        RembtPenalDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
