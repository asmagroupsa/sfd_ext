import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Ecriture } from './ecriture.model';
import { EcritureService } from './ecriture.service';

@Injectable()
export class EcriturePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ecritureService: EcritureService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.ecritureService.find(id).subscribe(ecriture => {
        this.ecritureModalRef(component, ecriture);
      });
    } else {
      return this.ecritureModalRef(component, new Ecriture());
    }
  }

  ecritureModalRef(component: Component, ecriture: Ecriture): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.ecriture = ecriture;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'ecriture', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'ecriture', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
