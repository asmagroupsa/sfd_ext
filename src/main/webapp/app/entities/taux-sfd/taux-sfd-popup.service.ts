import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TauxSFD } from './taux-sfd.model';
import { TauxSFDService } from './taux-sfd.service';

@Injectable()
export class TauxSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tauxSFDService: TauxSFDService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.tauxSFDService.find(id).subscribe(tauxSFD => {
        if (tauxSFD.createdDate) {
          tauxSFD.createdDate = {
            year: tauxSFD.createdDate.getFullYear(),
            month: tauxSFD.createdDate.getMonth() + 1,
            day: tauxSFD.createdDate.getDate()
          };
        }
        if (tauxSFD.lastModifiedDate) {
          tauxSFD.lastModifiedDate = {
            year: tauxSFD.lastModifiedDate.getFullYear(),
            month: tauxSFD.lastModifiedDate.getMonth() + 1,
            day: tauxSFD.lastModifiedDate.getDate()
          };
        }
        this.tauxSFDModalRef(component, tauxSFD);
      });
    } else {
      return this.tauxSFDModalRef(component, new TauxSFD());
    }
  }

  tauxSFDModalRef(component: Component, tauxSFD: TauxSFD): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.tauxSFD = tauxSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'taux-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'taux-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
