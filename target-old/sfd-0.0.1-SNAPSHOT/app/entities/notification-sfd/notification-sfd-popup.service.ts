import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationSFD } from './notification-sfd.model';
import { NotificationSFDService } from './notification-sfd.service';

@Injectable()
export class NotificationSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private notificationSFDService: NotificationSFDService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.notificationSFDService.find(id).subscribe(notificationSFD => {
        if (notificationSFD.notificationDate) {
          notificationSFD.notificationDate = {
            year: notificationSFD.notificationDate.getFullYear(),
            month: notificationSFD.notificationDate.getMonth() + 1,
            day: notificationSFD.notificationDate.getDate()
          };
        }
        if (notificationSFD.createdDate) {
          notificationSFD.createdDate = {
            year: notificationSFD.createdDate.getFullYear(),
            month: notificationSFD.createdDate.getMonth() + 1,
            day: notificationSFD.createdDate.getDate()
          };
        }
        if (notificationSFD.lastModifiedDate) {
          notificationSFD.lastModifiedDate = {
            year: notificationSFD.lastModifiedDate.getFullYear(),
            month: notificationSFD.lastModifiedDate.getMonth() + 1,
            day: notificationSFD.lastModifiedDate.getDate()
          };
        }
        this.notificationSFDModalRef(component, notificationSFD);
      });
    } else {
      return this.notificationSFDModalRef(component, new NotificationSFD());
    }
  }

  notificationSFDModalRef(
    component: Component,
    notificationSFD: NotificationSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.notificationSFD = notificationSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'notification-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'notification-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
