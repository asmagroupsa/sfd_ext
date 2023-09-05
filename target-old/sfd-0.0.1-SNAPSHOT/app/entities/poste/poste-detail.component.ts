import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Poste } from './poste.model';
import { PosteService } from './poste.service';

@Component({
    selector: 'jhi-poste-detail',
    templateUrl: './poste-detail.component.html'
})
export class PosteDetailComponent implements OnInit, OnDestroy {

    poste: Poste;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private posteService: PosteService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPostes();
    }

    load(id) {
        this.posteService.find(id).subscribe((poste) => {
            this.poste = poste;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPostes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'posteListModification',
            (response) => this.load(this.poste.id)
        );
    }
}
