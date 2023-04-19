import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProduitTypeGarantie } from './produit-type-garantie.model';
import { ProduitTypeGarantieService } from './produit-type-garantie.service';

@Injectable()
export class ProduitTypeGarantiePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private produitTypeGarantieService: ProduitTypeGarantieService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.produitTypeGarantieService.find(id).subscribe(produitTypeGarantie => {
        // if (produitTypeGarantie.createdDate) {
        //   produitTypeGarantie.createdDate = {
        //     year: produitTypeGarantie.createdDate.getFullYear(),
        //     month: produitTypeGarantie.createdDate.getMonth() + 1,
        //     day: produitTypeGarantie.createdDate.getDate()
        //   };
        // }
        // if (produitTypeGarantie.lastModifiedDate) {
        //   produitTypeGarantie.lastModifiedDate = {
        //     year: produitTypeGarantie.lastModifiedDate.getFullYear(),
        //     month: produitTypeGarantie.lastModifiedDate.getMonth() + 1,
        //     day: produitTypeGarantie.lastModifiedDate.getDate()
        //   };
        // }
        this.tranchePenalModalRef(component, produitTypeGarantie);
      });
    } else {
      return this.tranchePenalModalRef(component, new ProduitTypeGarantie());
    }
  }

  tranchePenalModalRef(
    component: Component,
    produitTypeGarantie: ProduitTypeGarantie
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.produitTypeGarantie = produitTypeGarantie;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'produit-type-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'produit-type-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
