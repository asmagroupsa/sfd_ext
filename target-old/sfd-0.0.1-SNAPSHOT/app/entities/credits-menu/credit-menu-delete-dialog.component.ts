import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CreditMenu } from './credit-menu.model';
import { CreditMenuPopupService } from './credit-menu-popup.service';
import { CreditMenuService } from './credit-menu.service';

@Component({
  selector: 'jhi-credit-menu-delete-dialog',
  templateUrl: './credit-menu-delete-dialog.component.html'
})
export class CreditMenuDeleteDialogComponent {
  unity: CreditMenu;

  constructor(
    private unityService: CreditMenuService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.unityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'unityListModification',
        content: 'Deleted an unity'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.unity.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.unity.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-credit-menu-delete-popup',
  template: ''
})
export class CreditMenuDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private unityPopupService: CreditMenuPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.unityPopupService.open(
        CreditMenuDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
