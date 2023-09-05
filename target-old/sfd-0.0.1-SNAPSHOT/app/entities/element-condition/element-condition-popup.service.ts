import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ElementCondition } from './element-condition.model';
import { ElementConditionService } from './element-condition.service';

@Injectable()
export class ElementConditionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private elementConditionService: ElementConditionService

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
                this.elementConditionService.find(id).subscribe((elementCondition) => {
                    this.ngbModalRef = this.elementConditionModalRef(component, elementCondition);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.elementConditionModalRef(component, new ElementCondition());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    elementConditionModalRef(component: Component, elementCondition: ElementCondition): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.elementCondition = elementCondition;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity','element-condition',{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity','element-condition',{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
