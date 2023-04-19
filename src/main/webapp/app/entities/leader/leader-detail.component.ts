import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Leader } from './leader.model';
import { LeaderService } from './leader.service';

@Component({
    selector: 'jhi-leader-detail',
    templateUrl: './leader-detail.component.html'
})
export class LeaderDetailComponent implements OnInit, OnDestroy {

    leader: Leader;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private leaderService: LeaderService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLeaders();
    }

    load(id) {
        this.leaderService.find(id).subscribe((leader) => {
            this.leader = leader;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLeaders() {
        this.eventSubscriber = this.eventManager.subscribe(
            'leaderListModification',
            (response) => this.load(this.leader.id)
        );
    }
}
