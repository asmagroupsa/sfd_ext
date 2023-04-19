import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { RequestRaison } from './request-raison.model';
import { RequestRaisonPopupService } from './request-raison-popup.service';
import { RequestRaisonService } from './request-raison.service';

@Component({
  selector: 'jhi-request-raison-delete-dialog',
  templateUrl: './request-raison-delete-dialog.component.html'
})
export class RequestRaisonDeleteDialogComponent {
  requestRaison: RequestRaison;

  constructor(
    private requestRaisonService: RequestRaisonService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.requestRaisonService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'requestRaisonListModification',
        content: 'Deleted an requestRaison'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.requestRaison.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.requestRaison.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-request-raison-delete-popup',
  template: ''
})
export class RequestRaisonDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private requestRaisonPopupService: RequestRaisonPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.requestRaisonPopupService.open(
        RequestRaisonDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
