import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Disponibilite } from './disponibilite.model';
import { DisponibiliteService } from './disponibilite.service';

@Component({
    selector: 'jhi-disponibilite-detail',
    templateUrl: './disponibilite-detail.component.html'
})
export class DisponibiliteDetailComponent implements OnInit, OnDestroy {

    disponibilite: Disponibilite;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private disponibiliteService: DisponibiliteService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDisponibilites();
    }

    load(id) {
        this.disponibiliteService.find(id).subscribe((disponibilite) => {
            this.disponibilite = disponibilite;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDisponibilites() {
        this.eventSubscriber = this.eventManager.subscribe(
            'disponibiliteListModification',
            (response) => this.load(this.disponibilite.id)
        );
    }
}
