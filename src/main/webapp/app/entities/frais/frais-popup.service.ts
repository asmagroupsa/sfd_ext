import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Frais } from './frais.model';
import { FraisService } from './frais.service';

@Injectable()
export class FraisPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private fraisService: FraisService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.fraisService.find(id).subscribe(frais => {
        if (frais.createdDate) {
          frais.createdDate = {
            year: frais.createdDate.getFullYear(),
            month: frais.createdDate.getMonth() + 1,
            day: frais.createdDate.getDate()
          };
        }
        if (frais.lastModifiedDate) {
          frais.lastModifiedDate = {
            year: frais.lastModifiedDate.getFullYear(),
            month: frais.lastModifiedDate.getMonth() + 1,
            day: frais.lastModifiedDate.getDate()
          };
        }
        this.fraisModalRef(component, frais);
      });
    } else {
      return this.fraisModalRef(component, new Frais());
    }
  }

  fraisModalRef(component: Component, frais: Frais): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.frais = frais;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'frais', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'frais', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
