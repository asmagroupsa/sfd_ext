import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { SchoolLevel } from './school-level.model';
import { SchoolLevelPopupService } from './school-level-popup.service';
import { SchoolLevelService } from './school-level.service';

@Component({
  selector: 'jhi-school-level-delete-dialog',
  templateUrl: './school-level-delete-dialog.component.html'
})
export class SchoolLevelDeleteDialogComponent {
  schoolLevel: SchoolLevel;

  constructor(
    private schoolLevelService: SchoolLevelService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.schoolLevelService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'schoolLevelListModification',
        content: 'Deleted an schoolLevel'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.schoolLevel.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.schoolLevel.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-school-level-delete-popup',
  template: ''
})
export class SchoolLevelDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private schoolLevelPopupService: SchoolLevelPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.schoolLevelPopupService.open(
        SchoolLevelDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
