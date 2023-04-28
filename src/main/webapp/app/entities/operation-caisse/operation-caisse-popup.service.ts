import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OperationCaisse } from './operation-caisse.model';
import { OperationCaisseService } from './operation-caisse.service';

@Injectable()
export class OperationCaissePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private operationCaisseService: OperationCaisseService
    ) { }

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            console.log('yes id ' + id);
            this.operationCaisseService.find(id).subscribe(operationCaisse => {
                this.operationCaisseModalRef(component, operationCaisse);
            });
        } else {
            console.log('no id');
            let operationCaisse: OperationCaisse = new OperationCaisse();
            operationCaisse = {
                id: 1,
                comptecarmesclient: 'string',
                nomClient: 'string',
                birthDate: 'string',
                telephone: 'string',
                email: 'string',
                montant: 'string',
                sexe: 'string',
                agenceReference: 'string',
                professionId: 'string',
                produitId: 'string',
                typeClientId: 'string',
                motif: 'string',
            }
            console.log(operationCaisse);

            return this.operationCaisseModalRef(component, operationCaisse);
        }
    }

    operationCaisseModalRef(
        component: Component,
        operationCaisse: OperationCaisse
    ): NgbModalRef {
        const modalRef = this.modalService.open(component, {
            keyboard: false,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.OperationCaisse = operationCaisse;
        modalRef.result.then(
            result => {
                this.router.navigate(
                    ['/entity', 'operation-caisse', { outlets: { popup: null } }],
                    { replaceUrl: true }
                );
                this.isOpen = false;
            },
            reason => {
                this.router.navigate(
                    ['/entity', 'operation-caisse', { outlets: { popup: null } }],
                    { replaceUrl: true }
                );
                this.isOpen = false;
            }
        );
        return modalRef;
    }
}
