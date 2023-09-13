import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SouscriptionSfd } from './souscription-sfd.model';
import { SouscriptionSfdService } from './souscription-sfd.service';

@Injectable()
export class SouscriptionSfdPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private souscriptionSfdService: SouscriptionSfdService
  ) {}

  open(component: Component | any, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.souscriptionSfdService.find(id).subscribe(souscriptionSfd => {
        if (souscriptionSfd.createdDate) {
          souscriptionSfd.createdDate = {
            year: souscriptionSfd.createdDate.getFullYear(),
            month: souscriptionSfd.createdDate.getMonth() + 1,
            day: souscriptionSfd.createdDate.getDate()
          };
        }
        if (souscriptionSfd.lastModifiedDate) {
          souscriptionSfd.lastModifiedDate = {
            year: souscriptionSfd.lastModifiedDate.getFullYear(),
            month: souscriptionSfd.lastModifiedDate.getMonth() + 1,
            day: souscriptionSfd.lastModifiedDate.getDate()
          };
        }
        this.SouscriptionSfdModalRef(component, souscriptionSfd);
      });
    } else {
      return this.SouscriptionSfdModalRef(component, new SouscriptionSfd());
    }
  }

  SouscriptionSfdModalRef(component: Component, souscriptionSfd: SouscriptionSfd): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      size: 'lg',keyboard:false,
      backdrop: 'static'
    });
    modalRef.componentInstance.souscriptionSfd = souscriptionSfd;
    modalRef.result.then(
      result => {
        this.router.navigate(['/entity', 'souscription-sfd', { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(['/entity', 'souscription-sfd', { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
