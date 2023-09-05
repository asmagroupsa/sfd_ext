import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ComityMber } from './comity-menu.model';
import { ComityMberService } from './comity-menu.service';

@Injectable()
export class ComityMberPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private comityMberService: ComityMberService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.comityMberService.find(id).subscribe(comityMber => {
        if (comityMber.nominationDate) {
          comityMber.nominationDate = {
            year: comityMber.nominationDate.getFullYear(),
            month: comityMber.nominationDate.getMonth() + 1,
            day: comityMber.nominationDate.getDate()
          };
        }
        if (comityMber.endNominationDate) {
          comityMber.endNominationDate = {
            year: comityMber.endNominationDate.getFullYear(),
            month: comityMber.endNominationDate.getMonth() + 1,
            day: comityMber.endNominationDate.getDate()
          };
        }
        if (comityMber.createdDate) {
          comityMber.createdDate = {
            year: comityMber.createdDate.getFullYear(),
            month: comityMber.createdDate.getMonth() + 1,
            day: comityMber.createdDate.getDate()
          };
        }
        if (comityMber.lastModifiedDate) {
          comityMber.lastModifiedDate = {
            year: comityMber.lastModifiedDate.getFullYear(),
            month: comityMber.lastModifiedDate.getMonth() + 1,
            day: comityMber.lastModifiedDate.getDate()
          };
        }
        this.comityMberModalRef(component, comityMber);
      });
    } else {
      return this.comityMberModalRef(component, new ComityMber());
    }
  }

  comityMberModalRef(
    component: Component,
    comityMber: ComityMber
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.comityMber = comityMber;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'comity-mber', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'comity-mber', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
