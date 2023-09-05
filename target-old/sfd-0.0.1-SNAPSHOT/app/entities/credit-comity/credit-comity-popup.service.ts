import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditComity } from './credit-comity.model';
import { CreditComityService } from './credit-comity.service';

@Injectable()
export class CreditComityPopupService {
  private isOpen = false;
  private isDossier = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private creditComityService: CreditComityService
  ) { }

  open(component: Component, id?: number | any, dossier?: number): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    this.isDossier = false;
    if (dossier) {
      this.isDossier = true;
      return this.creditComityModalRef(component, null);
    }
    if (id) {
      this.creditComityService.find(id).subscribe(creditComity => {
        if (creditComity.startDate) {
          creditComity.startDate = {
            year: creditComity.startDate.getFullYear(),
            month: creditComity.startDate.getMonth() + 1,
            day: creditComity.startDate.getDate()
          };
        }
        if (creditComity.endDate) {
          creditComity.endDate = {
            year: creditComity.endDate.getFullYear(),
            month: creditComity.endDate.getMonth() + 1,
            day: creditComity.endDate.getDate()
          };
        }
        if (creditComity.createdDate) {
          creditComity.createdDate = {
            year: creditComity.createdDate.getFullYear(),
            month: creditComity.createdDate.getMonth() + 1,
            day: creditComity.createdDate.getDate()
          };
        }
        if (creditComity.lastModifiedDate) {
          creditComity.lastModifiedDate = {
            year: creditComity.lastModifiedDate.getFullYear(),
            month: creditComity.lastModifiedDate.getMonth() + 1,
            day: creditComity.lastModifiedDate.getDate()
          };
        }
        this.creditComityModalRef(component, creditComity);
      });
    } else {
      return this.creditComityModalRef(component, new CreditComity());
    }
  }

  creditComityModalRef(
    component: Component,
    creditComity: CreditComity
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.creditComity = creditComity;
    let path = ['/entity', 'credit-comity'];
    if (this.isDossier) {
      path = ['/entity', 'credit-comity', this.route.snapshot.params['id'], 'commity-dossiers'];

    }
    modalRef.result.then(
      result => {

        this.router.navigate(
          [...path, { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          [...path, { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
