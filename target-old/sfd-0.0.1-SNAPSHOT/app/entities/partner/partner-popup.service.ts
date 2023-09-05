import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';

@Injectable()
export class PartnerPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private partnerService: PartnerService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.partnerService.find(id).subscribe(partner => {
        if (partner.createdDate) {
          partner.createdDate = {
            year: partner.createdDate.getFullYear(),
            month: partner.createdDate.getMonth() + 1,
            day: partner.createdDate.getDate()
          };
        }
        if (partner.lastModifiedDate) {
          partner.lastModifiedDate = {
            year: partner.lastModifiedDate.getFullYear(),
            month: partner.lastModifiedDate.getMonth() + 1,
            day: partner.lastModifiedDate.getDate()
          };
        }
        this.partnerModalRef(component, partner);
      });
    } else {
      return this.partnerModalRef(component, new Partner());
    }
  }

  partnerModalRef(component: Component, partner: Partner): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.partner = partner;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'partner', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'partner', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
