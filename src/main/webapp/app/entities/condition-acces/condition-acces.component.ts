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

import { ConditionAcces } from "./condition-acces.model";
import { ConditionAccesService } from "./condition-acces.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { CategorieConditionService } from "../categorie-condition/categorie-condition.service";
import { CategorieCondition } from "../categorie-condition/categorie-condition.model";

@Component({
  selector: "jhi-condition-acces",
  templateUrl: "./condition-acces.component.html"
})
export class ConditionAccesComponent implements OnInit, OnDestroy {
  categorieconditions: any;
  currentAccount: any;
  conditionAcces: ConditionAcces[];
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
  predicate: any;
  previousPage: any;
  reverse: any;

  constructor(
    private conditionAccesService: ConditionAccesService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    private principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private paginationUtil: JhiPaginationUtil,
    private paginationConfig: PaginationConfig,
    private categorieConditionService: CategorieConditionService,
    public langue: LanguesService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data["pagingParams"].page;
      this.previousPage = data["pagingParams"].page;
      this.reverse = data["pagingParams"].ascending;
      this.predicate = data["pagingParams"].predicate;
    });
    this.currentSearch = activatedRoute.snapshot.params["search"]
      ? activatedRoute.snapshot.params["search"]
      : "";
  }

  loadAll() {
    if (this.currentSearch) {
      this.conditionAccesService
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
    }
    this.conditionAccesService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
        (res: ResponseWrapper) => this.onError(res.json)
      );
  }
  categorieCondition(id: any) {
    if (!this.categorieconditions) return new CategorieCondition();

    return this.categorieconditions.find(
      categoriecondition => categoriecondition.id == id
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
    this.router.navigate(["/entity", "condition-acces"], {
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
      "condition-acces",
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
      "condition-acces",
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
    this.categorieConditionService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.categorieconditions = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInConditionAcces();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ConditionAcces) {
    return item.id;
  }
  registerChangeInConditionAcces() {
    this.eventSubscriber = this.eventManager.subscribe(
      "conditionAccesListModification",
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
    // this.page = pagingParams.page;
    this.conditionAcces = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
