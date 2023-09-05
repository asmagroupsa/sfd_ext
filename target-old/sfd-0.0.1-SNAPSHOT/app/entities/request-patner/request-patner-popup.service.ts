import { Injectable, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { RequestPartner } from "./request-patner.model";
import { RequestPartnerService } from "./request-patner.service";

@Injectable()
export class RequestPartnerPopupService {
  params: any;
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private produitService: RequestPartnerService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.produitService.find(id).subscribe(produit => {
        /*if (produit.createdDate) {
          produit.createdDate = {
            year: produit.createdDate.getFullYear(),
            month: produit.createdDate.getMonth() + 1,
            day: produit.createdDate.getDate()
          };
        }*/
        this.requestPatnerModalRef(component, produit);
      });
    } else {
      return this.requestPatnerModalRef(component, new RequestPartner());
    }
  }

  requestPatnerModalRef(component: Component, requestPartner: RequestPartner): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.requestPartner = requestPartner;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ["/entity", "request-partner", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ["/entity", "request-partner", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
