import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { SchoolLevel } from './school-level.model';
import { SchoolLevelService } from './school-level.service';

@Component({
    selector: 'jhi-school-level-detail',
    templateUrl: './school-level-detail.component.html'
})
export class SchoolLevelDetailComponent implements OnInit, OnDestroy {

    schoolLevel: SchoolLevel;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private schoolLevelService: SchoolLevelService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSchoolLevels();
    }

    load(id) {
        this.schoolLevelService.find(id).subscribe((schoolLevel) => {
            this.schoolLevel = schoolLevel;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSchoolLevels() {
        this.eventSubscriber = this.eventManager.subscribe(
            'schoolLevelListModification',
            (response) => this.load(this.schoolLevel.id)
        );
    }
}
