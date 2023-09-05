import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Departement } from './departement.model';
import { DepartementPopupService } from './departement-popup.service';
import { DepartementService } from './departement.service';
import { Country, CountryService } from '../country';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-departement-dialog',
  templateUrl: './departement-dialog.component.html'
})
export class DepartementDialogComponent implements OnInit {
  departement: Departement;
  authorities: any[];
  isSaving: boolean;

  countries: Country[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private departementService: DepartementService,
    private countryService: CountryService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.countryService.query().subscribe(
      (res: ResponseWrapper) => {
        this.countries = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.departement.id !== undefined) {
      this.subscribeToSaveResponse(
        this.departementService.update(this.departement),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.departementService.create(this.departement),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Departement>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Departement) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Departement, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.departement.created' : 'carmesfnmserviceApp.departement.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'departementListModification',
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

  trackCountryById(index: number, item: Country) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-departement-popup',
  template: ''
})
export class DepartementPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private departementPopupService: DepartementPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.departementPopupService.open(
          DepartementDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.departementPopupService.open(
          DepartementDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
