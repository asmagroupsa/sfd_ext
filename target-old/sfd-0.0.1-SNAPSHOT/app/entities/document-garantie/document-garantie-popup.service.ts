import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentGarantie } from './document-garantie.model';
import { DocumentGarantieService } from './document-garantie.service';

@Injectable()
export class DocumentGarantiePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private documentGarantieService: DocumentGarantieService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.documentGarantieService.find(id).subscribe(documentGarantie => {
        if (documentGarantie.createdDate) {
          documentGarantie.createdDate = {
            year: documentGarantie.createdDate.getFullYear(),
            month: documentGarantie.createdDate.getMonth() + 1,
            day: documentGarantie.createdDate.getDate()
          };
        }
        if (documentGarantie.lastModifiedDate) {
          documentGarantie.lastModifiedDate = {
            year: documentGarantie.lastModifiedDate.getFullYear(),
            month: documentGarantie.lastModifiedDate.getMonth() + 1,
            day: documentGarantie.lastModifiedDate.getDate()
          };
        }
        this.documentGarantieModalRef(component, documentGarantie);
      });
    } else {
      return this.documentGarantieModalRef(component, new DocumentGarantie());
    }
  }

  documentGarantieModalRef(
    component: Component,
    documentGarantie: DocumentGarantie
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.documentGarantie = documentGarantie;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'document-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'document-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
