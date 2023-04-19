import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';
import { AlimentationCaisseSfd } from './alimentation-caisse-sfd.model';

@Injectable()
export class AlimentationCaisseSfdPopupService {
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
      this.caisseNouvelleService.find(id).subscribe(alimentationCaisseSfd => {
        this.alimentationCaisseSfdModalRef(component, alimentationCaisseSfd);
      });
    } else {
      return this.alimentationCaisseSfdModalRef(component, new AlimentationCaisseSfd());
    }
  }

  alimentationCaisseSfdModalRef(
    component: Component,
    alimentationCaisseSfd: AlimentationCaisseSfd
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.alimentationCaisseSfd = alimentationCaisseSfd;
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
