import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Unity } from './validations.model';
import { UnityService } from './validations.service';

@Injectable()
export class UnityPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private unityService: UnityService
  ) {}

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
      return this.unityModalRef(component, new Unity());
    }
  }

  unityModalRef(component: Component, unity: Unity): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.unity = unity;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'validations', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'validations', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
