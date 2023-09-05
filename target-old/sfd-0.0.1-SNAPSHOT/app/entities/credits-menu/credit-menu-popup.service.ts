import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditMenu } from './credit-menu.model';
import { CreditMenuService } from './credit-menu.service';

@Injectable()
export class CreditMenuPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private unityService: CreditMenuService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.unityService.find(id).subscribe(unity => {
        this.unityModalRef(component, unity);
      });
    } else {
      return this.unityModalRef(component, new CreditMenu());
    }
  }

  unityModalRef(component: Component, unity: CreditMenu): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.unity = unity;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'unity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'unity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
