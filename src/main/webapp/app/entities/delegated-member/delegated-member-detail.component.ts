import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { DelegatedMember } from './delegated-member.model';
import { DelegatedMemberService } from './delegated-member.service';

@Component({
    selector: 'jhi-delegated-member-detail',
    templateUrl: './delegated-member-detail.component.html'
})
export class DelegatedMemberDetailComponent implements OnInit, OnDestroy {

    delegatedMember: DelegatedMember;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private delegatedMemberService: DelegatedMemberService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDelegatedMembers();
    }

    load(id) {
        this.delegatedMemberService.find(id).subscribe((delegatedMember) => {
            this.delegatedMember = delegatedMember;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDelegatedMembers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'delegatedMemberListModification',
            (response) => this.load(this.delegatedMember.id)
        );
    }
}
