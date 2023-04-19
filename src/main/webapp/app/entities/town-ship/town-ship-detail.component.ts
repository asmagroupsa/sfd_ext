import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TownShip } from './town-ship.model';
import { TownShipService } from './town-ship.service';

@Component({
    selector: 'jhi-town-ship-detail',
    templateUrl: './town-ship-detail.component.html'
})
export class TownShipDetailComponent implements OnInit, OnDestroy {

    townShip: TownShip;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private townShipService: TownShipService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTownShips();
    }

    load(id) {
        this.townShipService.find(id).subscribe((townShip) => {
            this.townShip = townShip;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTownShips() {
        this.eventSubscriber = this.eventManager.subscribe(
            'townShipListModification',
            (response) => this.load(this.townShip.id)
        );
    }
}
