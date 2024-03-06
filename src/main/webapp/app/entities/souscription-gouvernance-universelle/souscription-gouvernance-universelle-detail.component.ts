import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { SouscriptionGouvernanceUniverselle } from './souscription-gouvernance-universelle.model';
import { SouscriptionGouvernanceUniverselleService } from './souscription-gouvernance-universelle.service';


@Component({
    selector: 'jhi-souscription-gouvernance-universelle-detail',
    templateUrl: './souscription-gouvernance-universelle-detail.component.html'
})
export class SouscriptionGouvernanceUniverselleDetailComponent implements OnInit, OnDestroy {

    SouscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private SouscriptionGouvernanceUniverselleService: SouscriptionGouvernanceUniverselleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSouscriptionGouvernanceUniverselleS();
    }

    load(id) {
        this.SouscriptionGouvernanceUniverselleService.find(id).subscribe((SouscriptionGouvernanceUniverselle) => {
            this.SouscriptionGouvernanceUniverselle = SouscriptionGouvernanceUniverselle;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSouscriptionGouvernanceUniverselleS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'SouscriptionGouvernanceUniverselleListModification',
            (response) => this.load(this.SouscriptionGouvernanceUniverselle.id)
        );
    }
}
