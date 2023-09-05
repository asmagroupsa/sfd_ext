import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";

import { Annee } from "./guichet.model";
import { AnneeService } from "./guichet.service";

@Component({
  selector: "jhi-guichet-detail",
  templateUrl: "./guichet-detail.component.html"
})
export class AnneeDetailComponent implements OnInit, OnDestroy {
  annee: Annee;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private anneeService: AnneeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params["id"]);
    });
    this.registerChangeInAnnees();
  }

  load(id) {
    this.anneeService.find(id).subscribe(annee => {
      this.annee = annee;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInAnnees() {
    this.eventSubscriber = this.eventManager.subscribe(
      "anneeListModification",
      response => this.load(this.annee.id)
    );
  }
}
