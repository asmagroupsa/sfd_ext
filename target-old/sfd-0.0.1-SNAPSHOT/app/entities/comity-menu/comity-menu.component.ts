import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Client } from '../client/client.model';
import { ClientService } from '../client/client.service';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import { CreditRequest } from '../credit-request/credit-request.model';
import { Dossier } from '../dossier/dossier.model';
import { Produit } from '../produit/produit.model';
import { ProduitService } from '../produit/produit.service';
import { Validation } from '../validation/validation.model';
import { ValidationService } from '../validation/validation.service';
import { ComityMberService } from './comity-menu.service';

@Component({
  selector: 'jhi-comity-menu',
  templateUrl: './comity-menu.component.html'
})
export class ComityMberComponent implements OnInit, OnDestroy {

  validations: Validation[];
  comitables: any[];
  detaillables: any[];
  id: number;
  tab: any = 'demandes';
  checkeds: any = {};
  fragment: string;
  currentAccount: any;
  creditRequests: any[] = [];
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
  clients: Client[] = [];
  produits: Produit[] = [];
  constructor(
    private clientService: ClientService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    public principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    public langue: LanguesService,
    public produitService: ProduitService,
    public creditComityService: CreditComityService,
    public comityMberService: ComityMberService,
    public validationService: ValidationService
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
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.fragment = fragment.split('-')[0];
        this.id = +fragment.split('-')[1];
      }
    });
    this.activatedRoute.params.subscribe(params => {
      this.tab = params['id'];
    });
  }
  onChange(ev: any, request: CreditRequest) {
    if (ev.target.checked) {
      this.checkeds[request.id] = request;
    } else {
      delete this.checkeds[request.id];
    }
  }
  addDemandes() {
    for (let i in this.checkeds) {
      let dossier = new Dossier();
      this.principal.identity().then(identity => {
        dossier.createdBy = identity.name + ' ';
        dossier.createdBy += identity.firstName;
        dossier.creditComityId = this.id;
        dossier.creditRequestId = this.checkeds[i].credit_request_id;
        dossier.client = this.checkeds[i].name;
        this.comityMberService.createComitableDossier(dossier).subscribe(
          res => {
            alert('Les demandes sont ajoutés au comité');
          },
          err => {
            alert(
              "Une erreur s'est produite,les demandes ne sont pas ajoutés au comité"
            );
          }
        );
      });
    }
  }
  getClients() {
    this.clientService.query().subscribe((res: ResponseWrapper) => {
      this.clients = res.json;
    });

    this.produitService.query().subscribe((res: ResponseWrapper) => {
      this.principal.store['produits'] = res.json;
      this.produits = res.json;
    });
    this.validationService.query().subscribe((res: ResponseWrapper) => {
      this.validations = res.json;
    });
  }
  getNom(id: any) {
    if (!this.clients) return new Client();
    return this.clients.find(client => {
      return client.id == id;
    });
  }
  getProduit(id: any) {
    let produits = this.principal.store['produits'] || this.produits;
    if (!produits) return new Produit();
    return produits.find(produit => {
      return produit.id == id;
    });
  }
  loadAll() {
    /* if (this.currentSearch) {
      this.creditRequestService
        .search({
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe(
          (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    } */
    /* this.creditRequestService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: ResponseWrapper) => {
          this.principal.store['demandes'] = res.json;
          this.onSuccess(res.json, res.headers);
        },
        (res: ResponseWrapper) => this.onError(res.json)
      ); */
  }
  getComitable() {
    this.comityMberService
      .queryDejaComitable()
      .subscribe((res: ResponseWrapper) => {
        this.comitables = res.json;
        if (this.fragment != 'ajout') {
          this.creditRequests = this.comitables;
        }
      });
    this.comityMberService
      .queryDetaillable()
      .subscribe((res: ResponseWrapper) => {
        this.detaillables = res.json;
        if (this.fragment == 'ajout') {
          this.creditRequests = this.detaillables;
        }
      });
  }
  loadPage(page: number) {
    //this.page = page;
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(['/entity', 'credit-request'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = "";
    this.router.navigate([
      "/entity",
      "credit-request",
      {
        page: this.page,
        sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
      }
    ]);
    this.loadAll();
  }
  search(query) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      "/entity",
      "credit-request",
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
      }
    ]);
    this.loadAll();
  }
  ngOnInit() {
    this.getComitable();
    this.loadAll();
    this.getClients();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCreditRequests();
  }

  ngOnDestroy() {
    if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: CreditRequest) {
    return item.id;
  }
  registerChangeInCreditRequests() {
    this.eventSubscriber = this.eventManager.subscribe(
      "creditRequestListModification",
      response => this.loadAll()
    );
  }

  sort() {
    const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }

  private onSuccess(data, headers) {
    this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get("X-Total-Count");
    this.queryCount = this.totalItems;
    if (this.pagingParams && this.pagingParams.page) {
      //this.page = this.pagingParams.page;
    }
    this.creditRequests = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
