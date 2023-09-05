import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Address } from './address.model';
import { AddressService } from './address.service';
import { Principal } from '../../shared/auth/principal.service';

@Injectable()
export class AddressPopupService {
  params: { [key: string]: any };
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private addressService: AddressService,
    public principal: Principal
  ) {
    ActivatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen || !this.params['client']) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.addressService.find(id).subscribe(address => {
        if (address.createdDate) {
          address.createdDate = {
            year: address.createdDate.getFullYear(),
            month: address.createdDate.getMonth() + 1,
            day: address.createdDate.getDate()
          };
        }
        if (address.lastModifiedDate) {
          address.lastModifiedDate = {
            year: address.lastModifiedDate.getFullYear(),
            month: address.lastModifiedDate.getMonth() + 1,
            day: address.lastModifiedDate.getDate()
          };
        }
        this.addressModalRef(component, address);
      });
    } else {
      let address = new Address();
      address.clientId = +this.params['client'];
      return this.addressModalRef(component, address);
      /*  if (this.principal.store['coords']) {
        let address = new Address();
        //address.geoLat = this.principal.store['coords'].coords.latitude;
        //address.geoLong = this.principal.store['coords'].coords.longitude;
        return this.addressModalRef(component, address);
      } else {
        navigator.geolocation.getCurrentPosition(position => {
          this.principal.store['coords'] = position;
          let address = new Address();
          //address.geoLat = position.coords.latitude;
          //address.geoLong = position.coords.longitude;
          return this.addressModalRef(component, address);
        });
      } */
    }
  }

  addressModalRef(component: Component, address: Address): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.address = address;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'address', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: { client: this.params['client'] }
          }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'address', { outlets: { popup: null } }],
          {
            replaceUrl: true,
            queryParams: {
              client: this.params['client']
            }
          }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
