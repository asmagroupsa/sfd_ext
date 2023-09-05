import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Taux } from './taux.model';
import { TauxService } from './taux.service';

@Injectable()
export class TauxPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tauxService: TauxService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.tauxService.find(id).subscribe(taux => {
        if (taux.createdDate) {
          taux.createdDate = {
            year: taux.createdDate.getFullYear(),
            month: taux.createdDate.getMonth() + 1,
            day: taux.createdDate.getDate()
          };
        }
        if (taux.lastModifiedDate) {
          taux.lastModifiedDate = {
            year: taux.lastModifiedDate.getFullYear(),
            month: taux.lastModifiedDate.getMonth() + 1,
            day: taux.lastModifiedDate.getDate()
          };
        }
        this.tauxModalRef(component, taux);
      });
    } else {
      return this.tauxModalRef(component, new Taux());
    }
  }

  tauxModalRef(component: Component, taux: Taux): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.taux = taux;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'taux', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'taux', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
