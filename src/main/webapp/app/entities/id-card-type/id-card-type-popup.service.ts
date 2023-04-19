import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IdCardType } from './id-card-type.model';
import { IdCardTypeService } from './id-card-type.service';

@Injectable()
export class IdCardTypePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private idCardTypeService: IdCardTypeService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.idCardTypeService.find(id).subscribe(idCardType => {
        this.idCardTypeModalRef(component, idCardType);
      });
    } else {
      return this.idCardTypeModalRef(component, new IdCardType());
    }
  }

  idCardTypeModalRef(
    component: Component,
    idCardType: IdCardType
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.idCardType = idCardType;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'id-card-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'id-card-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
