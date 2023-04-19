import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CompteComptable } from './compte-comptable.model';
import { PeriodicityPopupService } from './compte-comptable-popup.service';
import { CompteComptableService } from './compte-comptable.service';

@Component({
  selector: 'jhi-compte-comptable-delete-dialog',
  templateUrl: './compte-comptable-delete-dialog.component.html'
})
export class PeriodicityDeleteDialogComponent {
  periodicity: CompteComptable;

  constructor(
    private periodicityService: CompteComptableService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.periodicityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'periodicityListModification',
        content: 'Deleted an periodicity'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.periodicity.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.periodicity.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-periodicity-delete-popup',
  template: ''
})
export class PeriodicityDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private periodicityPopupService: PeriodicityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.periodicityPopupService.open(
        PeriodicityDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
