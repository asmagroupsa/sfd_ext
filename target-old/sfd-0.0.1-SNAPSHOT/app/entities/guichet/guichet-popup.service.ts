import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Annee } from './guichet.model';
import { AnneeService } from './guichet.service';

@Injectable()
export class AnneePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private anneeService: AnneeService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.anneeService.find(id).subscribe(annee => {
        if (annee.createdDate) {
          annee.createdDate = {
            year: annee.createdDate.getFullYear(),
            month: annee.createdDate.getMonth() + 1,
            day: annee.createdDate.getDate()
          };
        }
        if (annee.lastModifiedDate) {
          annee.lastModifiedDate = {
            year: annee.lastModifiedDate.getFullYear(),
            month: annee.lastModifiedDate.getMonth() + 1,
            day: annee.lastModifiedDate.getDate()
          };
        }
        this.anneeModalRef(component, annee);
      });
    } else {
      return this.anneeModalRef(component, new Annee());
    }
  }

  anneeModalRef(component: Component, annee: Annee): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.annee = annee;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'agence', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'agence', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
