import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { NotificationSFD } from './notification-sfd.model';
import { NotificationSFDPopupService } from './notification-sfd-popup.service';
import { NotificationSFDService } from './notification-sfd.service';

@Component({
  selector: 'jhi-notification-sfd-delete-dialog',
  templateUrl: './notification-sfd-delete-dialog.component.html'
})
export class NotificationSFDDeleteDialogComponent {
  notificationSFD: NotificationSFD;

  constructor(
    private notificationSFDService: NotificationSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.notificationSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'notificationSFDListModification',
        content: 'Deleted an notificationSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.notificationSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.notificationSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-notification-sfd-delete-popup',
  template: ''
})
export class NotificationSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private notificationSFDPopupService: NotificationSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.notificationSFDPopupService.open(
        NotificationSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
