import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Literacy } from './literacy.model';
import { LiteracyPopupService } from './literacy-popup.service';
import { LiteracyService } from './literacy.service';

@Component({
  selector: 'jhi-literacy-delete-dialog',
  templateUrl: './literacy-delete-dialog.component.html'
})
export class LiteracyDeleteDialogComponent {
  literacy: Literacy;

  constructor(
    private literacyService: LiteracyService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.literacyService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'literacyListModification',
        content: 'Deleted an literacy'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.literacy.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.literacy.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-literacy-delete-popup',
  template: ''
})
export class LiteracyDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private literacyPopupService: LiteracyPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.literacyPopupService.open(
        LiteracyDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
