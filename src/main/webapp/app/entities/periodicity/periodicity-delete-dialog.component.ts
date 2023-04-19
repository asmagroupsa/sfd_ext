import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Periodicity } from './periodicity.model';
import { PeriodicityPopupService } from './periodicity-popup.service';
import { PeriodicityService } from './periodicity.service';

@Component({
  selector: 'jhi-periodicity-delete-dialog',
  templateUrl: './periodicity-delete-dialog.component.html'
})
export class PeriodicityDeleteDialogComponent {
  periodicity: Periodicity;

  constructor(
    private periodicityService: PeriodicityService,
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
        PeriodicityDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
