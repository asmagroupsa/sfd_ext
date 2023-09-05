import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ZoneAgence } from './zone-agence.model';
import { ZoneAgenceService } from './zone-agence.service';

@Injectable()
export class ZoneAgencePopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private zoneAgenceService: ZoneAgenceService
  ) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.zoneAgenceService.find(id).subscribe(zoneAgence => {
          this.ngbModalRef = this.zoneAgenceModalRef(component, zoneAgence);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.zoneAgenceModalRef(
            component,
            new ZoneAgence()
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  zoneAgenceModalRef(
    component: Component,
    zoneAgence: ZoneAgence
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.zoneAgence = zoneAgence;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'zone-agence', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'zone-agence', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
