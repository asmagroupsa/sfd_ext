import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientConditionNote } from './client-condition-note.model';
import { ClientConditionNoteService } from './client-condition-note.service';

@Injectable()
export class ClientConditionNotePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private clientConditionNoteService: ClientConditionNoteService

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
                this.clientConditionNoteService.find(id).subscribe((clientConditionNote) => {
                    this.ngbModalRef = this.clientConditionNoteModalRef(component, clientConditionNote);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.clientConditionNoteModalRef(component, new ClientConditionNote());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    clientConditionNoteModalRef(component: Component, clientConditionNote: ClientConditionNote): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.clientConditionNote = clientConditionNote;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity','client-condition-note',{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity','client-condition-note',{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
