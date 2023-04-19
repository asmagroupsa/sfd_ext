
import { EventBus } from '../model/functions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JhiLoginModalComponent } from './login.component';
import { Injectable } from '@angular/core';
@Injectable()
export class LoginModalService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
    ) { }

    open(): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(JhiLoginModalComponent, {
            keyboard: false,
            container: 'nav'
        });
        modalRef.result.then((result) => {
            this.isOpen = false;
        }, (reason) => {
            this.isOpen = false;
        });
        return modalRef;
    }
}
