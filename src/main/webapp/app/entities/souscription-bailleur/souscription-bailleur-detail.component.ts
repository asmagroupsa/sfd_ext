import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';
import { SouscriptionBailleur } from './souscription-bailleur.model';
import { SouscriptionBailleurService } from './souscription-bailleur.service';


@Component({
    selector: 'jhi-souscription-bailleur-detail',
    templateUrl: './souscription-bailleur-detail.component.html'
})
export class SouscriptionBailleurDetailComponent implements OnInit, OnDestroy {

    SouscriptionBailleur: SouscriptionBailleur;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private SouscriptionBailleurService: SouscriptionBailleurService,
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
        this.SouscriptionBailleurService.find(id).subscribe((SouscriptionBailleur) => {
            this.SouscriptionBailleur = SouscriptionBailleur;
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
            'SouscriptionBailleurListModification',
            (response) => this.load(this.SouscriptionBailleur.id)
        );
    }
}
