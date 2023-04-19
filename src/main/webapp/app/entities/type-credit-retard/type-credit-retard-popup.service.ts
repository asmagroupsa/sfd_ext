import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypeCreditRetard } from './type-credit-retard.model';
import { TypeCreditRetardService } from './type-credit-retard.service';

@Injectable()
export class TypeCreditRetardPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private typeCreditRetardService: TypeCreditRetardService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.typeCreditRetardService.find(id).subscribe(typeCreditRetard => {
        this.typeCreditRetardModalRef(component, typeCreditRetard);
      });
    } else {
      return this.typeCreditRetardModalRef(component, new TypeCreditRetard());
    }
  }

  typeCreditRetardModalRef(
    component: Component,
    typeCreditRetard: TypeCreditRetard
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.typeCreditRetard = typeCreditRetard;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'type-credit-retard', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'type-credit-retard', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
