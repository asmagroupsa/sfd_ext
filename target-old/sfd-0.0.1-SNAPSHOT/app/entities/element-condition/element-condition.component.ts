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

import { ElementCondition } from "./element-condition.model";
import { ElementConditionService } from "./element-condition.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { ConditionAccesService } from "../condition-acces/condition-acces.service";
import { ConditionAcces } from "../condition-acces/condition-acces.model";
@Component({
  selector: "jhi-element-condition",
  templateUrl: "./element-condition.component.html"
})
export class ElementConditionComponent implements OnInit, OnDestroy {
  conditionacces: any[];
  currentAccount: any;
  elementConditions: ElementCondition[];
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
    private elementConditionService: ElementConditionService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    private principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private paginationUtil: JhiPaginationUtil,
    private paginationConfig: PaginationConfig,
    private conditionAccesService: ConditionAccesService,
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
  condition(id: any) {
    if (!this.conditionacces) return new ConditionAcces();

    return this.conditionacces.find(condition => condition.id == id);
  }
  loadAll() {
    if (this.currentSearch) {
      this.elementConditionService
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
    this.elementConditionService
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
  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(["/entity", "element-condition"], {
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
      "element-condition",
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
      "element-condition",
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
    this.conditionAccesService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.conditionacces = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInElementConditions();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ElementCondition) {
    return item.id;
  }
  registerChangeInElementConditions() {
    this.eventSubscriber = this.eventManager.subscribe(
      "elementConditionListModification",
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
    this.elementConditions = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
