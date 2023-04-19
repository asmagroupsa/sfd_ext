import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Caisse } from './caisse.model';
import { CaisseCentraleService } from './caisse.service';

@Component({
  selector: 'jhi-caisse-detail',
  templateUrl: './caisse-detail.component.html'
})
export class CaisseDetailComponent implements OnInit, OnDestroy {
  caisse: Caisse;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private caisseService: CaisseCentraleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInCaisses();
  }

  load(id) {
    this.caisseService.find(id).subscribe(caisse => {
      this.caisse = caisse;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInCaisses() {
    this.eventSubscriber = this.eventManager.subscribe(
      'caisseListModification',
      response => this.load(this.caisse.id)
    );
  }
}
