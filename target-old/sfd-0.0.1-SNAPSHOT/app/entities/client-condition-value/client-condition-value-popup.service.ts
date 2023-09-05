import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientConditionValue } from './client-condition-value.model';
import { ClientConditionValueService } from './client-condition-value.service';

@Injectable()
export class ClientConditionValuePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private clientConditionValueService: ClientConditionValueService

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
                this.clientConditionValueService.find(id).subscribe((clientConditionValue) => {
                    this.ngbModalRef = this.clientConditionValueModalRef(component, clientConditionValue);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.clientConditionValueModalRef(component, new ClientConditionValue());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    clientConditionValueModalRef(component: Component, clientConditionValue: ClientConditionValue): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard: false, size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.clientConditionValue = clientConditionValue;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity', 'client-condition-value', { outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity', 'client-condition-value', { outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
