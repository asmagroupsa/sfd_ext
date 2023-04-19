import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CategorieProduit } from './categorie-produit.model';
import { CategorieProduitService } from './categorie-produit.service';

@Component({
    selector: 'jhi-categorie-produit-detail',
    templateUrl: './categorie-produit-detail.component.html'
})
export class CategorieProduitDetailComponent implements OnInit, OnDestroy {

    categorieProduit: CategorieProduit;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categorieProduitService: CategorieProduitService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategorieProduits();
    }

    load(id) {
        this.categorieProduitService.find(id).subscribe((categorieProduit) => {
            this.categorieProduit = categorieProduit;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategorieProduits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categorieProduitListModification',
            (response) => this.load(this.categorieProduit.id)
        );
    }
}
