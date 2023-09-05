import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Literacy } from './literacy.model';
import { LiteracyService } from './literacy.service';

@Injectable()
export class LiteracyPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private literacyService: LiteracyService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.literacyService.find(id).subscribe(literacy => {
        this.literacyModalRef(component, literacy);
      });
    } else {
      return this.literacyModalRef(component, new Literacy());
    }
  }

  literacyModalRef(component: Component, literacy: Literacy): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.literacy = literacy;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'literacy', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'literacy', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
