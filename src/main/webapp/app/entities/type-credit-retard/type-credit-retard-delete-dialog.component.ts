import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { TypeCreditRetardPopupService } from './type-credit-retard-popup.service';
import { TypeCreditRetard } from './type-credit-retard.model';
import { TypeCreditRetardService } from './type-credit-retard.service';

@Component({
  selector: 'jhi-type-credit-retard-delete-dialog',
  templateUrl: './type-credit-retard-delete-dialog.component.html'
})
export class TypeCreditRetardDeleteDialogComponent {
  typeCreditRetard: TypeCreditRetard;

  constructor(
    private typeCreditRetardService: TypeCreditRetardService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.typeCreditRetardService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'typeCreditRetardListModification',
        content: 'Deleted an typeCreditRetard'
      });
      this.activeModal.dismiss(true);
      this.alertService.success(
        'carmesfnmserviceApp.typeCreditRetard.deleted',
        { param: id },
        null
      );
    }, (e) => {
      this.alertService.success(
        'carmesfnmserviceApp.typeCreditRetard.deleted',
        { param: id },
        null
      );
    });
  }
}

@Component({
  selector: 'jhi-type-credit-retard-delete-popup',
  template: ''
})
export class TypeCreditRetardDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeCreditRetardPopupService: TypeCreditRetardPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.typeCreditRetardPopupService.open(
        TypeCreditRetardDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
