import {Injectable, Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BankAccountClient} from './bank-account-client.model';
import {BankAccountClientService} from './bank-account-client.service';

@Injectable()
export class BankAccountClientPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private bankService: BankAccountClientService

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
                this.bankService.find(id).subscribe((bank) => {
                    this.ngbModalRef = this.bankModalRef(component, bank);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.bankModalRef(component, new BankAccountClient());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    bankModalRef(component: Component, bank: BankAccountClient): NgbModalRef {
        const modalRef = this.modalService.open(component, {keyboard: false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.bankAccountClient = bank;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity', 'bank-account-client', {outlets: {popup: null}}], {replaceUrl: true});
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity', 'bank-account-client', {outlets: {popup: null}}], {replaceUrl: true});
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
