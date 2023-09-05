import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Contrat } from './contrat.model';
import { ContratService } from './contrat.service';

@Injectable()
export class ContratPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private contratService: ContratService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.contratService.find(id).subscribe(contrat => {
        if (contrat.contratDate) {
          contrat.contratDate = {
            year: contrat.contratDate.getFullYear(),
            month: contrat.contratDate.getMonth() + 1,
            day: contrat.contratDate.getDate()
          };
        }
        if (contrat.clotureDate) {
          contrat.clotureDate = {
            year: contrat.clotureDate.getFullYear(),
            month: contrat.clotureDate.getMonth() + 1,
            day: contrat.clotureDate.getDate()
          };
        }
        if (contrat.createdDate) {
          contrat.createdDate = {
            year: contrat.createdDate.getFullYear(),
            month: contrat.createdDate.getMonth() + 1,
            day: contrat.createdDate.getDate()
          };
        }
        if (contrat.lastModifiedDate) {
          contrat.lastModifiedDate = {
            year: contrat.lastModifiedDate.getFullYear(),
            month: contrat.lastModifiedDate.getMonth() + 1,
            day: contrat.lastModifiedDate.getDate()
          };
        }
        this.contratModalRef(component, contrat);
      });
    } else {
      return this.contratModalRef(component, new Contrat());
    }
  }

  contratModalRef(component: Component, contrat: Contrat): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.contrat = contrat;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'contrat', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'contrat', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
