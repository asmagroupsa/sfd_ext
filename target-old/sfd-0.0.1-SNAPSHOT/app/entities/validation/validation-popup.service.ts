import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Validation } from './validation.model';
import { ValidationService } from './validation.service';

@Injectable()
export class ValidationPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private validationService: ValidationService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.validationService.find(id).subscribe((validation) => {
                if (validation.createdDate) {
                    validation.createdDate = {
                        year: validation.createdDate.getFullYear(),
                        month: validation.createdDate.getMonth() + 1,
                        day: validation.createdDate.getDate()
                    };
                }
                if (validation.lastModifiedDate) {
                    validation.lastModifiedDate = {
                        year: validation.lastModifiedDate.getFullYear(),
                        month: validation.lastModifiedDate.getMonth() + 1,
                        day: validation.lastModifiedDate.getDate()
                    };
                }
                this.validationModalRef(component, validation);
            });
        } else {
            return this.validationModalRef(component, new Validation());
        }
    }

    validationModalRef(component: Component, validation: Validation): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.validation = validation;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity','validation',{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate(
              [
                '/entity',
                'validation',
                { outlets: { popup: null } }
              ],
              { replaceUrl: true }
            );
            this.isOpen = false;
        });
        return modalRef;
    }
}
