import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from '../shared/state/statistiques';
import { LanguesService } from '../shared/myTranslation/langues';
import { ClientService } from '../entities/client';
import { AgenceService } from '../entities/agence';
import { CreditService } from '../entities/credit';
import { CreditRequestService } from '../entities/credit-request';
import { AuditsService } from './audits.service';
import { SFDService } from '../entities/s-fd';




@Component({
    selector: 'jhi-home',
    templateUrl: './audits.component.html',
    styleUrls: ['audits.scss', '../shared/state/state.scss']
})
export class AuditsComponent implements OnInit {
    routeSub: any;
    public printAsPdf(printArea): void {
        this.statistique.printAsPdf(printArea);
    }
 
    private scrollTimeoutId;

 
    constructor(
        private route: ActivatedRoute,
        public homeService: AuditsService,
        public principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private router: Router,
        private statistique: StateService,
        public langue: LanguesService,
    ) {
    }


    scrollPageMethod() {
        let scrollStep = 50;
        let timeToScroll = Math.floor(window.innerHeight / scrollStep) - 1;
        let scroll = (index) => {
            window.scrollTo(0, index * scrollStep);
            if (index >= timeToScroll) {
                window.scrollTo(0, 0);
                clearTimeout(this.scrollTimeoutId);
                this.scrollPageMethod();
            }
        }
        for (let index = 1; index <= timeToScroll; index++) {
            this.scrollTimeoutId = setTimeout(() => {
                scroll(index);
            }, 3000 * index);
        }
    }

    ngOnDestroy() {
        clearTimeout(this.scrollTimeoutId);
        this.routeSub.unsubscribe();
    }
    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            /*  this.isLoggedIn(); */
        });
        
       

    }



 

 
    ngAfterViewInit() {
        this.scrollPageMethod();
        let resetTimer = () => {
            clearTimeout(this.scrollTimeoutId);
            this.scrollPageMethod();
        }
        window.onmousemove = resetTimer; // catches mouse movements
        window.onmousedown = resetTimer; // catches mouse movements
        window.onclick = resetTimer; // catches mouse clicks
        window.onscroll = resetTimer; // catches scrolling
        window.onkeypress = resetTimer;
    }

}
