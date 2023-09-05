import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Credit } from './credit.model';
import { CreditService } from './credit.service';

@Injectable()
export class CreditPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private creditService: CreditService
  ) { }

  open(component: Component, id?: any, penaliterestant?: number): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    if (id && !penaliterestant) {
      this.creditService.find(id).subscribe(credit => {
        if (credit.startDate) {
          credit.startDate = {
            year: credit.startDate.getFullYear(),
            month: credit.startDate.getMonth() + 1,
            day: credit.startDate.getDate()
          };
        }
        if (credit.endDate) {
          credit.endDate = {
            year: credit.endDate.getFullYear(),
            month: credit.endDate.getMonth() + 1,
            day: credit.endDate.getDate()
          };
        }
        if (credit.createdDate) {
          credit.createdDate = {
            year: credit.createdDate.getFullYear(),
            month: credit.createdDate.getMonth() + 1,
            day: credit.createdDate.getDate()
          };
        }
        if (credit.lastModifiedDate) {
          credit.lastModifiedDate = {
            year: credit.lastModifiedDate.getFullYear(),
            month: credit.lastModifiedDate.getMonth() + 1,
            day: credit.lastModifiedDate.getDate()
          };
        }
        this.creditModalRef(component, credit);
      });
    } else if (id && penaliterestant) {
      let name = this.activatedRoute.snapshot.queryParams['name'];
      this.creditModalRef(component, { id, name, penaliterestant }, true);
    } else {
      return this.creditModalRef(component, new Credit());
    }
  }

  creditModalRef(component: Component, credit: Credit | any, isEncours?: boolean): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.credit = credit;
    modalRef.result.then(
      result => {
        if (isEncours) {
          this.router.navigateByUrl('/entity/credit/penalite-print-sheet');
        } else
          this.router.navigateByUrl('/entity/credit/operation/deblocage');
        this.isOpen = false;
      },
      reason => {
        if (isEncours) {
          this.router.navigateByUrl('/entity/credit/credit-en-cours');
        } else
          this.router.navigateByUrl('/entity/credit/operation/deblocage');
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
