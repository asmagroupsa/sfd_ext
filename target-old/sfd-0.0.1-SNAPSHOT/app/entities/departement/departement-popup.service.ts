import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Departement } from './departement.model';
import { DepartementService } from './departement.service';

@Injectable()
export class DepartementPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private departementService: DepartementService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.departementService.find(id).subscribe(departement => {
        this.departementModalRef(component, departement);
      });
    } else {
      return this.departementModalRef(component, new Departement());
    }
  }

  departementModalRef(
    component: Component,
    departement: Departement
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.departement = departement;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'departement', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'departement', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
