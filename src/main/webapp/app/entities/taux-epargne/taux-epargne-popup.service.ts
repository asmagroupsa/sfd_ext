import { Injectable, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TauxEpargne } from "./taux-epargne.model";
import { TauxEpargneService } from "./taux-epargne.service";

@Injectable()
export class TauxEpargnePopupService {
  links: string[];
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tauxEpargneService: TauxEpargneService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(params => {
      if (params.produit) this.links = ["/entity", "produit"];
      else this.links = ["/entity", "taux-epargne"];
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.tauxEpargneService.find(id).subscribe(tauxEpargne => {
        this.tauxEpargneModalRef(component, tauxEpargne);
      });
    } else {
      return this.tauxEpargneModalRef(component, new TauxEpargne());
    }
  }

  tauxEpargneModalRef(
    component: Component,
    tauxEpargne: TauxEpargne
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.tauxEpargne = tauxEpargne;
    modalRef.result.then(
      result => {
        this.router.navigate([...this.links, { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      },
      reason => {
        this.router.navigate([...this.links, { outlets: { popup: null } }], {
          replaceUrl: true
        });
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
