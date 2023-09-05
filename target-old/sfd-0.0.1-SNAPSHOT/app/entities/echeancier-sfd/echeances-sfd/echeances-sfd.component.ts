import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";

import { EcheancesSFD } from "./echeances-sfd.model";
import { EcheancesSFDService } from "./echeances-sfd.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../../shared";
import { PaginationConfig } from "../../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../../shared/myTranslation/langues";
import { EcheancierSFDService } from "../echeancier-sfd.service";
import { EcheancierSFD } from "../echeancier-sfd.model";

@Component({
  selector: "jhi-echeances-sfd",
  templateUrl: "./echeances-sfd.component.html"
})
export class EcheancesSFDComponent implements OnInit, OnDestroy {
  echeancier: EcheancierSFD;
  _id_echeancier: number;
  currentAccount: any;
  echeancesSFDS: EcheancesSFD[];
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

  constructor(
    private echeancesSFDService: EcheancesSFDService,
    private echeancierSFDService: EcheancierSFDService,
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
  }

  @Input()
  get idEcheancier() {
    return this._id_echeancier;
  }

  set idEcheancier(id: number) {
    this._id_echeancier = id;
    this.echeancierSFDService.find(this._id_echeancier).subscribe(
      (res: EcheancierSFD) => {
        this.echeancier = res;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }
  loadAll() {
    if (this.currentSearch) {
      /* this.echeancesSFDService
        .search({
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe(
          (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
          (res: ResponseWrapper) => this.onError(res.json)
        ); */
      return;
    }
    this.echeancierSFDService
      .find(this.idEcheancier)
      .subscribe(
        (res: EcheancesSFD) => (this.echeancier = res),
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
    this.router.navigate(["/entity", "echeances-sfd"], {
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
      "echeances-sfd",
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
      "echeances-sfd",
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
      }
    ]);
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInEcheancesSFDS();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: EcheancesSFD) {
    return item.id;
  }
  registerChangeInEcheancesSFDS() {
    this.eventSubscriber = this.eventManager.subscribe(
      "echeancesSFDListModification",
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
    if (headers.get("link"))
      this.links = this.parseLinks.parse(headers.get("link"));
    this.totalItems = headers.get("X-Total-Count");
    this.queryCount = this.totalItems;
    if (this.pagingParams && this.pagingParams.page) {
      //this.page = this.pagingParams.page;
    }
    this.echeancesSFDS = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
