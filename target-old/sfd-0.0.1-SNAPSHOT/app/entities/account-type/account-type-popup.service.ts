import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountType } from './account-type.model';
import { AccountTypeService } from './account-type.service';

@Injectable()
export class AccountTypePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private accountTypeService: AccountTypeService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.accountTypeService.find(id).subscribe(accountType => {
        this.accountTypeModalRef(component, accountType);
      });
    } else {
      return this.accountTypeModalRef(component, new AccountType());
    }
  }

  accountTypeModalRef(
    component: Component,
    accountType: AccountType
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.accountType = accountType;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'account-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'account-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
