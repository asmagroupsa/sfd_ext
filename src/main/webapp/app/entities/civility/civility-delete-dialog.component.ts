import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Civility } from './civility.model';
import { CivilityPopupService } from './civility-popup.service';
import { CivilityService } from './civility.service';

@Component({
  selector: 'jhi-civility-delete-dialog',
  templateUrl: './civility-delete-dialog.component.html'
})
export class CivilityDeleteDialogComponent {
  civility: Civility;

  constructor(
    private civilityService: CivilityService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.civilityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'civilityListModification',
        content: 'Deleted an civility'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.civility.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.civility.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-civility-delete-popup',
  template: ''
})
export class CivilityDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private civilityPopupService: CivilityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.civilityPopupService.open(
        CivilityDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
