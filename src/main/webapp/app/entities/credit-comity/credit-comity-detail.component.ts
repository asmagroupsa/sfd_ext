import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { CreditComity } from './credit-comity.model';
import { CreditComityService } from './credit-comity.service';

@Component({
  selector: 'jhi-credit-comity-detail',
  templateUrl: './credit-comity-detail.component.html',
  styleUrls: [`./credit-comity-detail.component.scss`]
})
export class CreditComityDetailComponent implements OnInit, OnDestroy {
  creditComity: CreditComity;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private creditComityService: CreditComityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInCreditComities();
  }

  load(id) {
    this.creditComityService.find(id).subscribe(creditComity => {
      this.creditComity = creditComity;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInCreditComities() {
    this.eventSubscriber = this.eventManager.subscribe(
      'creditComityListModification',
      response => this.load(this.creditComity.id)
    );
  }
}
