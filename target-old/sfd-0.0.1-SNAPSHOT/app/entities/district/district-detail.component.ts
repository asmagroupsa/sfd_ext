import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { District } from './district.model';
import { DistrictService } from './district.service';

@Component({
    selector: 'jhi-district-detail',
    templateUrl: './district-detail.component.html'
})
export class DistrictDetailComponent implements OnInit, OnDestroy {

    district: District;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private districtService: DistrictService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDistricts();
    }

    load(id) {
        this.districtService.find(id).subscribe((district) => {
            this.district = district;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDistricts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'districtListModification',
            (response) => this.load(this.district.id)
        );
    }
}
