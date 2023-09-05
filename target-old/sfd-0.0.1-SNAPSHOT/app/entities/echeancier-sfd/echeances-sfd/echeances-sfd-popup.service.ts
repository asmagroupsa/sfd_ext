import { Injectable, Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EcheancesSFD } from "./echeances-sfd.model";
import { EcheancesSFDService } from "./echeances-sfd.service";

@Injectable()
export class EcheancesSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private echeancesSFDService: EcheancesSFDService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.echeancesSFDService.find(id).subscribe(echeancesSFD => {
        if (echeancesSFD.echeanceDate) {
          echeancesSFD.echeanceDate = {
            year: echeancesSFD.echeanceDate.getFullYear(),
            month: echeancesSFD.echeanceDate.getMonth() + 1,
            day: echeancesSFD.echeanceDate.getDate()
          };
        }
        if (echeancesSFD.createdDate) {
          echeancesSFD.createdDate = {
            year: echeancesSFD.createdDate.getFullYear(),
            month: echeancesSFD.createdDate.getMonth() + 1,
            day: echeancesSFD.createdDate.getDate()
          };
        }
        if (echeancesSFD.lastModifiedDate) {
          echeancesSFD.lastModifiedDate = {
            year: echeancesSFD.lastModifiedDate.getFullYear(),
            month: echeancesSFD.lastModifiedDate.getMonth() + 1,
            day: echeancesSFD.lastModifiedDate.getDate()
          };
        }
        this.echeancesSFDModalRef(component, echeancesSFD);
      });
    } else {
      return this.echeancesSFDModalRef(component, new EcheancesSFD());
    }
  }

  echeancesSFDModalRef(
    component: Component,
    echeancesSFD: EcheancesSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.echeancesSFD = echeancesSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ["/entity", "echeances-sfd", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ["/entity", "echeances-sfd", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
