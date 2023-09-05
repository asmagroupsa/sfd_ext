import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypesContrat } from './types-contrat.model';
import { TypesContratService } from './types-contrat.service';

@Injectable()
export class TypesContratPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private typesContratService: TypesContratService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.typesContratService.find(id).subscribe(typesContrat => {
        // if (typesContrat.createdDate) {
        //   typesContrat.createdDate = {
        //     year: typesContrat.createdDate.getFullYear(),
        //     month: typesContrat.createdDate.getMonth() + 1,
        //     day: typesContrat.createdDate.getDate()
        //   };
        // }
        // if (typesContrat.lastModifiedDate) {
        //   typesContrat.lastModifiedDate = {
        //     year: typesContrat.lastModifiedDate.getFullYear(),
        //     month: typesContrat.lastModifiedDate.getMonth() + 1,
        //     day: typesContrat.lastModifiedDate.getDate()
        //   };
        // }
        this.fraisModalRef(component, typesContrat);
      });
    } else {
      return this.fraisModalRef(component, new TypesContrat());
    }
  }

  fraisModalRef(component: Component, typesContrat: TypesContrat): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.typesContrat = typesContrat;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'typesContrat', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'type-contrat', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
