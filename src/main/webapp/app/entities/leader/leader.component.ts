import { ClientService } from "../client/client.service";
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

import { Leader } from "./leader.model";
import { LeaderService } from "./leader.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { Client } from "../client/client.model";
import { getNewItems } from "../../shared/model/functions";

@Component({
  selector: "jhi-leader",
  templateUrl: "./leader.component.html"
})
export class LeaderComponent implements OnInit, OnDestroy {
  clients: Client[];
  currentAccount: any;
  leaders: Leader[] = [];
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
    private leaderService: LeaderService,
    private clientService: ClientService,
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

  loadAll() {
    if (this.currentSearch) {
      this.leaderService
        .query({
          'name.contains': this.currentSearch,
          'condition': 'OR',
          'firstName.contains': this.currentSearch,
          'phone.contains': this.currentSearch,
          'email.contains': this.currentSearch,
          'title.contains': this.currentSearch,
          sort: this.sort()
        })
        .subscribe(
          (res: ResponseWrapper) => {
            this.leaders = this.leaders.concat(getNewItems(this.leaders, res.json))
          },
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.leaderService
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
    //this.page = page;
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(["/entity", "leader"], {
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
      "leader",
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
      "leader",
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
      }
    ]);
    this.loadAll();
  }
  ngOnInit() {
    this.clientService.query().subscribe((clients: ResponseWrapper) => {
      let json: Client[] = clients.json;
      this.clients = json.filter((client: Client) => {
        // il faut afficher que ceux qui sont entreprise
        return true;
      });
    });
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInLeaders();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Leader) {
    return item.id;
  }
  registerChangeInLeaders() {
    this.eventSubscriber = this.eventManager.subscribe(
      "leaderListModification",
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
    this.leaders = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
