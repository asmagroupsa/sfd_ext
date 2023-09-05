import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LigneRequest } from './ligne-request.model';
import { LigneRequestService } from './ligne-request.service';

@Injectable()
export class LigneRequestPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ligneRequestService: LigneRequestService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.ligneRequestService.find(id).subscribe(ligneRequest => {
        if (ligneRequest.requestDate) {
          ligneRequest.requestDate = {
            year: ligneRequest.requestDate.getFullYear(),
            month: ligneRequest.requestDate.getMonth() + 1,
            day: ligneRequest.requestDate.getDate()
          };
        }
        if (ligneRequest.createdDate) {
          ligneRequest.createdDate = {
            year: ligneRequest.createdDate.getFullYear(),
            month: ligneRequest.createdDate.getMonth() + 1,
            day: ligneRequest.createdDate.getDate()
          };
        }
        if (ligneRequest.lastModifiedDate) {
          ligneRequest.lastModifiedDate = {
            year: ligneRequest.lastModifiedDate.getFullYear(),
            month: ligneRequest.lastModifiedDate.getMonth() + 1,
            day: ligneRequest.lastModifiedDate.getDate()
          };
        }
        this.ligneRequestModalRef(component, ligneRequest);
      });
    } else {
      return this.ligneRequestModalRef(component, new LigneRequest());
    }
  }

  ligneRequestModalRef(
    component: Component,
    ligneRequest: LigneRequest
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.ligneRequest = ligneRequest;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'ligne-request', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'ligne-request', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
