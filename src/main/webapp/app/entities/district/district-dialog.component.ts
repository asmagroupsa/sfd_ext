import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { District } from './district.model';
import { DistrictPopupService } from './district-popup.service';
import { DistrictService } from './district.service';
import { TownShip, TownShipService } from '../town-ship';
import { ResponseWrapper } from '../../shared';
import { CityService } from '../city';
import { DepartementService } from '../departement';
declare let select_init: any;

@Component({
  selector: 'jhi-district-dialog',
  templateUrl: './district-dialog.component.html'
})
export class DistrictDialogComponent implements OnInit {
  district: District;
  authorities: any[];
  isSaving: boolean;

  departements: any[];
  cities: any[];
  depId: any;
  cityId: any;
  townships: TownShip[];
  loading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private districtService: DistrictService,
    private townShipService: TownShipService,
    private cityService: CityService,
    private depService: DepartementService,
    private eventManager: JhiEventManager
  ) {}


  ngAfterViewInit() {
    select_init();
    if (this.district.id !== undefined) {
      this.depId = this.district.townShip.city.departement.id;
      this.cityId = this.district.townShip.city.id;
      this.getCityByDep(this.depId);
      this.getTownShipByCity(this.cityId);
    }
  }


  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    /* this.townShipService.query().subscribe(
      (res: ResponseWrapper) => {
        this.townships = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    ); */

    this.getDep();
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  getTownShipByCity(id){
    this.loading = true;
    const req: any = {
        'cityId.equals': id,
        NO_QUERY: true
    };
    this.townShipService.query(req).subscribe(
      (res: ResponseWrapper) => {
        this.townships = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  getCityByDep(id){
    this.loading = true;
    const req: any = {
      'departementId.equals': id,
      NO_QUERY: true
    };
    this.cityService.query(req).subscribe(
      (res: ResponseWrapper) => {
        this.cities = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  getDep(){
    this.loading = true;
    this.depService.query().subscribe(
      (res: ResponseWrapper) => {
        this.departements = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  trackById(index: number, item) {
    return item.id;
  }

  save() {
    this.isSaving = true;
    if (this.district.id !== undefined) {
      this.subscribeToSaveResponse(
        this.districtService.update(this.district),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.districtService.create(this.district),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<District>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: District) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: District, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.district.created' : 'carmesfnmserviceApp.district.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'districtListModification',
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

  trackTownShipById(index: number, item: TownShip) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-district-popup',
  template: ''
})
export class DistrictPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private districtPopupService: DistrictPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.districtPopupService.open(
          DistrictDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.districtPopupService.open(DistrictDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
