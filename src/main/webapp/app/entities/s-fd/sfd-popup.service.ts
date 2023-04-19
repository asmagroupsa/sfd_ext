import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SFD } from './sfd.model';
import { SFDService } from './sfd.service';

@Injectable()
export class SFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private sFDService: SFDService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.sFDService.find(id).subscribe(sFD => {
        if (sFD.createdDate) {
          sFD.createdDate = {
            year: sFD.createdDate.getFullYear(),
            month: sFD.createdDate.getMonth() + 1,
            day: sFD.createdDate.getDate()
          };
        }
        if (sFD.lastModifiedDate) {
          sFD.lastModifiedDate = {
            year: sFD.lastModifiedDate.getFullYear(),
            month: sFD.lastModifiedDate.getMonth() + 1,
            day: sFD.lastModifiedDate.getDate()
          };
        }
        this.sFDModalRef(component, sFD);
      });
    } else {
      return this.sFDModalRef(component, new SFD());
    }
  }

  sFDModalRef(component: Component, sFD: SFD): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.sFD = sFD;
    modalRef.result.then(
      result => {
        this.router.navigate(['/entity', 'sfd', { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(['/entity', 'sfd', { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
