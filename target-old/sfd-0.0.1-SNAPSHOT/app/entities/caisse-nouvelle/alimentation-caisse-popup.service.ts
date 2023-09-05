import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CaisseNouvelleService } from './caisse-nouvelle.service';
import { AlimentationCaisse } from './alimentation-caisse.model';

@Injectable()
export class AlimentationCaissePopupService {
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
      this.caisseNouvelleService.find(id).subscribe(alimentationCaisse => {
        this.alimentationCaisseModalRef(component, alimentationCaisse);
      });
    } else {
      return this.alimentationCaisseModalRef(component, new AlimentationCaisse());
    }
  }

  alimentationCaisseModalRef(
    component: Component,
    alimentationCaisse: AlimentationCaisse
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.alimentationCaisse = alimentationCaisse;
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
