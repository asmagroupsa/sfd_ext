import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankAccount } from './bank-account.model';
import { BankAccountService } from './bank-account.service';

@Injectable()
export class BankAccountPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private bankAccountService: BankAccountService

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
                this.bankAccountService.find(id).subscribe((bankAccount) => {
                    if (bankAccount.date) {
                        bankAccount.date = {
                            year: bankAccount.date.getFullYear(),
                            month: bankAccount.date.getMonth() + 1,
                            day: bankAccount.date.getDate()
                        };
                    }
                    this.ngbModalRef = this.bankAccountModalRef(component, bankAccount);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.bankAccountModalRef(component, new BankAccount());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    bankAccountModalRef(component: Component, bankAccount: BankAccount): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard: false, size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.bankAccount = bankAccount;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity/bank-account', { outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity/bank-account', { outlets: { popup: null } }], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
