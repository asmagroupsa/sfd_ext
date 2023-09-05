import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Validation } from './validation.model';
import { ValidationService } from './validation.service';

@Component({
    selector: 'jhi-validation-detail',
    templateUrl: './validation-detail.component.html'
})
export class ValidationDetailComponent implements OnInit, OnDestroy {

    validation: Validation;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private validationService: ValidationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInValidations();
    }

    load(id) {
        this.validationService.find(id).subscribe((validation) => {
            this.validation = validation;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInValidations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'validationListModification',
            (response) => this.load(this.validation.id)
        );
    }
}
