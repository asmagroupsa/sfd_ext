import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { AccountType } from './account-type.model';
import { AccountTypePopupService } from './account-type-popup.service';
import { AccountTypeService } from './account-type.service';

@Component({
  selector: 'jhi-account-type-delete-dialog',
  templateUrl: './account-type-delete-dialog.component.html'
})
export class AccountTypeDeleteDialogComponent {
  accountType: AccountType;

  constructor(
    private accountTypeService: AccountTypeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.accountTypeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'accountTypeListModification',
        content: 'Deleted an accountType'
      });
      this.activeModal.dismiss(true);
      this.alertService.success(
        'carmesfnmserviceApp.accountType.deleted',
        { param: id },
        null
      );
    }, (e) => {
      this.alertService.success(
        'carmesfnmserviceApp.accountType.deleted',
        { param: id },
        null
      );
    });
  }
}

@Component({
  selector: 'jhi-account-type-delete-popup',
  template: ''
})
export class AccountTypeDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private accountTypePopupService: AccountTypePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.accountTypePopupService.open(
        AccountTypeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
