import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Etude } from './etude.model';
import { EtudeService } from './etude.service';
import { Principal } from '../../shared/auth/principal.service';

@Injectable()
export class EtudePopupService {
  private isOpen = false;
  fragment: string = '';
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private etudeService: EtudeService,
    public principal: Principal,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.etudeService.find(id).subscribe(etude => {
        if (etude.visitDate) {
          etude.visitDate = {
            year: etude.visitDate.getFullYear(),
            month: etude.visitDate.getMonth() + 1,
            day: etude.visitDate.getDate()
          };
        }
        if (etude.etudeDate) {
          etude.etudeDate = {
            year: etude.etudeDate.getFullYear(),
            month: etude.etudeDate.getMonth() + 1,
            day: etude.etudeDate.getDate()
          };
        }
        if (etude.createdDate) {
          etude.createdDate = {
            year: etude.createdDate.getFullYear(),
            month: etude.createdDate.getMonth() + 1,
            day: etude.createdDate.getDate()
          };
        }
        if (etude.lastModifiedDate) {
          etude.lastModifiedDate = {
            year: etude.lastModifiedDate.getFullYear(),
            month: etude.lastModifiedDate.getMonth() + 1,
            day: etude.lastModifiedDate.getDate()
          };
        }
        this.etudeModalRef(component, etude);
      });
    } else {
      let etude = new Etude();
      return this.etudeModalRef(component, etude);
    }
  }

  etudeModalRef(component: Component, etude: Etude): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.etude = etude;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'etude', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'etude', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
