import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Poste } from './poste.model';
import { PostePopupService } from './poste-popup.service';
import { PosteService } from './poste.service';
declare let select_init: any;

@Component({
  selector: 'jhi-poste-dialog',
  templateUrl: './poste-dialog.component.html'
})
export class PosteDialogComponent implements OnInit {
  poste: Poste;
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private posteService: PosteService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.poste.id !== undefined) {
      this.subscribeToSaveResponse(this.posteService.update(this.poste));
    } else {
      this.subscribeToSaveResponse(this.posteService.create(this.poste));
    }
  }

  private subscribeToSaveResponse(result: Observable<Poste>) {
    result.subscribe(
      (res: Poste) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Poste) {
    this.eventManager.broadcast({
      name: 'posteListModification',
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
  selector: 'jhi-poste-popup',
  template: ''
})
export class PostePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private postePopupService: PostePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.postePopupService.open(
          PosteDialogComponent as Component,
          params['id']
        );
      } else {
        this.postePopupService.open(PosteDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
