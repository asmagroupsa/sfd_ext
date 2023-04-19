import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SettingSFD } from './setting-sfd.model';
import { SettingSFDService } from './setting-sfd.service';

@Injectable()
export class SettingSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private settingSFDService: SettingSFDService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.settingSFDService.find(id).subscribe(settingSFD => {
        this.settingSFDModalRef(component, settingSFD);
      });
    } else {
      return this.settingSFDModalRef(component, new SettingSFD());
    }
  }

  settingSFDModalRef(
    component: Component,
    settingSFD: SettingSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.settingSFD = settingSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'setting-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'setting-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
