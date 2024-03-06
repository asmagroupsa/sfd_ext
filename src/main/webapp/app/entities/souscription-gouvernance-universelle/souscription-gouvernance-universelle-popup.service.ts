import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SouscriptionGouvernanceUniverselle } from './souscription-gouvernance-universelle.model';
import { SouscriptionGouvernanceUniverselleService } from './souscription-gouvernance-universelle.service';

@Injectable()
export class SouscriptionGouvernanceUniversellePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private souscriptionGouvernanceUniverselleService: SouscriptionGouvernanceUniverselleService
    ) { }

    open(component: Component | any, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.souscriptionGouvernanceUniverselleService.find(id).subscribe(souscriptionGouvernanceUniverselle => {
                if (souscriptionGouvernanceUniverselle.createdDate) {
                    souscriptionGouvernanceUniverselle.createdDate = {
                        year: souscriptionGouvernanceUniverselle.createdDate.getFullYear(),
                        month: souscriptionGouvernanceUniverselle.createdDate.getMonth() + 1,
                        day: souscriptionGouvernanceUniverselle.createdDate.getDate()
                    };
                }
                if (souscriptionGouvernanceUniverselle.lastModifiedDate) {
                    souscriptionGouvernanceUniverselle.lastModifiedDate = {
                        year: souscriptionGouvernanceUniverselle.lastModifiedDate.getFullYear(),
                        month: souscriptionGouvernanceUniverselle.lastModifiedDate.getMonth() + 1,
                        day: souscriptionGouvernanceUniverselle.lastModifiedDate.getDate()
                    };
                }
                this.SouscriptionGouvernanceUniverselleModalRef(component, souscriptionGouvernanceUniverselle);
            });
        } else {
            return this.SouscriptionGouvernanceUniverselleModalRef(component, new SouscriptionGouvernanceUniverselle());
        }
    }

    SouscriptionGouvernanceUniverselleModalRef(component: Component, souscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle): NgbModalRef {
        const modalRef = this.modalService.open(component, {
            size: 'lg', keyboard: false,
            backdrop: 'static'
        });
        modalRef.componentInstance.souscriptionGouvernanceUniverselle = souscriptionGouvernanceUniverselle;
        modalRef.result.then(
            result => {
                this.router.navigate(['/entity', 'souscription-gouvernance-universelle', { outlets: { popup: null } }], {
                    replaceUrl: true
                });
                this.isOpen = false;
            },
            reason => {
                this.router.navigate(['/entity', 'souscription-gouvernance-universelle', { outlets: { popup: null } }], {
                    replaceUrl: true
                });
                this.isOpen = false;
            }
        );
        return modalRef;
    }
}
