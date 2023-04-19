import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Garantie } from './garantie.model';
import { GarantiePopupService } from './garantie-popup.service';
import { GarantieService } from './garantie.service';
import { CreditRequest, CreditRequestService } from '../credit-request';
import { ResponseWrapper, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-garantie-dialog',
  templateUrl: './garantie-dialog.component.html'
})
export class GarantieDialogComponent implements OnInit {
  garantie: Garantie;
  authorities: any[];
  isSaving: boolean;

  creditrequests: CreditRequest[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private garantieService: GarantieService,
    private creditRequestService: CreditRequestService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.creditRequestService.query().subscribe(
      (res: ResponseWrapper) => {
        this.creditrequests = res.json;
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
        if (this.garantie.id !== undefined) {
          setLastModifyBy(this.garantie, identity);
          //this.garantie.lastModifiedBy = identity.firstName || '';
          //this.garantie.lastModifiedBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.garantieService.update(this.garantie),
            false
          );
        } else {
          setCreateBy(this.garantie, identity);
          this.subscribeToSaveResponse(
            this.garantieService.create(this.garantie),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Garantie>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Garantie) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Garantie, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.garantie.created' : 'carmesfnmserviceApp.garantie.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'garantieListModification',
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

  trackCreditRequestById(index: number, item: CreditRequest) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-garantie-popup',
  template: ''
})
export class GarantiePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private garantiePopupService: GarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.garantiePopupService.open(
          GarantieDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.garantiePopupService.open(GarantieDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
