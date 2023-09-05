import { styles } from '../remboursement-sfd/remboursement-sfd.component.scss.shim.ngstyle';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TypeClient } from './type-client.model';
import { TypeClientService } from './type-client.service';
import { JhiAlertService } from 'ng-jhipster';
import { FraisService } from '../frais-client/frais.service';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
    selector: 'jhi-type-client-detail',
    templateUrl: './type-client-detail.component.html',
    styles: [`
        .frais div.ui.fluid.search.dropdown {
            border: 1px solid #9e9e9e !important;
            border-radius: 5px !important;
            background: #f5f5f5 !important;
        }
    `]
})
export class TypeClientDetailComponent implements OnInit, OnDestroy {

    typeClient: TypeClient;
    fraisClients: any[] = [];
    selectedFraisClients: any[] = [];
    isSaving: boolean;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private typeClientService: TypeClientService,
        private fraisClientService: FraisService,
        private alertService: JhiAlertService,
        private route: ActivatedRoute
    ) {
    }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.fraisClientService.query({ NO_QUERY: true, size: 1000 }).subscribe((frais: ResponseWrapper) => {
            this.fraisClients = frais.json;
        });
        this.registerChangeInTypeClients();
    }
    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
    load(id) {
        this.typeClientService.find(id).subscribe((typeClient) => {
            this.typeClient = typeClient;
            this.selectedFraisClients = typeClient.fraisClients;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTypeClients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeClientListModification',
            (response) => this.load(this.typeClient.id)
        );
    }
    save() {
        this.isSaving = true;
        this.typeClient.fraisClients = this.selectedFraisClients;
        this.typeClientService.update(this.typeClient).subscribe((typeClient) => {
            this.previousState();
        }, () => {
            this.alertService.error("Une erreur s'est produite lors de la mise à jour des frais sur le type de clients", null, null);
        });
    }
}
