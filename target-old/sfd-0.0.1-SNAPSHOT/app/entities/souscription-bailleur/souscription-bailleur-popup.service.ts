import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SouscriptionBailleur } from './souscription-bailleur.model';
import { SouscriptionBailleurService } from './souscription-bailleur.service';

@Injectable()
export class SouscriptionBailleurPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private souscriptionBailleurService: SouscriptionBailleurService
  ) {}

  open(component: Component | any, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.souscriptionBailleurService.find(id).subscribe(souscriptionBailleur => {
        if (souscriptionBailleur.createdDate) {
          souscriptionBailleur.createdDate = {
            year: souscriptionBailleur.createdDate.getFullYear(),
            month: souscriptionBailleur.createdDate.getMonth() + 1,
            day: souscriptionBailleur.createdDate.getDate()
          };
        }
        if (souscriptionBailleur.lastModifiedDate) {
          souscriptionBailleur.lastModifiedDate = {
            year: souscriptionBailleur.lastModifiedDate.getFullYear(),
            month: souscriptionBailleur.lastModifiedDate.getMonth() + 1,
            day: souscriptionBailleur.lastModifiedDate.getDate()
          };
        }
        this.SouscriptionBailleurModalRef(component, souscriptionBailleur);
      });
    } else {
      return this.SouscriptionBailleurModalRef(component, new SouscriptionBailleur());
    }
  }

  SouscriptionBailleurModalRef(component: Component, souscriptionBailleur: SouscriptionBailleur): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      size: 'lg',keyboard:false,
      backdrop: 'static'
    });
    modalRef.componentInstance.souscriptionBailleur = souscriptionBailleur;
    modalRef.result.then(
      result => {
        this.router.navigate(['/entity', 'souscription-bailleur', { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(['/entity', 'souscription-bailleur', { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
