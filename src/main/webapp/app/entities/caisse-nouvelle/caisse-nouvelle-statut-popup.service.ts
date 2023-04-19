import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CaisseNouvelleService } from './caisse-nouvelle.service';
import { CaisseNouvelleStatut } from './caisse-nouvelle-statut.model';

@Injectable()
export class CaisseNouvelleStatutPopupService {
  private isOpen = false;
  caisseNouvelleStatut :  CaisseNouvelleStatut = new CaisseNouvelleStatut();
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
        return this.caisseNouvelleStatutModalRef(component, this.caisseNouvelleStatut.id = id);

    } else {

    }
  }

  caisseNouvelleStatutModalRef(
    component: Component,
    caisseNouvelleStatut: CaisseNouvelleStatut
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.caisseNouvelleStatut = caisseNouvelleStatut;
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
