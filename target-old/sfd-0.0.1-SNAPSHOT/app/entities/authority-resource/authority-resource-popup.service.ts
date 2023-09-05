import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthorityResource } from './authority-resource.model';
import { AuthorityResourceService } from './authority-resource.service';

@Injectable()
export class AuthorityResourcePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private authorityResourceService: AuthorityResourceService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.authorityResourceService.find(id).subscribe((authorityResource) => {
                this.authorityResourceModalRef(component, authorityResource);
            });
        } else {
            return this.authorityResourceModalRef(component, new AuthorityResource());
        }
    }

    authorityResourceModalRef(component: Component, authorityResource: AuthorityResource): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.authorityResource = authorityResource;
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
