import { Injectable, Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CreditRequest } from "./credit-request.model";
import { CreditRequestService } from "./credit-request.service";
import { UserData } from '../../shared';

@Injectable()
export class CreditRequestPopupService {
  links: string[];
  private isOpen = false;
  queries: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private creditRequestService: CreditRequestService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.queries = queryParams;
      if (queryParams.hasOwnProperty("client")) {
        this.links = ["/entity", "client"];
      } else if (queryParams.hasOwnProperty("produit")) {
        this.links = ["/entity", "credit-request"];
      } else {
        this.links = ["/entity", "credit-request"];
      }
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.creditRequestService.find(id).subscribe(creditRequest => {
        if (creditRequest.requestDate) {
          creditRequest.requestDate = {
            year: creditRequest.requestDate.getFullYear(),
            month: creditRequest.requestDate.getMonth() + 1,
            day: creditRequest.requestDate.getDate()
          };
        }
        if (creditRequest.createdDate) {
          creditRequest.createdDate = {
            year: creditRequest.createdDate.getFullYear(),
            month: creditRequest.createdDate.getMonth() + 1,
            day: creditRequest.createdDate.getDate()
          };
        }
        if (creditRequest.lastModifiedDate) {
          creditRequest.lastModifiedDate = {
            year: creditRequest.lastModifiedDate.getFullYear(),
            month: creditRequest.lastModifiedDate.getMonth() + 1,
            day: creditRequest.lastModifiedDate.getDate()
          };
        }
        this.creditRequestModalRef(component, creditRequest);
      });
    } else {
      return this.creditRequestModalRef(component, new CreditRequest());
    }
  }


  creditRequestModalRef(
    component: Component,
    creditRequest: CreditRequest
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.creditRequest = creditRequest;
    let extras: any = {
      replaceUrl: true
    };
    if (this.queries.hasOwnProperty("client"))
      extras.queryParams = { client: this.queries.client };
    else if (this.queries.hasOwnProperty("produit"))
      extras.queryParams = { produit: this.queries.produit };
    modalRef.result.then(
      result => {
        this.router.navigate(
          [...this.links, { outlets: { popup: null } }],
          extras
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          [...this.links, { outlets: { popup: null } }],
          extras
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
