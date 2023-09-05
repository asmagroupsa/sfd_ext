import { Injectable, Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Formation } from "./formation.model";
import { FormationService } from "./formation.service";

@Injectable()
export class FormationPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private formationService: FormationService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.formationService.find(id).subscribe(formation => {
        if (formation.lastModifiedDate) {
          formation.lastModifiedDate = {
            year: formation.lastModifiedDate.getFullYear(),
            month: formation.lastModifiedDate.getMonth() + 1,
            day: formation.lastModifiedDate.getDate()
          };
        }
        this.formationModalRef(component, formation);
      });
    } else {
      return this.formationModalRef(component, new Formation());
    }
  }

  formationModalRef(component: Component, formation: Formation): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.formation = formation;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ["/entity", "formation", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ["/entity", "formation", { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
