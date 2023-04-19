import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Leader } from './leader.model';
import { LeaderPopupService } from './leader-popup.service';
import { LeaderService } from './leader.service';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-leader-dialog',
  templateUrl: './leader-dialog.component.html'
})
export class LeaderDialogComponent implements OnInit {
  leader: Leader;
  authorities: any[];
  isSaving: boolean;
  birthDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private leaderService: LeaderService,
    private eventManager: JhiEventManager,
    public principal: Principal
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
    this.principal.identity().then(
      (identity: any) => {
        if (this.leader.id !== undefined) {
          setLastModifyBy(this.leader, identity);
          //this.leader.lastModifiedBy = identity.firstName || '';
          //this.leader.lastModifiedBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.leaderService.update(this.leader),
            false
          );
        } else {
          setCreateBy(this.leader, identity);
          //this.leader.createdBy = identity.firstName || '';
          //this.leader.createdBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.leaderService.create(this.leader),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Leader>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Leader) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Leader, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.leader.created' : 'carmesfnmserviceApp.leader.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'leaderListModification',
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
  selector: 'jhi-leader-popup',
  template: ''
})
export class LeaderPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private leaderPopupService: LeaderPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.leaderPopupService.open(
          LeaderDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.leaderPopupService.open(LeaderDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
