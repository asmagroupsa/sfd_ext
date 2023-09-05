import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TypeClient } from './type-client.model';
import { TypeClientPopupService } from './type-client-popup.service';
import { TypeClientService } from './type-client.service';

@Component({
  selector: 'jhi-type-client-delete-dialog',
  templateUrl: './type-client-delete-dialog.component.html'
})
export class TypeClientDeleteDialogComponent {
  typeClient: TypeClient;

  constructor(
    private typeClientService: TypeClientService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) { }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.typeClientService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'typeClientListModification',
        content: 'Deleted an typeClient'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.typeClient.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.typeClient.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-type-client-delete-popup',
  template: ''
})
export class TypeClientDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeClientPopupService: TypeClientPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.typeClientPopupService.open(
        TypeClientDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
