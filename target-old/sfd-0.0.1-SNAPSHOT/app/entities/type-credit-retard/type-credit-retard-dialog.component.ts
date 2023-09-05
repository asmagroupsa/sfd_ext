import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeCreditRetard } from './type-credit-retard.model';
import { TypeCreditRetardPopupService } from './type-credit-retard-popup.service';
import { TypeCreditRetardService } from './type-credit-retard.service';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
declare let select_init: any;
@Component({
  selector: 'jhi-type-credit-retard-dialog',
  templateUrl: './type-credit-retard-dialog.component.html'
})
export class TypeCreditRetardDialogComponent implements OnInit {
  typeCreditRetard: TypeCreditRetard;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private typeCreditRetardService: TypeCreditRetardService,
    private eventManager: JhiEventManager,
    public langue: LanguesService
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.typeCreditRetard.id !== undefined) {
      this.subscribeToSaveResponse(
        this.typeCreditRetardService.update(this.typeCreditRetard),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.typeCreditRetardService.create(this.typeCreditRetard),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TypeCreditRetard>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TypeCreditRetard) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TypeCreditRetard, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.typeCreditRetard.created' : 'carmesfnmserviceApp.typeCreditRetard.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'typeCreditRetardListModification',
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

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

@Component({
  selector: 'jhi-type-credit-retard-popup',
  template: ''
})
export class TypeCreditRetardPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeCreditRetardPopupService: TypeCreditRetardPopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.typeCreditRetardPopupService.open(
            TypeCreditRetardDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.typeCreditRetardPopupService.open(
            TypeCreditRetardDialogComponent as Component
          );
        }
      });
    // } else {
    //   window.history.back();
    // }
  }

  ngOnDestroy() {
    if (this.routeSub)
      this.routeSub.unsubscribe();
  }
}
