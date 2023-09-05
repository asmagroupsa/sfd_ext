import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrancheTauxFrais } from './tranche-taux-frais.model';
import { TrancheTauxFraisService } from './tranche-taux-frais.service';

@Injectable()
export class TrancheTauxFraisPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private trancheTauxFraisService: TrancheTauxFraisService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.trancheTauxFraisService.find(id).subscribe(trancheTauxFrais => {
        if (trancheTauxFrais.createdDate) {
          trancheTauxFrais.createdDate = {
            year: trancheTauxFrais.createdDate.getFullYear(),
            month: trancheTauxFrais.createdDate.getMonth() + 1,
            day: trancheTauxFrais.createdDate.getDate()
          };
        }
        if (trancheTauxFrais.lastModifiedDate) {
          trancheTauxFrais.lastModifiedDate = {
            year: trancheTauxFrais.lastModifiedDate.getFullYear(),
            month: trancheTauxFrais.lastModifiedDate.getMonth() + 1,
            day: trancheTauxFrais.lastModifiedDate.getDate()
          };
        }
        this.trancheTauxFraisModalRef(component, trancheTauxFrais);
      });
    } else {
      return this.trancheTauxFraisModalRef(component, new TrancheTauxFrais());
    }
  }

  trancheTauxFraisModalRef(
    component: Component,
    trancheTauxFrais: TrancheTauxFrais
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.trancheTauxFrais = trancheTauxFrais;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'tranche-taux-frais', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'tranche-taux-frais', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
