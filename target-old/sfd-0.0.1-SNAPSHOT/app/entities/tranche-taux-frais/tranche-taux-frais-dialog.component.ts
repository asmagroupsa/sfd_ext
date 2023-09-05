import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TrancheTauxFrais } from './tranche-taux-frais.model';
import { TrancheTauxFraisPopupService } from './tranche-taux-frais-popup.service';
import { TrancheTauxFraisService } from './tranche-taux-frais.service';
declare let select_init: any;
@Component({
  selector: 'jhi-tranche-taux-frais-dialog',
  templateUrl: './tranche-taux-frais-dialog.component.html'
})
export class TrancheTauxFraisDialogComponent implements OnInit {
  trancheTauxFrais: TrancheTauxFrais;
  authorities: any[];
  isSaving: boolean;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private trancheTauxFraisService: TrancheTauxFraisService,
    private eventManager: JhiEventManager
  ) {}
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
    if (this.trancheTauxFrais.id !== undefined) {
      this.subscribeToSaveResponse(
        this.trancheTauxFraisService.update(this.trancheTauxFrais),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.trancheTauxFraisService.create(this.trancheTauxFrais),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TrancheTauxFrais>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TrancheTauxFrais) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TrancheTauxFrais, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.trancheTauxFrais.created'
        : 'carmesfnmserviceApp.trancheTauxFrais.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'trancheTauxFraisListModification',
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
  selector: 'jhi-tranche-taux-frais-popup',
  template: ''
})
export class TrancheTauxFraisPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private trancheTauxFraisPopupService: TrancheTauxFraisPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.trancheTauxFraisPopupService.open(
          TrancheTauxFraisDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.trancheTauxFraisPopupService.open(
          TrancheTauxFraisDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
