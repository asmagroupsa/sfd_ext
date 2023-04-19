import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ZoneDepartement } from './zone-departement.model';
import { ZoneDepartementService } from './zone-departement.service';

@Injectable()
export class ZoneDepartementPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private zoneDepartementService: ZoneDepartementService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.zoneDepartementService.find(id).subscribe((zoneDepartement) => {
                    this.ngbModalRef = this.zoneDepartementModalRef(component, zoneDepartement);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.zoneDepartementModalRef(component, new ZoneDepartement());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    zoneDepartementModalRef(component: Component, zoneDepartement: ZoneDepartement): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard: false, size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.zoneDepartement = zoneDepartement;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
