import { Injectable, Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EcheancesClient } from "./echeances-client.model";
import { EcheancesClientService } from "./echeances-client.service";

@Injectable()
export class EcheancesClientPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private echeancesClientService: EcheancesClientService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.echeancesClientService.find(id).subscribe(echeancesClient => {
        if (echeancesClient.echeanceDate) {
          echeancesClient.echeanceDate = {
            year: echeancesClient.echeanceDate.getFullYear(),
            month: echeancesClient.echeanceDate.getMonth() + 1,
            day: echeancesClient.echeanceDate.getDate()
          };
        }
        if (echeancesClient.createdDate) {
          echeancesClient.createdDate = {
            year: echeancesClient.createdDate.getFullYear(),
            month: echeancesClient.createdDate.getMonth() + 1,
            day: echeancesClient.createdDate.getDate()
          };
        }
        if (echeancesClient.lastModifiedDate) {
          echeancesClient.lastModifiedDate = {
            year: echeancesClient.lastModifiedDate.getFullYear(),
            month: echeancesClient.lastModifiedDate.getMonth() + 1,
            day: echeancesClient.lastModifiedDate.getDate()
          };
        }
        this.echeancesClientModalRef(component, echeancesClient);
      });
    } else {
      return this.echeancesClientModalRef(component, new EcheancesClient());
    }
  }

  echeancesClientModalRef(
    component: Component,
    echeancesClient: EcheancesClient
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.echeancesClient = echeancesClient;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ["/entity", "echeances-client", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ["/entity", "echeances-client", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
