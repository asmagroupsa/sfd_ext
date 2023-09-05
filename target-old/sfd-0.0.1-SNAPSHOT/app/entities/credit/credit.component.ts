import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    OnChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from 'ng-jhipster';

import { Credit } from './credit.model';
import { CreditService } from './credit.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData, HOST, createRequestOption } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CompteService } from '../compte/compte.service';
import { Compte } from '../compte/compte.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '../../shared/state/statistiques';
import { DossierService } from '../dossier/dossier.service';
import { SPSFDService } from '../../shared/sp-sfd.service';
import { CARMESService } from "../../shared/carmes.service";
import { Http } from "@angular/http";
import { CompteActiveComponent } from './compteActive/compteActive.component';

declare let $: any;
declare let modal: any;
declare let modalHide: any;
declare const select_init: any;

@Component({
    selector: 'jhi-credit',
    templateUrl: './credit.component.html',
    styleUrls: ['../../shared/state/state.scss', './credit.component.scss'],
    styles: [
        `
  .ui.button{
    position: relative;
    left: -20px;
    background: transparent;
    top: -5px;
  }
  `
    ]
})
export class CreditComponent
    implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    selectedCredit: any;
    creditId: any;
    params: { [key: string]: any };
    comptes: any[];
    decaisse: boolean = false;
    isProcess: boolean = false;
    currentAccount: any;
    credits: Credit[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    pagingParams: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    isGroup: boolean = false;
    decaisementModal: NgbModalRef;
    annulationModal: NgbModalRef;
    solde: number;
    date1: any;
    date2: any;
    annilationBtnLabel = 'Annuler';
    operators = [];
    produits = [];
    benefit: any = {};
    bn = 0;
    listAssuranceOptions = [];
    optionId;
    tarif;
    AsWarning = false;
    WarningClient: any[] = [];
    ProduitByEbuisness;
    produitId: any;

    msg: string;
    constructor(
        private creditService: CreditService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private compteService: CompteService,
        private dossierService: DossierService,
        private ngbModal: NgbModal,
        private _datePipe: DatePipe,
        private _spSFDService: SPSFDService,
        public langue: LanguesService,
        public _carmesService: CARMESService,
        public _http: Http,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.pagingParams = data['pagingParams'];
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
        this.activatedRoute.params.subscribe(params => {
            this.params = params;
            if (params['id'] == 'deblocage') {
                this.decaisse = false;
            } else if (params['id'] == 'decaissement') {
                this.decaisse = true;
            }
            select_init();
            this.loadAll();
        });
    }
    onPeriodChange() {
        this.loadAll();
    }
    compte(id: any) {
        if (!this.comptes) return new Compte();
        return this.comptes.find(compte => {
            return compte.id == id;
        });
    }
    loadAll() {
        const formatDate = (date) => {
            if (!date) return null;
            return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
        };
        this.creditService
            .queryCredits(this.decaisse, {
                'createdDate.greaterOrEqualThan': formatDate(this.date1),
                'createdDate.lessOrEqualThan': formatDate(this.date2)
            })
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate([
            '/entity',
            'credit',
            'operation',
            this.params['id']
        ]);
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/entity',
            'credit',
            'operation',
            this.params['id']
        ]);
        this.loadAll();
    }
    ngOnInit() {
        //this.loadAll();
        this.compteService.query().subscribe((res: ResponseWrapper) => {
            this.comptes = res.json;
        });
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCredits();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Credit) {
        return item.id;
    }
    registerChangeInCredits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditListModification',
            response => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'desc' : 'asc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }

        this.credits = data;
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    getAssuranceOption() {
        this.creditService.getAssuranceOption().subscribe((data) => {
            console.log(data);
            this.listAssuranceOptions = data.json;
        })
    }

    async verifierActivationCompteCarmes(chaineCpteCarmes) {
        let res;

        try {
            res = await this.dossierService.verificationActivationCarmes(chaineCpteCarmes).toPromise();
        } catch (error) {
            console.error(error);
            this.alertService.error('Erreur');
            return false;
        }

        if (!res) {
            return false;
        }

        const carmesNotActive = res.filter((i: any) => i.etatActivation === 0).map((i) => i.compteCarmes);

        if (carmesNotActive.length !== 0) {
            let msg: string;

            if (carmesNotActive.length > 1) {
                msg = `Les comptes CARMES ${carmesNotActive.join(', ')} ne sont pas activés`
                this.open(carmesNotActive);
            }
            else {
                msg = `Le compte CARMES ${carmesNotActive[0]} n' est pas activé`;
                this.open(carmesNotActive[0]);
            }

            // this.alertService.warning(msg);
            return false;
        }

        return true;
    }

    async getProduitByOperateurId() {
        if (!(+this.benefit.id_operateur)) {
            return;
        }

        try {
            this.produits = await this._carmesService.getEBusinessProduitByOperatorId(this.benefit.id_operateur).toPromise();
            select_init();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getProduitByCat() {
        try {
            this.produits = await this._carmesService.getEBusinessProduitByCatCode("ASS").toPromise();
            select_init();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async _getOperateurs() {
        try {
            this.operators = await this._carmesService.getEBusinessOperators().toPromise();
            select_init();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async decaisser(credit: any, modal: any) {

        // try {
        //     await this._getEBusinessAddBeneficiary();
        // } catch (error) {
        //     console.error(error);
        //     return;
        // }

        //let etat = await this.verifierActivationCompteCarmes(credit.chaine_compte_carmes);
        //if (!etat) return;

        this.benefit.compte_carmes_beneficiaire = credit.chaine_compte_carmes;
        this.benefit.ref = credit.reference;

        this.creditId = credit.credit_id;
        this.selectedCredit = credit;

        this.decaisementModal = this.ngbModal.open(modal, { size: 'sm' });

        const n = document.getElementById('confirm-decaissement-modal-header').parentElement.parentElement.parentElement;
        n.style.minHeight = '0px';
        n.style.top = 'unset';
        n.style.bottom = 'unset';
        n.style.backgroundColor = 'unset';
        n.style.boxShadow = 'unset';
        //await this._getOperateurs();
        this.getAssuranceOption();
        // await this.getProduitByCat();
    }

    openAnnulationModal(credit: any, modal: any) {
        this.creditId = credit.credit_id;
        this.selectedCredit = credit;

        this.annulationModal = this.ngbModal.open(modal, { size: 'sm' });

        const n = document.getElementById('annulation-decaissement-modal-header').parentElement.parentElement.parentElement;
        n.style.minHeight = '0px';
        n.style.top = 'unset';
        n.style.bottom = 'unset';
        n.style.backgroundColor = 'unset';
        n.style.boxShadow = 'unset';
    }

    async process(creditId) {
        console.log('ok')
        // if(this.produits.length > 0){
        // try {
        //     await this._getEBusinessAddBeneficiary();
        // } catch (error) {
        //     console.error(error);
        //     return;
        // }

        // const creditId = this.creditId;
        console.log()

        if (creditId) {

            // this.solde = null;
            // this.isProcess = true;
            // this.credits = this.credits.map(credit => {
            //     if (credit.id != creditId) credit.decaisser = true;
            //     return credit;
            // });
            this.creditService.decaisser(creditId, this.optionId, this.tarif).subscribe(
                (solde) => {
                    console.log(solde)
                    this.solde = solde;
                    // this.decaisementModal.close();
                    this.creditId = null;
                    this.alertService.success('Le crédit est décaissé');
                    this.loadAll();
                    // alert('Le crédit est décaissé');
                    this.isProcess = false;
                },
            );
        }
    }
    printContrat(creditId: any) {
        modalHide('.ui.tiny.modal.accord');
    }

    ngAfterViewInit(): void {
        select_init();
    }

    ngOnChanges() {
        select_init();
    }

    annuler() {
        if (!this.creditId) {
            return;
        }

        this.annilationBtnLabel = 'Annulation en cours...';

        this._spSFDService.annulationDecaissementCreditClient(this.creditId)
            .then(() => {
                this.annilationBtnLabel = 'Annuler';
                this.annulationModal.dismiss();
                this.alertService.success('Décaissement annulé.');
            })
            .catch(() => {
                this.annilationBtnLabel = 'Annuler';
                this.alertService.error('Erreur');
            });
    }

    private async _getEBusinessAddBeneficiary() {
        /* {
            compte_carmes_beneficiaire: this.selectedCredit.chaine_compte_carmes,
            id_eproduit: this.selectedCredit.chaine_compte_carmes,
            id_operateur: this.selectedCredit.chaine_compte_carmes,
            montant: this.selectedCredit.chaine_compte_carmes,
        } */
        this.benefit.indice_sfd = UserData.getInstance().getSFD().indicePrestataire;

        try {
            this.benefit.defini_le = (new Date).toISOString();
            this.benefit.id_beneficiaire = 1;
            this.benefit.compte_commission_fnm = await this._getFNMCompte();
            this.benefit.montant = this.tarif;
            this.benefit.id_eproduit = this.produitId;
            await this._carmesService.eBusinessAddBeneficiary(this.benefit).toPromise();
        } catch (error) {
            console.error(error);
            let m = 'Erreur';

            if (typeof error === 'string') {
                m = error;
            }

            this.alertService.warning(m);
            throw error;
        }
    }

    onOptionChange() {
        this.WarningClient = [];
        this.creditService.getTarifAssurance(this.creditId, this.optionId).subscribe((data) => {
            data.json.forEach((element) => {
                if (element.etat == false) {
                    this.WarningClient.push(element);
                }
                this.WarningClient.length > 0 ? this.AsWarning = true : this.AsWarning = false;
                this.tarif = data.json[0].tarif;
            });

            // this.tarif = data.json.resultat;
        }, (err) => {

        })
    }

    onProduitChange() {
        this.benefit.montant = this.produits.find((i) => i.id_eproduit === this.benefit.id_eproduit).mont_eproduit;

        this.bn = this.benefit.compte_carmes_beneficiaire.split('*').length;
    }

    private async _getFNMCompte() {
        const rq = this._http.get(HOST + '/api/settings', createRequestOption({
            NO_QUERY: true,
            'name.equals': 'COMPTE_CARMES_COMMISSION_ASSURANCE',
        }))
            .map((r) => {
                const b: any[] = r.json();

                if (b.length !== 1) {
                    throw b;
                }

                return b[0].valeur;
            })
            .toPromise();

        try {
            return await rq;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    open(data) {
        const modalRef = this.ngbModal.open(CompteActiveComponent);
        modalRef.componentInstance.data = data;
        modalRef.result
            .then((r) => {
                if (r === 'success') {
                    this.loadAll();
                }
            })
            .catch();
    }

    async chekProduitEtat(credit: any, modal: any) {
        //let etat = await this.verifierActivationCompteCarmes(credit.chaine_compte_carmes);
        //if (!etat) return;

        try {
            this.ProduitByEbuisness = await this._carmesService.getProduitByEbuisiness().toPromise();

            console.log(this.ProduitByEbuisness);
            if (this.ProduitByEbuisness.desactif == false) {
                this.produitId = this.ProduitByEbuisness.id_eproduit;
                this.decaisser(credit, modal);
                this.alertService.success('Le crédit est décaissé');
            }
            else {

                this.benefit.compte_carmes_beneficiaire = credit.chaine_compte_carmes;
                this.benefit.ref = credit.reference;

                this.creditId = credit.credit_id;
                this.selectedCredit = credit;
                this.tarif = null;
                this.optionId = null;
                // this.process();
            }
        } catch (error) {

        }
    }

    alertNotification() {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
      }
}
