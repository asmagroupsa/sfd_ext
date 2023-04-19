import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ConditionRequest } from './condition-request.model';
import { ConditionRequestService } from './condition-request.service';

@Component({
  selector: 'jhi-condition-request-detail',
  templateUrl: './condition-request-detail.component.html'
})
export class ConditionsDetailComponent implements OnInit, OnDestroy {
  conditions: ConditionRequest;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private conditionsService: ConditionRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInConditions();
  }

  load(id) {
    this.conditionsService.find(id).subscribe(conditions => {
      this.conditions = conditions;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInConditions() {
    this.eventSubscriber = this.eventManager.subscribe(
      'conditionsListModification',
      response => this.load(this.conditions.id)
    );
  }
}
