import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Eligible } from './eligible.model';
import { EligiblePopupService } from './eligible-popup.service';
import { EligibleService } from './eligible.service';

@Component({
  selector: 'jhi-eligible-delete-dialog',
  templateUrl: './eligible-delete-dialog.component.html'
})
export class EligibleDeleteDialogComponent {
  eligible: Eligible;

  constructor(
    private eligibleService: EligibleService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.eligibleService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'eligibleListModification',
        content: 'Deleted an eligible'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.eligible.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.eligible.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-eligible-delete-popup',
  template: ''
})
export class EligibleDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private eligiblePopupService: EligiblePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.eligiblePopupService.open(
        EligibleDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
