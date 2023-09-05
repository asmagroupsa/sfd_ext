import { FisrtConnectionComponent } from './first-connection.component';
import { Injectable } from '@angular/core';
import { EventBus } from '../model/functions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {  LoginService } from '..';
@Injectable()
export class FirstConnectionModalService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private loginService: LoginService,
        private router: Router
    ) { }

    open(): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(FisrtConnectionComponent, { keyboard: false, size: 'lg' });

        modalRef.result.then((result) => {
            this.logout();
            this.isOpen = false;
        }, (reason) => {
            this.logout();
            this.isOpen = false;
        });
        return modalRef;
    }
    logout(state: boolean = false) {
        this.loginService
            .logout(state)
            .then(() => {
                window.localStorage.removeItem('userTime');
                EventBus.publish('ressources', {});
                this.router.navigate(['']);
            })
            .catch(e => {
                //
            });
    }
}
