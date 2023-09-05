import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { SettingSFD } from './setting-sfd.model';
import { SettingSFDPopupService } from './setting-sfd-popup.service';
import { SettingSFDService } from './setting-sfd.service';

@Component({
  selector: 'jhi-setting-sfd-delete-dialog',
  templateUrl: './setting-sfd-delete-dialog.component.html'
})
export class SettingSFDDeleteDialogComponent {
  settingSFD: SettingSFD;

  constructor(
    private settingSFDService: SettingSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.settingSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'settingSFDListModification',
        content: 'Deleted an settingSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.settingSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.settingSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-setting-sfd-delete-popup',
  template: ''
})
export class SettingSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private settingSFDPopupService: SettingSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.settingSFDPopupService.open(
        SettingSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
