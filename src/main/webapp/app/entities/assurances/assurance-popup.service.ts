import { Injectable, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Principal } from '../../shared/auth/principal.service';
import { AssuranceService } from './assurance.service';
import { Assurance } from './assurance.model';

@Injectable()
export class AssurancePopupService {
    params: { [key: string]: any };
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private addressService: AssuranceService,
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
            // this.addressService.find(id).subscribe(address => {
            //     if (address.createdDate) {
            //         address.createdDate = {
            //             year: address.createdDate.getFullYear(),
            //             month: address.createdDate.getMonth() + 1,
            //             day: address.createdDate.getDate()
            //         };
            //     }
            //     if (address.lastModifiedDate) {
            //         address.lastModifiedDate = {
            //             year: address.lastModifiedDate.getFullYear(),
            //             month: address.lastModifiedDate.getMonth() + 1,
            //             day: address.lastModifiedDate.getDate()
            //         };
            //     }
            //     this.addressModalRef(component, address);
            // });
        } else {
            let address = new Assurance();
            address.clientId = +this.params['client'];
            return this.addressModalRef(component, address);
        }
    }

    addressModalRef(component: Component, address: Assurance): NgbModalRef {
        const modalRef = this.modalService.open(component, {
            keyboard: false,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.address = address;
        modalRef.result.then(
            result => {
                this.router.navigate(
                    ['/entity', 'assurance', { outlets: { popup: null } }],
                    {
                        replaceUrl: true,
                        queryParams: { client: this.params['client'] }
                    }
                );
                this.isOpen = false;
            },
            reason => {
                this.router.navigate(
                    ['/entity', 'assurance', { outlets: { popup: null } }],
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
