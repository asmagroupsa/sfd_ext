import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateurCaisse } from './utilisateur-caisse.model';
import { CaisseNouvelleService } from '../caisse-nouvelle.service';

@Injectable()
export class UtilisateurCaissePopupService {
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
      this.caisseNouvelleService.find(id).subscribe(utilisateurCaisse => {
        this.utilisateurCaisseModalRef(component, utilisateurCaisse);
      });
    } else {
      return this.utilisateurCaisseModalRef(component, new UtilisateurCaisse());
    }
  }

  utilisateurCaisseModalRef(
    component: Component,
    utilisateurCaisse: UtilisateurCaisse
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.utilisateurCaisse = utilisateurCaisse;
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
