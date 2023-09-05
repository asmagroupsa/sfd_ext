import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategorieCondition } from './categorie-condition.model';
import { CategorieConditionService } from './categorie-condition.service';

@Injectable()
export class CategorieConditionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private categorieConditionService: CategorieConditionService

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
                this.categorieConditionService.find(id).subscribe((categorieCondition) => {
                    this.ngbModalRef = this.categorieConditionModalRef(component, categorieCondition);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.categorieConditionModalRef(component, new CategorieCondition());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    categorieConditionModalRef(component: Component, categorieCondition: CategorieCondition): NgbModalRef {
        const modalRef = this.modalService.open(component, { keyboard:false, size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categorieCondition = categorieCondition;
        modalRef.result.then((result) => {
            this.router.navigate(['/entity','categorie-condition',{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate(['/entity','categorie-condition',{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
