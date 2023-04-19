import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ZoneSfd } from './zone-sfd.model';
import { ZoneSfdService } from './zone-sfd.service';

@Injectable()
export class ZoneSfdPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private zoneSfdService: ZoneSfdService

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
                this.zoneSfdService.find(id).subscribe((zoneSfd) => {
                    this.ngbModalRef = this.zoneSfdModalRef(component, zoneSfd);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.zoneSfdModalRef(component, new ZoneSfd());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    zoneSfdModalRef(component: Component, zoneSfd: ZoneSfd): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.zoneSfd = zoneSfd;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
