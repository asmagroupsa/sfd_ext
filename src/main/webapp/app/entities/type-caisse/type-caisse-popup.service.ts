import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypeCaisse } from './type-caisse.model';
import { TypeCaisseService } from './type-caisse.service';

@Injectable()
export class TypeCaissePopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private typeCaisseService: TypeCaisseService
  ) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.typeCaisseService.find(id).subscribe(typeCaisse => {
          this.ngbModalRef = this.typeCaisseModalRef(component, typeCaisse);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.typeCaisseModalRef(
            component,
            new TypeCaisse()
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  typeCaisseModalRef(
    component: Component,
    typeCaisse: TypeCaisse
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.typeCaisse = typeCaisse;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'type-caisse', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'type-caisse', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
