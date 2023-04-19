import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ComityMber } from './comity-menu.model';
import { ComityMberPopupService } from './comity-menu-popup.service';
import { ComityMberService } from './comity-menu.service';

@Component({
  selector: 'jhi-comity-menu-delete-dialog',
  templateUrl: './comity-menu-delete-dialog.component.html'
})
export class ComityMberDeleteDialogComponent {
  comityMber: ComityMber;

  constructor(
    private comityMberService: ComityMberService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.comityMberService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'comityMberListModification',
        content: 'Deleted an comityMber'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.comityMber.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.comityMber.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-comity-mber-delete-popup',
  template: ''
})
export class ComityMberDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private comityMberPopupService: ComityMberPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.comityMberPopupService.open(
        ComityMberDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
