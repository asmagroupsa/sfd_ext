import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Country } from './country.model';
import { CountryPopupService } from './country-popup.service';
import { CountryService } from './country.service';

@Component({
  selector: 'jhi-country-delete-dialog',
  templateUrl: './country-delete-dialog.component.html'
})
export class CountryDeleteDialogComponent {
  country: Country;

  constructor(
    private countryService: CountryService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.countryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'countryListModification',
        content: 'Deleted an country'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.country.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.country.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-country-delete-popup',
  template: ''
})
export class CountryDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private countryPopupService: CountryPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.countryPopupService.open(
        CountryDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
