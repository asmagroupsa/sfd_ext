import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Journal } from './journal.model';
import { JournalService } from './journal.service';

@Injectable()
export class JournalPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private journalService: JournalService

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
                this.journalService.find(id).subscribe((journal) => {
                    this.ngbModalRef = this.journalModalRef(component, journal);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.journalModalRef(component, new Journal());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    journalModalRef(component: Component, journal: Journal): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.journal = journal;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity/journal', { outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity/journal', { outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
