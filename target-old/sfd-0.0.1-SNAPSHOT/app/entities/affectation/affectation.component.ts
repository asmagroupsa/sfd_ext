import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";

import { Affectation } from "./affectation.model";
import { AffectationService } from "./affectation.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { getImgSrc } from '../../shared/model/functions';
declare let modal: any;
declare let modalHide: any;
declare let select_init: any;
declare let clearDropdown: any;

@Component({
  selector: "jhi-affectation",
  templateUrl: "./affectation.component.html"
})
export class AffectationComponent implements OnInit, OnDestroy {
  charges: any;
  chargeDePret: any;
  selectedAffectation: any;
  isProcess: boolean;
  title: string;
  currentAccount: any;
  affectations: Affectation[] = [];
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
  params: any;
  agence: any;
  listeAgences: any[] = [];
  createRessource: string = '';
  constructor(
    private affectationService: AffectationService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    public principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private paginationUtil: JhiPaginationUtil,
    private paginationConfig: PaginationConfig,
    public langue: LanguesService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data["pagingParams"].page;
      this.pagingParams = data["pagingParams"];
      this.previousPage = data["pagingParams"].page;
      this.reverse = data["pagingParams"].ascending;
      this.predicate = data["pagingParams"].predicate;
    });
    this.currentSearch = activatedRoute.snapshot.params["search"]
      ? activatedRoute.snapshot.params["search"]
      : "";
    this.listeAgences = UserData.getInstance().listeAgences;
    if (this.listeAgences.length == 1) {
      this.agence = this.listeAgences[0].codeAgence || UserData.getInstance().agence;
    }
    activatedRoute.queryParams.subscribe((params) => {
      clearDropdown('.chargeDePret .ui.fluid.search.dropdown');
      this.affectations = [];
      this.params = params;
      if (this.params['type'] == 'client') {
        this.createRessource = 'carmesfnmservice/api/client/affectationClient';
        this.title = "de clients";
      } else if (this.params['type'] == 'dossier') {
        this.createRessource = 'carmesfnmservice/api/client/affectationDossier';
        this.title = "de dossiers";
      } else if (this.params['type'] == 'agent') {
        this.createRessource = 'carmesfnmservice/api/sfd/affectationMarchand';
        this.title = "d'agents";
      }
      this.loadAll();
    });
  }
  queryChargeDePret() {
    clearDropdown('.chargeDePret .ui.fluid.search.dropdown');
    this.affectations = [];
    if (!this.agence) return;
    this.affectationService
      .queryCP(this.agence)
      .subscribe(
        (res: ResponseWrapper) => {
          this.charges = res.json;
        },
        (res: ResponseWrapper) => this.onError(res.json)
      );
  }
  ngAfterViewInit() {
    select_init();
  }
  onChargeChange() {
    this.affectations = [];
    this.loadAll();
  }
  loadAll() {
    if (!this.chargeDePret) return;
    this.affectationService
      .queryAffectations(this.params['type'], this.chargeDePret, this.agence)
      .subscribe(
        (res: ResponseWrapper) => {
          this.onSuccess(res.json, res.headers);
        },
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
    this.router.navigate(["/entity", "affectation"], {
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
      "affectation",
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
      "affectation",
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
      }
    ]);
    this.loadAll();
  }
  ngOnInit() {
    this.queryChargeDePret();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInFrais();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Affectation) {
    return item.id;
  }
  registerChangeInFrais() {
    this.eventSubscriber = this.eventManager.subscribe(
      "fraisListModification",
      (response) => {
         select_init();
         this.loadAll();
      });
  }

  sort() {
    const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }

  private onSuccess(data, headers) {
    if (headers.get("link"))
      this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get("X-Total-Count");
    this.queryCount = this.totalItems;
    //this.page = pagingParams.page;
    this.affectations = data;
  }
  private onError(error) {
    error = error || { message: "" };
    this.alertService.error(error.message, null, null);
  }
  deleteAffectation(affectation: any) {
    this.selectedAffectation = affectation;
    modal('.ui.tiny.modal.affectation');
  }
  closeModal() {
    this.selectedAffectation = null;
    modalHide('.ui.tiny.modal.affectation');
  }
  process() {
    this.isProcess = true;
    if (this.selectedAffectation) return;
    this.affectationService.deleteAffectation(this.params['type'], this.chargeDePret, this.selectedAffectation.id).subscribe((res) => {
      this.alertService.success("df", null, null);
      this.isProcess = false;
      this.closeModal();
    }, (err) => {
      this.isProcess = false;
      this.alertService.error("Une erreur s'est produite lors de la suppression", null, null);
      this.closeModal();
    });
  }
  getTypeClientLabel(typeClient: string): string {
    switch (typeClient) {
      case "INDIVIDU": return "INDIVIDU";
      case "MUTUEL": return "GROUPE";
      case "ENTREPRISE": return "ENTREPRISE";
      default: return "";
    }
  }

  getImgSrc(url: string): string {
    return getImgSrc(url);
}

  toDate(date: string): Date {
    return new Date(date);
  }
}
