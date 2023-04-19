import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SchoolLevel } from './school-level.model';
import { SchoolLevelService } from './school-level.service';

@Injectable()
export class SchoolLevelPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private schoolLevelService: SchoolLevelService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.schoolLevelService.find(id).subscribe(schoolLevel => {
        this.schoolLevelModalRef(component, schoolLevel);
      });
    } else {
      return this.schoolLevelModalRef(component, new SchoolLevel());
    }
  }

  schoolLevelModalRef(
    component: Component,
    schoolLevel: SchoolLevel
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.schoolLevel = schoolLevel;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'school-level', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'school-level', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
