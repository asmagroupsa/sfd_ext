import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Ressource } from './ressource.model';
import { RessourceService } from './ressource.service';

@Injectable()
export class RessourcePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ressourceService: RessourceService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.ressourceService.find(id).subscribe(ressource => {
        this.ressourceModalRef(component, ressource);
      });
    } else {
      return this.ressourceModalRef(component, new Ressource());
    }
  }

  ressourceModalRef(component: Component, ressource: Ressource): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.ressource = ressource;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'ressource', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'ressource', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
