import 'rxjs/add/operator/map';

import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks } from 'ng-jhipster';
import { Observable, Subscription } from 'rxjs';

import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { EventBus, ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { getImgSrc } from '../../shared/model/functions';
import { createRequestOption, LOCAL_FLAG, READBITFILEURL } from '../../shared/model/request-util';
import { LanguesService } from '../../shared/myTranslation/langues';
import { AffectationService } from '../affectation/affectation.service';
import { typeClient } from '../entity.module';
import { Leader } from '../leader/leader.model';
import { LeaderService } from '../leader/leader.service';
import { Profession } from '../profession/profession.model';
import { ProfessionService } from '../profession/profession.service';
import { TypeClientService } from '../type-client/type-client.service';
import { Client } from './client.model';
import { ClientService } from './client.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SPClientService } from "../../shared/sp-client.service";
import { AssuranceService } from '../assurances';

declare const select_init: any;
declare let jQuery: any;
declare const modal: any;
declare const modalHide: any;

@Component({
    selector: 'jhi-client',
    templateUrl: './client.component.html',
    styles: [
        `.btn.btn-outline-secondary{
    cursor:pointer;
}`
    ]
})
export class ClientComponent implements OnInit, OnDestroy, AfterViewInit {
    dissoudreModal: NgbModalRef;
    ngroupMembersModal: NgbModalRef;
    beneficiaireModal: NgbModalRef;
    ngroup;
    isMarchand: boolean;
    params: { [key: string]: any };
    // allClients: any[];
    professions: Profession[];
    isLead: boolean = false;
    isGroup: boolean = false;
    currentGroupD: Client;
    currentAccount: any;
    montant: string = '';
    activationClient: Client;
    clients: any[] = [];
    marchands: any[] = [];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    memberGroup: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    pagingParams: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    type: any;
    typeClients: any[] = [];
    leaders: Leader[];
    private _currentGroup: any;
    inactif = false;
    isSaving: boolean = false;
    showDissous: any = 'false';
    localFlag: boolean;
    date1: any;
    date2: any;
    cs: Subscription;
    loading = false;
    listBeneficiary: any[] = [];

    constructor(
        private clientService: ClientService,
        private clientType: TypeClientService,
        private leaderService: LeaderService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: Http,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        public professionService: ProfessionService,
        public domSanitizer: DomSanitizer,
        private _datePipe: DatePipe,
        public affectationService: AffectationService,
        private ngbModal: NgbModal,
        private _spClientService: SPClientService,
        private assuranceService: AssuranceService,
        // private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.localFlag = LOCAL_FLAG;
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.pagingParams = data['pagingParams'];
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });

        this._currentGroup = null;
    }
    onActivationChange() {
        select_init();
    }
    ngAfterViewInit() {
        select_init();
    }
    closeActivationModal() {
        modalHide('#activer-client-modal');
        this.activationClient = null;
        this.montant = '';
        this.isSaving = false;
    }
    activerClientModal(client: Client) {
        this.activationClient = client;
        if (!client) return;
        modal('#activer-client-modal');
    }
    activerClient() {
        if (!this.activationClient) {

            this.closeActivationModal();
            return;
        }
        this.isSaving = true;
        let userReference: string = UserData.getInstance().userReference;
        let req = {
            'user_reference_guichetier': userReference,
            'client_id': this.activationClient.id,
            'montant': this.montant
        };
        this.clientService.activerClient(req).subscribe(resp => {
            if (resp.json.resultat && resp.json.resultat.indexOf('*') != -1) {
                this.activationClient.status = true;
                this.closeActivationModal();
                this.alertService.success(`Le client ${this.activationClient.name} a été activé`);

                UserData.getInstance().activerClientData.amount = req.montant;
                UserData.getInstance().activerClientData.other = resp.json.resultat;
                this.closeActivationModal();
                this.router.navigateByUrl('/entity/client/activer-print-sheet');
            } else if (resp.json.resultat == 'COMPTE_AGENT_ERRONEE') {
                this.closeActivationModal();
                this.alertService.warning(`Le compte de l'agent est erroné`);
            } else if (resp.json.resultat == 'CLIENT_DEJA_ACTIVE') {
                this.closeActivationModal();
                this.alertService.warning(`Le client est déjà activé`);
            } else if (resp.json.resultat == 'COMPTE_CLIENT_ERRONEE') {
                this.closeActivationModal();
                this.alertService.warning(`Le compte du client est erroné,veuillez réessayer`);
            } else if (resp.json.resultat == 'MONTANT_INSUFFISANT') {
                this.alertService.warning(`Le montant saisi est insuffisant`);
                this.isSaving = false;
                //this.closeActivationModal();
            }
        }, err => {
            this.isSaving = false;
            this.alertService.warning("Une erreur inattendue s'est produite, veuillez réessayer");
        });
    }
    isDisponibleForGroup(groups: any[]): string {
        if (!groups.length) return '';
        let checked = '';
        groups.forEach(group => {
            if (group.status) {
                checked = group.clt ? group.clt.name : '';
                return;
            }
        });
        return checked;
    }
    changeType(type: any) {
        if (this.cs) {
            this.cs.unsubscribe();
        }

        this.type = type;
        this.isGroup = false;
        this.isLead = false;
        this.isMarchand = false;
        this.clients = [];
        console.log('changeType');
        this.loadAll();
    }

    groupFilter(status: any) {
        this.showDissous = status;
        this.clients = [];
        this.loadAll();
    }

    getProfessions() {
        this.professionService
            .query({ size: 1000 })
            .subscribe((res: ResponseWrapper) => {
                this.professions =
                    res.json || this.principal.store['professions'] || [];
                this.principal.store['professions'] = res.json;
            });
    }

    profession(id: any) {
        if (!this.professions) return new Profession();

        return this.professions.find(profession => profession.id == id);
    }

    public getLeader(id: number): Leader {
        if (!this.leaders) return new Leader();

        return this.leaders.find((leader: Leader) => leader.id === id);
    }
    queryMarchand() {
        let listeAgences = UserData.getInstance().listeAgences;
        let agence = '';
        if (listeAgences.length) {
            if (UserData.getInstance().currentAgence) {
                agence = UserData.getInstance().currentAgence.codeAgence;
            } else {
                agence = listeAgences[0].codeAgence || UserData.getInstance().agence;
            }
        } else {
            agence = UserData.getInstance().currentAgence.codeAgence;
        }
        //let param = getUserRefOrChaineAgence(ParamsType.CHAINE_AGENCE);
        let premierMessageAafficher = ((this.page || 1) - 1) * this.itemsPerPage;
        if (this.marchands.length) {
            this.clients = this.marchands.slice(premierMessageAafficher, premierMessageAafficher + this.itemsPerPage);
            select_init();
        }
        this.affectationService.queryMarchand(agence, true).subscribe(
            (res: ResponseWrapper) => {
                this.marchands = res.json;
                this.clients = this.marchands.slice(premierMessageAafficher, premierMessageAafficher + this.itemsPerPage);
                this.totalItems = this.marchands.length;
                select_init();
            },
            (res: ResponseWrapper) => {
                this.onError(res.json);
            }
        );
    }
    loadAll() {
        // console.log('loadAll');
        if (!this.type) this.type = {};

        if (this.type && this.type.code === 'MARCHAND' && UserData.getInstance().sfd_ && !UserData.getInstance().sfd_.indicePrestataire) {
            this.clients = [];
            this.totalItems = 0;
            this.queryCount = 0;
            return;
        }

        if (this.type && this.type.code === 'MARCHAND') {
            this.queryMarchand();
            return;
        }
        const formatDate = (date) => {
            if (!date) return null;
            return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
        };
        let countryId = UserData.getInstance().countryId || UserData.getInstance().country_id || 1;
        const req: any = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            // "status.equals": null,
            'countryId.equals': countryId,
            'typeClientId.equals': this.type.id,
            'createdDate.greaterOrEqualThan': formatDate(this.date1),
            'createdDate.lessOrEqualThan': formatDate(this.date2)
        };
        if (this.type.code === 'MARCHAND') {
            req['codeGuichet.contains'] = UserData.getInstance().sfd_.indicePrestataire + '-';
            req['NO_QUERY'] = true;
        }
        if (this.type.code === 'MUTUEL') {
            /*  && this.showDissous !== 'tout' */
            req['dissout.equals'] = this.showDissous;
        }
        if (this.currentSearch) {
            req['name.contains'] = req['firstName.contains'] = req['alias.contains'] = req['denomination.contains'] = req['cpteCarmes.contains'] = this.currentSearch;
            req.condition = 'OR';
        }

        this.loading = true;
        this.cs = this.clientService.query(req).subscribe(
            (res: ResponseWrapper) => {
                this.loading = false;
                this.onSuccess(res.json, res.headers);
            },
            (res: ResponseWrapper) => {
                this.loading = false;
                this.onError(res.json);
            });
    }

    loadPage(page: number) {

        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/entity', 'client'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        console.log('transition');

        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/entity',
            'client',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        console.log('clear');
        this.loadAll();
    }

    search(query) {
        if (!query) return this.clear();

        this.page = 0;
        this.currentSearch = query;
        /*  this.router.navigate([
      '/entity',
      'client',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
      }
    ]); */
        console.log('search');
        this.loadAll();
    }
    /* getNom(groupe: any): Client {
        return this.allClients.find(client => client.id == groupe.clientId);
    } */

    private _sortTypeClients() {
        let i = this.typeClients.find((t) => t.code === 'INDIVIDU');
        let mu = this.typeClients.find((t) => t.code === 'MUTUEL');
        let e = this.typeClients.find((t) => t.code === 'ENTREPRISE');
        // let ma = this.typeClients.find((t) => t.code === 'MARCHAND');

        this.typeClients[0] = i;
        this.typeClients[1] = mu;
        this.typeClients[2] = e;
        // this.typeClients[3] = ma;
    }

    ngOnInit() {

        this.clientType.query().subscribe((res: ResponseWrapper) => {
            this.typeClients = res.json.filter(element => (['MUTUEL', 'ENTREPRISE', 'INDIVIDU'/* , 'MARCHAND' */].indexOf(element.code) != -1));

            this._sortTypeClients();

            if (this.params['type'] && this.params['type'] == 'groupe') {
                this.type = this.typeClients.find(typeClient => typeClient.code == 'MUTUEL');
                this.isGroup = true;
            } else if (this.params['type'] && this.params['type'] == 'entreprise') {
                this.type = this.typeClients.find(typeClient => typeClient.code == 'ENTREPRISE');
                this.isLead = true;
            } else if (this.params['type'] && this.params['type'] == 'marchand') {
                this.type = this.typeClients.find(typeClient => typeClient.code == 'MARCHAND');
                this.isMarchand = true;
            } else this.type = this.typeClients.find(typeClient => typeClient.code == 'INDIVIDU');
            console.log('ngOnInit');
            this.loadAll();
        });
        this.getProfessions();
        this.leaders = this.principal.store['leaders'] || [];
        /* this.clientService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.allClients = res.json;
            },
            (res: ResponseWrapper) => {
                this.onError(res.json);
            }
        ); */
        this.leaderService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.principal.store['leaders'] = res.json;
                this.leaders = res.json;
            },
            (res: ResponseWrapper) => {
                this.leaders = this.principal.store['leaders'] || [];
            }
        );
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInClients();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
        if (this.cs) this.cs.unsubscribe();
    }

    trackId(index: number, item: Client) {
        return item.id;
    }

    registerChangeInClients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'clientListModification',
            response => {
                console.log('registerChangeInClients');
                this.loadAll()
            }
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
        this.clients = data.map(client => {
            let excludes = ['../../../content/images/avatar.png', "../../../content/coreUi/assets/img/avatars/6.jpg"];
            if (client.pictureUrl && excludes.indexOf(client.pictureUrl) == -1) this.onLoaded(client, client.pictureUrl);
            else client.picture = '../../../content/images/avatar.png';
            return client;
        });
        if (this.params['id']) {
            let scrollOffset = jQuery('.scroll').offset();
            if (scrollOffset) {
                let position = scrollOffset.top;
                jQuery('html,body').animate({ scrollTop: position }, 1000);
            }
            /* this.currentGroupD = this.clients.find(client => {
        return client.id == this.params['id'];
      }); */
        }
        select_init();
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    public printIdentificationSheet(client: Client): void {
        //this._clientStateService.printIdentificationSheet(client);
    }
    onLoaded(client: Client, url: string = '1.png') {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
            .get(`${READBITFILEURL}${url}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            })
            .subscribe(url => {
                client.picture = this.domSanitizer.bypassSecurityTrustUrl(url);
            });
    }

    get currentGroup(): any {
        return this._currentGroup;
    }
    deletegroupMembersModal(group: Client): void {
        this._currentGroup = null;
        this._currentGroup = group;
        console.log(this._currentGroup)
        // this._changeDetectorRef.detectChanges();
        modal('#delete-group-members-modal');
    }
    public closeDeleteMembersModal(): void {
        this._currentGroup = null;
        modalHide('#delete-group-members-modal');
    }
    deleteMember(id, status, index) {
        this.clientService.disabledMember(id, !status).subscribe(
            res => {
                // NON, DEMANDE_EN_COURS,
                if (
                    res.json.resultat == 'DESACTIVATION_REUSSIE' ||
                    res.json.resultat == 'ACTIVATION_REUSSIE'
                ) {
                    this.alertService.success(res.json.resultat, null, null);
                    this.loadAll();
                    this.ngroupMembersModal.close();
                    // this.closeDeleteMembersModal();
                    if (this._currentGroup.groups[index])
                        this._currentGroup.groups[index].status = !status;
                } else {
                    let message: string = "Une erreur s'est produite";
                    if (res.json.resultat == 'DEMANDE_EN_COURS') {
                        message = "Le groupe a déja une demande en cours vous ne pouvez pas activer ou désactiver";
                    } else if (res.json.resultat == 'CREDIT_EN_COURS') {
                        message = "Le groupe a déja un crédit en cours vous ne pouvez pas activer ou désactiver";
                    } else if (res.json.resultat == 'CLIENT_MEMBRE_INEXISTANT') {
                        message = "Erreur, Le membre n'existe pas dans ce groupe";
                    }
                    this.alertService.error(message, null, null);
                }
            },
            err => {
                this.alertService.error('', null, null);
            }
        );
    }
    onPeriodChange() {
        if (!this.date1 && !this.date2) {
            return;
        }
        console.log('onPeriodChange');
        this.loadAll();
    }
    public showgroupMembersModal(group: any): void {
        this.memberGroup = null;
        this.memberGroup = Object.assign({}, group);
        this.memberGroup.groups = group.groups.map(m => {
            if (m.client.pictureUrl)
                this.onLoaded(m.client, m.client.pictureUrl);
            else m.client.picture = '../../../content/images/avatar.png';
            return m;
        });
        modal('#group-members-modal');
    }

    public closegroupMembersModal(): void {
        this.memberGroup = {};
        modalHide('#group-members-modal');
    }

    getPresidentName(members: any[]) {
        const m = members.find((_m) => _m.memberRole == 'PRESIDENT');

        if (m) {
            const p = m.client;
            return p ? `${p.name} ${p.firstName}` : '';
        }

        return '';
    }

    getImgSrc(url: string): string {
        return getImgSrc(url);
    }

    dissoudre(group, modal) {
        // this.creditId = credit.credit_id;
        this.currentGroupD = group;

        this.dissoudreModal = this.ngbModal.open(modal, { size: 'sm' });

        const n = document.getElementById('dissoudre-modal-header').parentElement.parentElement.parentElement;
        n.style.minHeight = '0px';
        n.style.top = 'unset';
        n.style.bottom = 'unset';
        n.style.backgroundColor = 'unset';
        n.style.boxShadow = 'unset';
    }

    dissoudreP(raison_dissolution) {
        this._spClientService.dissoudreGroupe({
            group_id: this.currentGroupD.id,
            raison_dissolution: raison_dissolution,
        })
            .then(() => {
                this.currentGroupD = null;
                this.alertService.success('Groupe dissout');
                this.dissoudreModal.close();
                this.loadAll();
            })
            .catch((e) => {
                console.error(e);
                let m = 'Erreur';

                if (typeof e === 'string') {
                    m = {
                        'CREDIT_EN_COURS': 'CREDIT EN COURS',
                        'DEMANDE_EN_COURS': 'DEMANDE EN COURS',
                    }[e] || m;
                }

                this.alertService.error(m);
            });
    }

    nshowgroupMembersModal(group, modal) {
        this.ngroup = group;
        this.ngroupMembersModal = this.ngbModal.open(modal, { size: 'sm' });
        const n = document.getElementById('group-member-modal-header').parentElement.parentElement.parentElement;
        n.style.minHeight = '0px';
        n.style.top = 'unset';
        n.style.bottom = 'unset';
        n.style.backgroundColor = 'unset';
        n.style.boxShadow = 'unset';
    }

    beneficiaire(data, modal) {
        // this.currentGroupD = group;

        this.beneficiaireModal = this.ngbModal.open(modal, { size: 'sm' });

        const n = document.getElementById('beneficiary-modal-header').parentElement.parentElement.parentElement;
        n.style.minHeight = '0px';
        n.style.top = 'unset';
        n.style.bottom = 'unset';
        n.style.backgroundColor = 'unset';
        n.style.boxShadow = 'unset';
        this.getBeneficiaryByClient(data.id);
    }

    getBeneficiaryByClient(id) {
        this.assuranceService.getAllBeneficiaryByClient(id).subscribe((data) => {
            this.listBeneficiary = data.json;
        })
    }
}
