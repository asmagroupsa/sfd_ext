import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { ComityMber } from './comity-menu.model';
import { ComityMberPopupService } from './comity-menu-popup.service';
import { ComityMberService } from './comity-menu.service';
import { ServiceUser, ServiceUserService } from '../service-user';
import { TypeMembre, TypeMembreService } from '../type-membre';
import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-comity-menu-dialog',
  templateUrl: './comity-menu-dialog.component.html'
})
export class ComityMberDialogComponent implements OnInit {
  comityMber: ComityMber;
  authorities: any[];
  isSaving: boolean;

  serviceusers: ServiceUser[];

  typemembres: TypeMembre[];
  nominationDateDp: any;
  endNominationDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private comityMberService: ComityMberService,
    private serviceUserService: ServiceUserService,
    private typeMembreService: TypeMembreService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.serviceUserService.query().subscribe(
      (res: ResponseWrapper) => {
        this.serviceusers = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.typeMembreService.query().subscribe(
      (res: ResponseWrapper) => {
        this.typemembres = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.principal.identity().then(
      (identity: any) => {
        if (this.comityMber.id !== undefined) {
          setLastModifyBy(this.comityMber, identity);
          //this.comityMber.lastModifiedBy = identity.firstName || '';
          //this.comityMber.lastModifiedBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.comityMberService.update(this.comityMber),
            false
          );
        } else {
          setCreateBy(this.comityMber, identity);
          //this.comityMber.createdBy = identity.firstName || '';
          //this.comityMber.createdBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.comityMberService.create(this.comityMber),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<ComityMber>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: ComityMber) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: ComityMber, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.comityMber.created' : 'carmesfnmserviceApp.comityMber.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'comityMberListModification',
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

  trackServiceUserById(index: number, item: ServiceUser) {
    return item.id;
  }

  trackTypeMembreById(index: number, item: TypeMembre) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-comity-mber-popup',
  template: ''
})
export class ComityMberPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private comityMberPopupService: ComityMberPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.comityMberPopupService.open(
          ComityMberDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.comityMberPopupService.open(
          ComityMberDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
