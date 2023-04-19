import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SituationMat } from './situation-mat.model';
import { SituationMatService } from './situation-mat.service';

@Injectable()
export class SituationMatPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private situationMatService: SituationMatService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.situationMatService.find(id).subscribe(situationMat => {
        this.situationMatModalRef(component, situationMat);
      });
    } else {
      return this.situationMatModalRef(component, new SituationMat());
    }
  }

  situationMatModalRef(
    component: Component,
    situationMat: SituationMat
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.situationMat = situationMat;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'situation-mat', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'situation-mat', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
