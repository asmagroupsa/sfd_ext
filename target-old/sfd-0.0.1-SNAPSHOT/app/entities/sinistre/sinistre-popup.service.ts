import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Principal } from '../../shared/auth/principal.service';
import { SinistreService } from './sinistre.service';
import { Sinistre } from './sinistre';

@Injectable()
export class SinistrePopupService {
  params: { [key: string]: any };
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private sinistreService: SinistreService,
    public principal: Principal
  ) {
    ActivatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen || !this.params['sinistre']) {
      return;
    }
    // || !this.params['client']
    this.isOpen = true;

    if (id) {
      this.sinistreService.find(id).subscribe(sinistre => {
        if (sinistre.createdDate) {
            sinistre.createdDate = {
            year: sinistre.createdDate.getFullYear(),
            month: sinistre.createdDate.getMonth() + 1,
            day: sinistre.createdDate.getDate()
          };
        }
        // if (address.lastModifiedDate) {
        //   address.lastModifiedDate = {
        //     year: address.lastModifiedDate.getFullYear(),
        //     month: address.lastModifiedDate.getMonth() + 1,
        //     day: address.lastModifiedDate.getDate()
        //   };
        // }
        this.addressModalRef(component, sinistre);
      });
    } else {
      let sinistre = new Sinistre();
      sinistre.id = +this.params['sinistre'];
      return this.addressModalRef(component, sinistre);
    //   if (this.principal.store['coords']) {
    //     let address = new Address();
    //     //address.geoLat = this.principal.store['coords'].coords.latitude;
    //     //address.geoLong = this.principal.store['coords'].coords.longitude;
    //     return this.addressModalRef(component, address);
    //   } else {
    //     navigator.geolocation.getCurrentPosition(position => {
    //       this.principal.store['coords'] = position;
    //       let address = new Address();
    //       //address.geoLat = position.coords.latitude;
    //       //address.geoLong = position.coords.longitude;
    //       return this.addressModalRef(component, address);
    //     });
    //   }
    }
  }

  addressModalRef(component: Component, sinisre: Sinistre): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.sinistre = sinisre;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'sinistre', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: { client: this.params['sinistre'] }
          }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'sinistre', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: {
              client: this.params['sinistre']
            }
          }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
