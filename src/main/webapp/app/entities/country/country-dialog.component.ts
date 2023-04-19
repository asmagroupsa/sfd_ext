import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Country } from './country.model';
import { CountryPopupService } from './country-popup.service';
import { CountryService } from './country.service';
import { UserData } from '../../shared';

@Component({
  selector: 'jhi-country-dialog',
  templateUrl: './country-dialog.component.html',
  styles: [
    `
      select{


       height: 50px;
       font-size:15px;
border:none;
border-bottom:1.5px solid;
      }
       `
  ]
})
export class CountryDialogComponent implements OnInit {
  country: Country;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private countryService: CountryService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.country.id !== undefined) {
      this.subscribeToSaveResponse(
        this.countryService.update(this.country),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.countryService.create(this.country),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Country>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Country) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Country, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.country.created' : 'carmesfnmserviceApp.country.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'countryListModification',
      content: 'OK'
    });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError(error) {
    try {
      error.json();
    } catch (exception) {
      error.message = error.text();
    }
    this.isSaving = false;
    this.onError(error);
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-country-popup',
  template: ''
})
export class CountryPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private countryPopupService: CountryPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.countryPopupService.open(
          CountryDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.countryPopupService.open(CountryDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
