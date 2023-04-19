import { Injectable, Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Affectation } from './affectation.model';

@Injectable()
export class AffectationPopupService {
  private isOpen = false;
  private params:any = {};
  constructor(
    private modalService: NgbModal,
    private router: Router,
    public activatedRoute:ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe((params) => {
      this.params = Object.assign({},params);
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
      return this.affectationModalRef(component, new Affectation());
  }

  affectationModalRef(component: Component, affectation: Affectation): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.affectation = affectation;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'affectation', { outlets: { popup: null } }],
          { replaceUrl: true,queryParams:{...this.params} }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'affectation', { outlets: { popup: null } }],
          { replaceUrl: true,
          queryParams:{...this.params}
           }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
