import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { City } from './city.model';
import { CityPopupService } from './city-popup.service';
import { CityService } from './city.service';

@Component({
  selector: 'jhi-city-delete-dialog',
  templateUrl: './city-delete-dialog.component.html'
})
export class CityDeleteDialogComponent {
  city: City;

  constructor(
    private cityService: CityService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.cityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'cityListModification',
        content: 'Deleted an city'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.city.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.city.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-city-delete-popup',
  template: ''
})
export class CityDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private cityPopupService: CityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.cityPopupService.open(
        CityDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
