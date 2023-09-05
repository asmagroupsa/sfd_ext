import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { NotificationClient } from './notification-client.model';
import { NotificationClientPopupService } from './notification-client-popup.service';
import { NotificationClientService } from './notification-client.service';

@Component({
  selector: 'jhi-notification-client-delete-dialog',
  templateUrl: './notification-client-delete-dialog.component.html'
})
export class NotificationClientDeleteDialogComponent {
  notificationClient: NotificationClient;

  constructor(
    private notificationClientService: NotificationClientService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.notificationClientService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'notificationClientListModification',
        content: 'Deleted an notificationClient'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.notificationClient.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.notificationClient.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-notification-client-delete-popup',
  template: ''
})
export class NotificationClientDeletePopupComponent
  implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private notificationClientPopupService: NotificationClientPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.notificationClientPopupService.open(
        NotificationClientDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
