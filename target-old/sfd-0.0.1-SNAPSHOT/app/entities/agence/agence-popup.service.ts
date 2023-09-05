import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Agence } from './agence.model';
import { AgenceService } from './agence.service';
import { Principal } from '../../shared/auth/principal.service';

@Injectable()
export class AgencePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private agenceService: AgenceService,
    public principal: Principal
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.agenceService.find(id).subscribe(agence => {
        if (agence.createdDate) {
          agence.createdDate = {
            year: agence.createdDate.getFullYear(),
            month: agence.createdDate.getMonth() + 1,
            day: agence.createdDate.getDate()
          };
        }
        if (agence.lastModifiedDate) {
          agence.lastModifiedDate = {
            year: agence.lastModifiedDate.getFullYear(),
            month: agence.lastModifiedDate.getMonth() + 1,
            day: agence.lastModifiedDate.getDate()
          };
        }
        this.agenceModalRef(component, agence);
      });
    } else {
      return this.agenceModalRef(component, new Agence());
    }
  }

  agenceModalRef(component: Component, agence: Agence): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.agence = agence;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'agence', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'agence', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
