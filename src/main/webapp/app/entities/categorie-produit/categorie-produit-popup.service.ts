import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategorieProduit } from './categorie-produit.model';
import { CategorieProduitService } from './categorie-produit.service';

@Injectable()
export class CategorieProduitPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private categorieProduitService: CategorieProduitService
  ) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.categorieProduitService.find(id).subscribe(categorieProduit => {
          this.ngbModalRef = this.categorieProduitModalRef(
            component,
            categorieProduit
          );
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.categorieProduitModalRef(
            component,
            new CategorieProduit()
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  categorieProduitModalRef(
    component: Component,
    categorieProduit: CategorieProduit
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.categorieProduit = categorieProduit;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'categorie-produit', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'categorie-produit', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
