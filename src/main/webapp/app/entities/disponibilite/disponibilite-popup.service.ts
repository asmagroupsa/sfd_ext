import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Disponibilite } from './disponibilite.model';
import { DisponibiliteService } from './disponibilite.service';

@Injectable()
export class DisponibilitePopupService {
  params: { [key: string]: any };
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private disponibiliteService: DisponibiliteService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.disponibiliteService.find(id).subscribe(disponibilite => {
        this.disponibiliteModalRef(component, disponibilite);
      });
    } else {
      return this.disponibiliteModalRef(component, new Disponibilite());
    }
  }

  disponibiliteModalRef(
    component: Component,
    disponibilite: Disponibilite
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.disponibilite = disponibilite;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'disponibilite', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: {
              comite: this.params['comite']
            }
          }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'disponibilite', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: {
              comite: this.params['comite']
            }
          }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
