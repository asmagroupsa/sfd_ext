import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { User, UserService, ResponseWrapper, Principal, UserData } from '../../shared';

@Injectable()
export class UserModalService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private principal: Principal,
        private userService: UserService
    ) { }

    open(component: Component, login?: string): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (login) {
            this.principal.getAccount().then((account)=>{
                this.userService
                .queryUsers(UserData.getInstance().country_id,'TOUS',account.typeUser,login)
                .subscribe((user: any) => {
                    return this.userModalRef(component, user);
                });
            });
            
        } else {
            return this.userModalRef(component, new User());
        }
    }

    userModalRef(component: Component, user: User): NgbModalRef {
        const modalRef = this.modalService.open(component, {
            keyboard: false,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.user = user;
        modalRef.result.then(
            result => {
                this.router.navigate(['/admin', { outlets: { popup: null } }], {
                    replaceUrl: true
                });
                this.isOpen = false;
            },
            reason => {
                this.router.navigate(['/admin', { outlets: { popup: null } }], {
                    replaceUrl: true
                });
                this.isOpen = false;
            }
        );
        return modalRef;
    }
}
