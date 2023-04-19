import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Budget } from './budget.model';
import { BudgetService } from './budget.service';

@Component({
    selector: 'jhi-budget-detail',
    templateUrl: './budget-detail.component.html'
})
export class BudgetDetailComponent implements OnInit, OnDestroy {

    budget: Budget;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private budgetService: BudgetService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBudgets();
    }

    load(id) {
        this.budgetService.find(id).subscribe((budget) => {
            this.budget = budget;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBudgets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'budgetListModification',
            (response) => this.load(this.budget.id)
        );
    }
}
