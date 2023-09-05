import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Compte } from './compte.model';
import { CompteService } from './compte.service';
import { activateRoute } from '../../account/activate/activate.route';

@Injectable()
export class ComptePopupService {
  links: string[];
  queries: { [key: string]: any };
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private compteService: CompteService,
    private activateRoute: ActivatedRoute
  ) {
    activateRoute.queryParams.subscribe(queryParams => {
      this.queries = queryParams;
      this.links = queryParams.client
        ? ['/entity', 'client']
        : ['/entity', 'compte'];
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.compteService.find(id).subscribe(compte => {
        if (compte.createdDate) {
          compte.createdDate = {
            year: compte.createdDate.getFullYear(),
            month: compte.createdDate.getMonth() + 1,
            day: compte.createdDate.getDate()
          };
        }
        if (compte.lastModifiedDate) {
          compte.lastModifiedDate = {
            year: compte.lastModifiedDate.getFullYear(),
            month: compte.lastModifiedDate.getMonth() + 1,
            day: compte.lastModifiedDate.getDate()
          };
        }
        this.compteModalRef(component, compte);
      });
    } else {
      let compte = new Compte();
      compte.clientId =
        this.queries && this.queries.client ? +this.queries.client : null;
      return this.compteModalRef(component, compte);
    }
  }

  compteModalRef(component: Component, compte: Compte): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.compte = compte;
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
