import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DocumentGarantie } from './document-garantie.model';
import { DocumentGarantiePopupService } from './document-garantie-popup.service';
import { DocumentGarantieService } from './document-garantie.service';
import { Garantie, GarantieService } from '../garantie';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-document-garantie-dialog',
  templateUrl: './document-garantie-dialog.component.html'
})
export class DocumentGarantieDialogComponent implements OnInit {
  documentGarantie: DocumentGarantie;
  authorities: any[];
  isSaving: boolean;

  garanties: Garantie[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private documentGarantieService: DocumentGarantieService,
    private garantieService: GarantieService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.garantieService.query().subscribe(
      (res: ResponseWrapper) => {
        this.garanties = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.documentGarantie.id !== undefined) {
      this.subscribeToSaveResponse(
        this.documentGarantieService.update(this.documentGarantie),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.documentGarantieService.create(this.documentGarantie),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<DocumentGarantie>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: DocumentGarantie) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: DocumentGarantie, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.documentGarantie.created'
        : 'carmesfnmserviceApp.documentGarantie.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'documentGarantieListModification',
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

  trackGarantieById(index: number, item: Garantie) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-document-garantie-popup',
  template: ''
})
export class DocumentGarantiePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private documentGarantiePopupService: DocumentGarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.documentGarantiePopupService.open(
          DocumentGarantieDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.documentGarantiePopupService.open(
          DocumentGarantieDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
