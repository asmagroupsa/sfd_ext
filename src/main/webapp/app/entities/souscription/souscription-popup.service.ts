import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Souscription } from './souscription.model';
import { SouscriptionService } from './souscription.service';

@Injectable()
export class SouscriptionPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private souscriptionService: SouscriptionService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.souscriptionService.find(id).subscribe(souscription => {
        this.souscriptionModalRef(component, souscription);
      });
    } else {
      return this.souscriptionModalRef(component, new Souscription());
    }
  }

  souscriptionModalRef(component: Component, souscription: Souscription): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.souscription = souscription;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'souscription', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'souscription', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
