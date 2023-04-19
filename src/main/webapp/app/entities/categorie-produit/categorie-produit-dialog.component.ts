import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorieProduit } from './categorie-produit.model';
import { CategorieProduitPopupService } from './categorie-produit-popup.service';
import { CategorieProduitService } from './categorie-produit.service';

@Component({
  selector: 'jhi-categorie-produit-dialog',
  templateUrl: './categorie-produit-dialog.component.html'
})
export class CategorieProduitDialogComponent implements OnInit {
  categorieProduit: CategorieProduit;
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private categorieProduitService: CategorieProduitService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.categorieProduit.id !== undefined) {
      this.subscribeToSaveResponse(
        this.categorieProduitService.update(this.categorieProduit)
      );
    } else {
      this.categorieProduit.code = 'SDG35';
      this.subscribeToSaveResponse(
        this.categorieProduitService.create(this.categorieProduit)
      );
    }
  }

  private subscribeToSaveResponse(result: Observable<CategorieProduit>) {
    result.subscribe(
      (res: CategorieProduit) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: CategorieProduit) {
    this.eventManager.broadcast({
      name: 'categorieProduitListModification',
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
  selector: 'jhi-categorie-produit-popup',
  template: ''
})
export class CategorieProduitPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private categorieProduitPopupService: CategorieProduitPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.categorieProduitPopupService.open(
          CategorieProduitDialogComponent as Component,
          params['id']
        );
      } else {
        this.categorieProduitPopupService.open(
          CategorieProduitDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
