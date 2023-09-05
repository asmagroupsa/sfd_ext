import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Matiere } from './matiere.model';
import { MatiereService } from './matiere.service';

@Injectable()
export class MatierePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private matiereService: MatiereService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.matiereService.find(id).subscribe(matiere => {
        this.matiereModalRef(component, matiere);
      });
    } else {
      return this.matiereModalRef(component, new Matiere());
    }
  }

  matiereModalRef(component: Component, matiere: Matiere): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.matiere = matiere;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'matiere', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'matiere', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
