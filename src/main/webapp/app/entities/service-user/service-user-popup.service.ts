import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ServiceUser } from './service-user.model';
import { ServiceUserService } from './service-user.service';

@Injectable()
export class ServiceUserPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private serviceUserService: ServiceUserService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.serviceUserService.find(id).subscribe(serviceUser => {
        if (serviceUser.createdDate) {
          serviceUser.createdDate = {
            year: serviceUser.createdDate.getFullYear(),
            month: serviceUser.createdDate.getMonth() + 1,
            day: serviceUser.createdDate.getDate()
          };
        }
        if (serviceUser.lastModifiedDate) {
          serviceUser.lastModifiedDate = {
            year: serviceUser.lastModifiedDate.getFullYear(),
            month: serviceUser.lastModifiedDate.getMonth() + 1,
            day: serviceUser.lastModifiedDate.getDate()
          };
        }
        this.serviceUserModalRef(component, serviceUser);
      });
    } else {
      return this.serviceUserModalRef(component, new ServiceUser());
    }
  }

  serviceUserModalRef(
    component: Component,
    serviceUser: ServiceUser
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.serviceUser = serviceUser;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'service-user', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'service-user', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
