import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Client } from './client.model';
import { ClientService } from './client.service';

@Injectable()
export class ClientPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private clientService: ClientService
    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.clientService.find(id).subscribe(client => {
                if (client.birthDate) {
                    client.birthDate = {
                        year: client.birthDate.getFullYear(),
                        month: client.birthDate.getMonth() + 1,
                        day: client.birthDate.getDate()
                    };
                }
                if (client.createdDate) {
                    client.createdDate = {
                        year: client.createdDate.getFullYear(),
                        month: client.createdDate.getMonth() + 1,
                        day: client.createdDate.getDate()
                    };
                }
                if (client.lastModifiedDate) {
                    client.lastModifiedDate = {
                        year: client.lastModifiedDate.getFullYear(),
                        month: client.lastModifiedDate.getMonth() + 1,
                        day: client.lastModifiedDate.getDate()
                    };
                }
                this.clientModalRef(component, client);
            });
        } else {
            const client: Client = new Client();
            client.countryId = 1;

            return this.clientModalRef(component, client);
        }
    }

    clientModalRef(component: Component, client: Client): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.client = client;
        modalRef.result.then(
            result => {
                this.router.navigate(
                    ['/entity', 'client', { outlets: { popup: null } }],
                    { replaceUrl: true }
                );
                this.isOpen = false;
            },
            reason => {
                this.router.navigate(
                    ['/entity', 'client', { outlets: { popup: null } }],
                    { replaceUrl: true }
                );
                this.isOpen = false;
            }
        );
        return modalRef;
    }
}
