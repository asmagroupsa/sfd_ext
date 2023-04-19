import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EcheancierClient } from './echeancier-client.model';
import { EcheancierClientService } from './echeancier-client.service';

@Injectable()
export class EcheancierClientPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private echeancierClientService: EcheancierClientService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.echeancierClientService.find(id).subscribe(echeancierClient => {
        if (echeancierClient.startDate) {
          echeancierClient.startDate = {
            year: echeancierClient.startDate.getFullYear(),
            month: echeancierClient.startDate.getMonth() + 1,
            day: echeancierClient.startDate.getDate()
          };
        }
        if (echeancierClient.createdDate) {
          echeancierClient.createdDate = {
            year: echeancierClient.createdDate.getFullYear(),
            month: echeancierClient.createdDate.getMonth() + 1,
            day: echeancierClient.createdDate.getDate()
          };
        }
        if (echeancierClient.lastModifiedDate) {
          echeancierClient.lastModifiedDate = {
            year: echeancierClient.lastModifiedDate.getFullYear(),
            month: echeancierClient.lastModifiedDate.getMonth() + 1,
            day: echeancierClient.lastModifiedDate.getDate()
          };
        }
        this.echeancierClientModalRef(component, echeancierClient);
      });
    } else {
      return this.echeancierClientModalRef(component, new EcheancierClient());
    }
  }

  echeancierClientModalRef(
    component: Component,
    echeancierClient: EcheancierClient
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.echeancierClient = echeancierClient;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'echeancier-client', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'echeancier-client', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
