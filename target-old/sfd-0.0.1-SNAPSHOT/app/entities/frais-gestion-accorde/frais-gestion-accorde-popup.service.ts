import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FraisGestionAccorde } from './frais-gestion-accorde.model';
import { FraisGestionAccordeService } from './frais-gestion-accorde.service';

@Injectable()
export class FraisGestionAccordePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private fraisGestionAccordeService: FraisGestionAccordeService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.fraisGestionAccordeService
        .find(id)
        .subscribe(fraisGestionAccorde => {
          if (fraisGestionAccorde.createdDate) {
            fraisGestionAccorde.createdDate = {
              year: fraisGestionAccorde.createdDate.getFullYear(),
              month: fraisGestionAccorde.createdDate.getMonth() + 1,
              day: fraisGestionAccorde.createdDate.getDate()
            };
          }
          if (fraisGestionAccorde.lastModifiedDate) {
            fraisGestionAccorde.lastModifiedDate = {
              year: fraisGestionAccorde.lastModifiedDate.getFullYear(),
              month: fraisGestionAccorde.lastModifiedDate.getMonth() + 1,
              day: fraisGestionAccorde.lastModifiedDate.getDate()
            };
          }
          this.fraisGestionAccordeModalRef(component, fraisGestionAccorde);
        });
    } else {
      return this.fraisGestionAccordeModalRef(
        component,
        new FraisGestionAccorde()
      );
    }
  }

  fraisGestionAccordeModalRef(
    component: Component,
    fraisGestionAccorde: FraisGestionAccorde
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.fraisGestionAccorde = fraisGestionAccorde;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'frais-gestion-accorde', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'frais-gestion-accorde', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
