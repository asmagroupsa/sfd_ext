import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Poste } from './poste.model';
import { PosteService } from './poste.service';

@Injectable()
export class PostePopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private posteService: PosteService
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
        this.posteService.find(id).subscribe(poste => {
          this.ngbModalRef = this.posteModalRef(component, poste);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.posteModalRef(component, new Poste());
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  posteModalRef(component: Component, poste: Poste): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.poste = poste;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'poste', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'poste', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
