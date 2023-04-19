import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { LigneRequest } from './ligne-request.model';
import { LigneRequestPopupService } from './ligne-request-popup.service';
import { LigneRequestService } from './ligne-request.service';

@Component({
  selector: 'jhi-ligne-request-delete-dialog',
  templateUrl: './ligne-request-delete-dialog.component.html'
})
export class LigneRequestDeleteDialogComponent {
  ligneRequest: LigneRequest;

  constructor(
    private ligneRequestService: LigneRequestService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.ligneRequestService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'ligneRequestListModification',
        content: 'Deleted an ligneRequest'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.ligneRequest.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.ligneRequest.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-ligne-request-delete-popup',
  template: ''
})
export class LigneRequestDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private ligneRequestPopupService: LigneRequestPopupService
  ) {}

  ngOnInit() {
    window.history.back();
    return;
    // this.routeSub = this.route.params.subscribe(params => {
    //   this.modalRef = this.ligneRequestPopupService.open(
    //     LigneRequestDeleteDialogComponent as Component,
    //     params['id']
    //   );
    // });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
