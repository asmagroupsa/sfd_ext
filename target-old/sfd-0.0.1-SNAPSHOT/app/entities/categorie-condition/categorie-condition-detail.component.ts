import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CategorieCondition } from './categorie-condition.model';
import { CategorieConditionService } from './categorie-condition.service';

@Component({
    selector: 'jhi-categorie-condition-detail',
    templateUrl: './categorie-condition-detail.component.html'
})
export class CategorieConditionDetailComponent implements OnInit, OnDestroy {

    categorieCondition: CategorieCondition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categorieConditionService: CategorieConditionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategorieConditions();
    }

    load(id) {
        this.categorieConditionService.find(id).subscribe((categorieCondition) => {
            this.categorieCondition = categorieCondition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategorieConditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categorieConditionListModification',
            (response) => this.load(this.categorieCondition.id)
        );
    }
}
