import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Dossier } from './dossier.model';
import { DossierService } from './dossier.service';
import { comityMber } from '../entity.module';

@Injectable()
export class DossierPopupService {
  params: { [key: string]: any };
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private dossierService: DossierService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen || !this.params['comity']) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.dossierService.find(id).subscribe(dossier => {
        if (dossier.createdDate) {
          dossier.createdDate = {
            year: dossier.createdDate.getFullYear(),
            month: dossier.createdDate.getMonth() + 1,
            day: dossier.createdDate.getDate()
          };
        }
        if (dossier.lastModifiedDate) {
          dossier.lastModifiedDate = {
            year: dossier.lastModifiedDate.getFullYear(),
            month: dossier.lastModifiedDate.getMonth() + 1,
            day: dossier.lastModifiedDate.getDate()
          };
        }
        this.dossierModalRef(component, dossier);
      });
    } else {
      let dossier = new Dossier();
      dossier.creditComityId = +this.params['comity'];
      return this.dossierModalRef(component, dossier);
    }
  }

  dossierModalRef(component: Component, dossier: Dossier): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.dossier = dossier;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'credit-comity', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: {
              comity: this.params['comity']
            }
          }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'credit-comity', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: {
              comity: this.params['comity']
            }
          }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
