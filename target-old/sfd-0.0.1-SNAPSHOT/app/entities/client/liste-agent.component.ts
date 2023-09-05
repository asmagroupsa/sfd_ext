import {Component, OnInit, OnDestroy, AfterViewInit, ElementRef} from "@angular/core";
import {SPFNMService} from "../../shared/sp-fnm.service";
import {DepartementService} from "../departement/departement.service";
import {SFDService} from "../s-fd/sfd.service";
import {DistrictService} from "../district/district.service";
import {CityService} from "../city/city.service";
import {TownShipService} from "../town-ship/town-ship.service";
import {HOST, UserData, ITEMS_PER_PAGE} from "../../shared/index";
import {ActivatedRoute, Router} from "@angular/router";
import { READFILEURL } from '../../shared/model/request-util';
import { InitPasswordDialogComponent } from "./init-password-dialog.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientService, Client } from ".";
import { JhiAlertService, JhiPaginationUtil } from "ng-jhipster";
import { PlatformLocation } from "@angular/common";

/* import $ from 'jquery'
window['jQuery'] = $; */
declare const select_init;
declare let jQuery: any;

@Component({
    selector: 'jhi-liste-agent',
    templateUrl: './liste-agent.component.html'
})
export class ListeAgentComponent implements OnInit, AfterViewInit {
    agents = [];
    agentsData = [];
    filtredAgentsData = [];
    loading = false;
    district;
    sfdReference = UserData.getInstance().getSFD().code;
    arrondissement;
    city;
    departement;
    sfds = [];
    _arrondissements = [];
    _cities = [];
    _districts = [];
    _departements = [];
    fileURL = READFILEURL;

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
    start: number = 0;
    end: number;
    currentSearch: string;

    constructor(
        private _spFNMService: SPFNMService,
        private _departementService: DepartementService,
        private _sfdService: SFDService,
        private _districtService: DistrictService,
        private _cityService: CityService,
        private _townShipService: TownShipService,
        private _clientService: ClientService,
        private _activatedRoute: ActivatedRoute,
        private _alertService: JhiAlertService,
        private _router: Router,
        private _ngbModal: NgbModal,

    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this._activatedRoute.data.subscribe(data => {
        this.page = data['pagingParams'].page;
        this.pagingParams = data['pagingParams'];
        this.previousPage = data['pagingParams'].page;
        this.reverse = data['pagingParams'].ascending;
        this.predicate = data['pagingParams'].predicate;

        this.end = this.itemsPerPage;
     });
    this.currentSearch = _activatedRoute.snapshot.params['search']
            ? _activatedRoute.snapshot.params['search']
            : '';
    }

    ngOnInit() {
        /* this._sfdService.query({size: 1000000}).toPromise()
        .then((r) => {
            this.sfds = r.json;
        })
        .catch(console.error); */
        this.getAgents();

        this._departementService.query({size: 1000000}).toPromise()
        .then((r) => {
            this._departements = r.json;
        })
        .catch(console.error);

        this._districtService.query({size: 1000000}).toPromise()
        .then((r) => {
            this._districts = r.json;
        })
        .catch(console.error);

        this._cityService.query({size: 1000000}).toPromise()
        .then((r) => {
            this._cities = r.json;
        })
        .catch(console.error);

        this._townShipService.query({size: 1000000}).toPromise()
        .then((r) => {
            this._arrondissements = r.json;
        })
        .catch(console.error);


    }


    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.transition(page);
        }
    }

    transition(page: number) {
        this._router.navigate(['/entity', 'client', 'liste-agent'], {
            queryParams: {
            page: this.page,
            search: this.currentSearch,
            size: this.itemsPerPage,
            }
        });
        this.loadAgents(page);
    }


    reload() {
        this.page = 0;
        this._router.navigate(['/entity', 'client', 'liste-agent'], {
            queryParams: {
            page: this.page
            }
        });
        this.getAgents();
    }

    getAgents() {

        this.agents =[];
        this.loading = true;
        this._spFNMService.listeAgents({
            sfd_reference: this.sfdReference,
            ...this._args(),
        })
        .then((agents) => {
            this.loading = false;
            this.agentsData = agents;
            this.agents = agents.slice(0, this.itemsPerPage);
            this.totalItems = this.agentsData.length;
            select_init();
        })
        .catch((e) => {
            console.error(e);
            this.loading = false;
        });
    }

    loadAgents(page: number) {
        this.agents =[];
        this.loading = true;
        const interval = Math.abs(page - this.previousPage);

        if(this.previousPage < page)
            this.start = this.start + (interval * this.itemsPerPage);
        else this.start = this.start - (interval * this.itemsPerPage);

        this.end = this.start + this.itemsPerPage;

        if(this.currentSearch)
            this.agents =  this.filtredAgentsData.slice(this.start, this.end);
        else this.agents = this.agentsData.slice(this.start, this.end);
        this.loading = false;

        this.previousPage = page;
        select_init();

    }

    search(query) {

        this.currentSearch = query;
        if (!query) {
            return this.reload();
        }
        this.filtredAgentsData = this.agentsData.filter(function(agent){
            return agent.name.indexOf(query) !== -1 || ( agent.first_name !== null && agent.first_name.indexOf(query) !== -1) || agent.compte_carmes.indexOf(query) !== -1;
        });
        this.totalItems = this.filtredAgentsData.length;
        this.agents = this.filtredAgentsData.slice(0, this.itemsPerPage);
        select_init();
    }

    get arrondissements() {
        return this._arrondissements.filter((i) => i.cityId === this.city);
    }

    get cities() {
        return this._cities.filter((i) => i.departementId === this.departement);
    }

    get departements() {
        return this._departements;
    }

    get districts() {
        return this._districts.filter((i) => i.townShipId === this.arrondissement);
    }

    ngAfterViewInit() {
        select_init();
    }

    print() {
        this._router.navigate(['/entity', 'client', 'liste-agent-pdf'], {queryParams: this._args(),});
    }

    _args() {
        const f = (array, id) => {
            const i = array.find((e) => e.id === id);
            return i ? i.name : undefined;
        };

        return {
            // sfd_reference: this.sfdReference,
            type_acteur: 'MARCHAND',
            district: f(this.districts, this.district),
            arrondissement: f(this.arrondissements, this.arrondissement),
            city: f(this.cities, this.city),
            departement: f(this.departements, this.departement),
        };
    }

    openInitPasswordDialog(agent) {
        const ngbModalRef = this._ngbModal.open(InitPasswordDialogComponent);
        ngbModalRef.componentInstance.login = agent.compte_carmes;
        ngbModalRef.componentInstance.name = (agent.name || '') + ' ' + (agent.first_name || '');
    }

    disconnect(carmes) {
        this._clientService.disconnect(carmes).toPromise()
        .then((res) => {
            console.log(res.resultat);
            if (res.resultat == 'OK') {
                console.log('Déconnexion effectuée avec succes');
                 this._alertService.success('Déconnexion effectuée avec succes.');
            } else this._alertService.error('Echec de déconnexion.');
        })
        .catch((e) => {
            console.error(e)
            this._alertService.error('Echec de deconnexion.');
        });
    }
}
