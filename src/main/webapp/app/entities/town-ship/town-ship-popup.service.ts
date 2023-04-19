import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TownShip } from './town-ship.model';
import { TownShipService } from './town-ship.service';

@Injectable()
export class TownShipPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private townShipService: TownShipService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.townShipService.find(id).subscribe(townShip => {
        this.townShipModalRef(component, townShip);
      });
    } else {
      return this.townShipModalRef(component, new TownShip());
    }
  }

  townShipModalRef(component: Component, townShip: TownShip): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.townShip = townShip;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'town-ship', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'town-ship', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
