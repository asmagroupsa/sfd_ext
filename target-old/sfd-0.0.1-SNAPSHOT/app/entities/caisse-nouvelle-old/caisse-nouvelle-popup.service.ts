import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';

@Injectable()
export class CaisseNouvellePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private caisseNouvelleService: CaisseNouvelleService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.caisseNouvelleService.find(id).subscribe(caisseNouvelle => {
        this.caisseNouvelleModalRef(component, caisseNouvelle);
      });
    } else {
      return this.caisseNouvelleModalRef(component, new CaisseNouvelle());
    }
  }

  caisseNouvelleModalRef(
    component: Component,
    caisseNouvelle: CaisseNouvelle
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.caisseNouvelle = caisseNouvelle;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'caisse-nouvelle', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'caisse-nouvelle', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}