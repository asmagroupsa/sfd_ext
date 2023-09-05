import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Civility } from './civility.model';
import { CivilityService } from './civility.service';

@Injectable()
export class CivilityPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private civilityService: CivilityService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.civilityService.find(id).subscribe(civility => {
        this.civilityModalRef(component, civility);
      });
    } else {
      return this.civilityModalRef(component, new Civility());
    }
  }

  civilityModalRef(component: Component, civility: Civility): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.civility = civility;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'civility', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'civility', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
