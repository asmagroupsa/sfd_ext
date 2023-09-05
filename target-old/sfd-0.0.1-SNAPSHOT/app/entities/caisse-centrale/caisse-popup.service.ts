import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Caisse } from './caisse.model';
import { CaisseCentraleService } from './caisse.service';

@Injectable()
export class CaissePopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private caisseService: CaisseCentraleService
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
        this.caisseService.find(id).subscribe(caisse => {
          if (caisse.dateOuverture) {
            caisse.dateOuverture = {
              year: caisse.dateOuverture.getFullYear(),
              month: caisse.dateOuverture.getMonth() + 1,
              day: caisse.dateOuverture.getDate()
            };
          }
          this.ngbModalRef = this.caisseModalRef(component, caisse);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.caisseModalRef(component, new Caisse());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  caisseModalRef(component: Component, caisse: Caisse): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.caisse = caisse;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'caisse', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'caisse', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
