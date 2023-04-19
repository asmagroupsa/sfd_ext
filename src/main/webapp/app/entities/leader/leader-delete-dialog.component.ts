import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Leader } from './leader.model';
import { LeaderPopupService } from './leader-popup.service';
import { LeaderService } from './leader.service';

@Component({
  selector: 'jhi-leader-delete-dialog',
  templateUrl: './leader-delete-dialog.component.html'
})
export class LeaderDeleteDialogComponent {
  leader: Leader;

  constructor(
    private leaderService: LeaderService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.leaderService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'leaderListModification',
        content: 'Deleted an leader'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.leader.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.leader.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-leader-delete-popup',
  template: ''
})
export class LeaderDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private leaderPopupService: LeaderPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.leaderPopupService.open(
        LeaderDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
