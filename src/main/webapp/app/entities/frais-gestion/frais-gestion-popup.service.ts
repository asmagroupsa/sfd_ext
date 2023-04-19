import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FraisGestion } from './frais-gestion.model';
import { FraisGestionService } from './frais-gestion.service';

@Injectable()
export class FraisGestionPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private fraisGestionService: FraisGestionService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.fraisGestionService.find(id).subscribe(fraisGestion => {
        if (fraisGestion.createdDate) {
          fraisGestion.createdDate = {
            year: fraisGestion.createdDate.getFullYear(),
            month: fraisGestion.createdDate.getMonth() + 1,
            day: fraisGestion.createdDate.getDate()
          };
        }
        if (fraisGestion.lastModifiedDate) {
          fraisGestion.lastModifiedDate = {
            year: fraisGestion.lastModifiedDate.getFullYear(),
            month: fraisGestion.lastModifiedDate.getMonth() + 1,
            day: fraisGestion.lastModifiedDate.getDate()
          };
        }
        this.fraisGestionModalRef(component, fraisGestion);
      });
    } else {
      return this.fraisGestionModalRef(component, new FraisGestion());
    }
  }

  fraisGestionModalRef(
    component: Component,
    fraisGestion: FraisGestion
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.fraisGestion = fraisGestion;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'frais-gestion', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'frais-gestion', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
