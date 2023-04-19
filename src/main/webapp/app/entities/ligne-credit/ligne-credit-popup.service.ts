import { Injectable, Component } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LigneCredit } from './ligne-credit.model';
import { LigneCreditService } from './ligne-credit.service';

@Injectable()
export class LigneCreditPopupService {
  links: string[];
  params: { [key: string]: any };
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ligneCreditService: LigneCreditService
  ) {
    activatedRoute.queryParams.subscribe(params => {
      this.params = params;
      if (this.params['bailleur']) {
        this.links = ['/entity', 'partner'];
      } else {
        this.links = ['/entity', 'ligne-credit'];
      }
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.ligneCreditService.find(id).subscribe(ligneCredit => {
        if (ligneCredit.createdDate) {
          ligneCredit.createdDate = {
            year: ligneCredit.createdDate.getFullYear(),
            month: ligneCredit.createdDate.getMonth() + 1,
            day: ligneCredit.createdDate.getDate()
          };
        }
        if (ligneCredit.lastModifiedDate) {
          ligneCredit.lastModifiedDate = {
            year: ligneCredit.lastModifiedDate.getFullYear(),
            month: ligneCredit.lastModifiedDate.getMonth() + 1,
            day: ligneCredit.lastModifiedDate.getDate()
          };
        }
        this.ligneCreditModalRef(component, ligneCredit);
      });
    } else {
      let ligneCredit = new LigneCredit();
      if (this.params['bailleur'] || this.params['id'])
        ligneCredit.partnerId = +this.params['bailleur'] || +this.params['id'];
      return this.ligneCreditModalRef(component, ligneCredit);
    }
  }

  ligneCreditModalRef(
    component: Component,
    ligneCredit: LigneCredit
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    let extras = { replaceUrl: true };
    if (this.params['id']) {
      extras['queryParams'] = { bailleur: this.params['id'] };
    }
    modalRef.componentInstance.ligneCredit = ligneCredit;
    modalRef.result.then(
      result => {
        this.router.navigate(
          [...this.links, { outlets: { popup: null } }],
          extras
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          [...this.links, { outlets: { popup: null } }],
          extras
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
