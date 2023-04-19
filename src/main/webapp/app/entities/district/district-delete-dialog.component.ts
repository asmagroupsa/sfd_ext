import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { District } from './district.model';
import { DistrictPopupService } from './district-popup.service';
import { DistrictService } from './district.service';

@Component({
  selector: 'jhi-district-delete-dialog',
  templateUrl: './district-delete-dialog.component.html'
})
export class DistrictDeleteDialogComponent {
  district: District;

  constructor(
    private districtService: DistrictService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.districtService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'districtListModification',
        content: 'Deleted an district'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.district.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.district.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-district-delete-popup',
  template: ''
})
export class DistrictDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private districtPopupService: DistrictPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.districtPopupService.open(
        DistrictDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
