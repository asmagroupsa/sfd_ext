import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { OperationService } from '.';
import { getImgSrc } from '../../shared/model/functions';
import { ClientService } from '../client/client.service';
declare let accordion: any;

@Component({
    selector: 'jhi-consulter-solde',
    templateUrl: './consulter-solde.html'
})
export class ConsulterSoldeComponent {
    solde: any;
    commissions = [];
    model: any = {
        compteClient: '',
        client: ''
    };
    eventSubscriber: Subscription;
    compteInternes: any[] = [];
    date = {};
    searchCompteByFieldSubscription: Subscription;
    constructor(
        private operationService: OperationService,
        private alertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private clientService: ClientService,
        public principal: Principal
    ) {
        // this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }
    ngAfterViewInit() {
        accordion();
    }
    getImgSource(url: string): string {
        return getImgSrc(url);
    }
    onNameBlur(name) {
        name = name.trim();
        if (name.length >= 3) {
            if (this.searchCompteByFieldSubscription) this.searchCompteByFieldSubscription.unsubscribe();
            let agenceRef;
            if (UserData.getInstance().currentAgence) {
                agenceRef = UserData.getInstance().currentAgence.codeAgence;
            }
            let req = {
                NO_QUERY: true,
                'name.contains': name,
                'firstName.contains': name,
                'denomination.contains': name,
                'cpteCarmes.contains': name,
                'code.contains': name,
                'agenceReference.equals': agenceRef,
                'condition': 'OR'
            };
            this.searchCompteByFieldSubscription = this.clientService.query(req)
                .subscribe(
                    (cs) => {
                        let agencesReference = UserData.getInstance().agencesReference;
                        
                        this.compteInternes = cs.json.filter((c) => {

                            if (agenceRef === c.agenceReference) {
                                return true;
                            }
                            return agencesReference && agencesReference.indexOf(c.agenceReference) != -1;
                        });
                    }
                );
        }
    }
    getSolde(comptes: any[]): string {
        if (!comptes || !comptes.length) return '';
        let findedCpte = comptes.find((compte) => {
            return compte.accountType && compte.accountType.initiale === 'DAV';
        });
        return findedCpte ? findedCpte.balance : '';
    }
    getNumAccount(comptes: any[]): string {
        if (!comptes || !comptes.length) return '';
        let findedCpte = comptes.find((compte) => {
            return compte.accountType && compte.accountType.initiale === 'DAV';
        });
        return findedCpte ? findedCpte.numAccount : '';
    }

    selectCompte(client: any) {
        this.model.client = client;
        this.model.compteClient = this.getNumAccount(client.comptes);
        this.solde = null;
    }
    save() {
        if (!this.model.compteClient) return;
        /* if (this.model.client) {
            this.solde = this.getSolde(this.model.client.comptes)
            return;
        } */
        this.operationService.verifierSolde(this.model.compteClient)
            .then(
                (solde) => {
                    this.solde = solde.resultat;
                    if (this.solde == null) {
                        this.alertService.warning("Le compte est incorrect");
                    }
                },
        );
    }

}
