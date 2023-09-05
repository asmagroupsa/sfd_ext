import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Unity } from './validations.model';
import { UnityPopupService } from './validations-popup.service';
import { UnityService } from './validations.service';

@Component({
  selector: 'jhi-validations-delete-dialog',
  templateUrl: './validations-delete-dialog.component.html'
})
export class UnityDeleteDialogComponent {
  unity: Unity;

  constructor(
    private unityService: UnityService,
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
  selector: 'jhi-unity-delete-popup',
  template: ''
})
export class UnityDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private unityPopupService: UnityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.unityPopupService.open(
        UnityDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
