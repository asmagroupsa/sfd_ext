import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ServiceUser } from './service-user.model';
import { ServiceUserPopupService } from './service-user-popup.service';
import { ServiceUserService } from './service-user.service';

@Component({
  selector: 'jhi-service-user-delete-dialog',
  templateUrl: './service-user-delete-dialog.component.html'
})
export class ServiceUserDeleteDialogComponent {
  serviceUser: ServiceUser;

  constructor(
    private serviceUserService: ServiceUserService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.serviceUserService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'serviceUserListModification',
        content: 'Deleted an serviceUser'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.serviceUser.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.serviceUser.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-service-user-delete-popup',
  template: ''
})
export class ServiceUserDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private serviceUserPopupService: ServiceUserPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.serviceUserPopupService.open(
        ServiceUserDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
