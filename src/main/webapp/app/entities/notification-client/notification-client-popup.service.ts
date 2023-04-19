import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationClient } from './notification-client.model';
import { NotificationClientService } from './notification-client.service';

@Injectable()
export class NotificationClientPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private notificationClientService: NotificationClientService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.notificationClientService.find(id).subscribe(notificationClient => {
        if (notificationClient.notificationDate) {
          notificationClient.notificationDate = {
            year: notificationClient.notificationDate.getFullYear(),
            month: notificationClient.notificationDate.getMonth() + 1,
            day: notificationClient.notificationDate.getDate()
          };
        }
        if (notificationClient.createdDate) {
          notificationClient.createdDate = {
            year: notificationClient.createdDate.getFullYear(),
            month: notificationClient.createdDate.getMonth() + 1,
            day: notificationClient.createdDate.getDate()
          };
        }
        if (notificationClient.lastModifiedDate) {
          notificationClient.lastModifiedDate = {
            year: notificationClient.lastModifiedDate.getFullYear(),
            month: notificationClient.lastModifiedDate.getMonth() + 1,
            day: notificationClient.lastModifiedDate.getDate()
          };
        }
        this.notificationClientModalRef(component, notificationClient);
      });
    } else {
      return this.notificationClientModalRef(
        component,
        new NotificationClient()
      );
    }
  }

  notificationClientModalRef(
    component: Component,
    notificationClient: NotificationClient
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.notificationClient = notificationClient;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'notification-client', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'notification-client', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
