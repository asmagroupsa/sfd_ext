import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';
import { SouscriptionSfd } from './souscription-sfd.model';
import { SouscriptionSfdService } from './souscription-sfd.service';


@Component({
    selector: 'jhi-souscription-sfd-detail',
    templateUrl: './souscription-sfd-detail.component.html'
})
export class SouscriptionSfdDetailComponent implements OnInit, OnDestroy {

    SouscriptionSfd: SouscriptionSfd;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private SouscriptionSfdService: SouscriptionSfdService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSouscriptionBailleurS();
    }

    load(id) {
        this.SouscriptionSfdService.find(id).subscribe((SouscriptionSfd) => {
            this.SouscriptionSfd = SouscriptionSfd;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSouscriptionBailleurS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'SouscriptionSfdListModification',
            (response) => this.load(this.SouscriptionSfd.id)
        );
    }
}
