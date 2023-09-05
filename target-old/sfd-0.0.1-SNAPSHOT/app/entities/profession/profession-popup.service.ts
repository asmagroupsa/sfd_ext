import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Profession } from './profession.model';
import { ProfessionService } from './profession.service';

@Injectable()
export class ProfessionPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private professionService: ProfessionService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.professionService.find(id).subscribe(profession => {
        this.professionModalRef(component, profession);
      });
    } else {
      return this.professionModalRef(component, new Profession());
    }
  }

  professionModalRef(
    component: Component,
    profession: Profession
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.profession = profession;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'profession', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'profession', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
