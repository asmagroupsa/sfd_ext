import { Injectable, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Produit } from "./produit.model";
import { ProduitService } from "./produit.service";

@Injectable()
export class ProduitPopupService {
  params: any;
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private produitService: ProduitService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.produitService.find(id).subscribe(produit => {
        if (produit.createdDate) {
          produit.createdDate = {
            year: produit.createdDate.getFullYear(),
            month: produit.createdDate.getMonth() + 1,
            day: produit.createdDate.getDate()
          };
        }
        if (produit.lastModifiedDate) {
          produit.lastModifiedDate = {
            year: produit.lastModifiedDate.getFullYear(),
            month: produit.lastModifiedDate.getMonth() + 1,
            day: produit.lastModifiedDate.getDate()
          };
        }
        this.produitModalRef(component, produit);
      });
    } else {
      return this.produitModalRef(component, new Produit());
    }
  }

  produitModalRef(component: Component, produit: Produit): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.produit = produit;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ["/entity", "produit", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ["/entity", "produit", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
