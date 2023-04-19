import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypeMembre } from './type-membre.model';
import { TypeMembreService } from './type-membre.service';

@Injectable()
export class TypeMembrePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private typeMembreService: TypeMembreService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.typeMembreService.find(id).subscribe(typeMembre => {
        this.typeMembreModalRef(component, typeMembre);
      });
    } else {
      return this.typeMembreModalRef(component, new TypeMembre());
    }
  }

  typeMembreModalRef(
    component: Component,
    typeMembre: TypeMembre
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.typeMembre = typeMembre;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'type-membre', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'type-membre', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
