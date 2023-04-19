import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomUser } from './custom-user.model';
import { CustomUserService } from './custom-user.service';

@Injectable()
export class CustomUserPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private customUserService: CustomUserService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.customUserService.find(id).subscribe((customUser) => {
                this.customUserModalRef(component, customUser);
            });
        } else {
            return this.customUserModalRef(component, new CustomUser());
        }
    }

    customUserModalRef(component: Component, customUser: CustomUser): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.customUser = customUser;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
