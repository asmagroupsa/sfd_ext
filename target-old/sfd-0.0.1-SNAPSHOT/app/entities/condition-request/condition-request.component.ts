import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JhiAlertService } from 'ng-jhipster';

import { ResponseWrapper, UserData } from '../../shared';
import { getNewItems } from '../../shared/model/functions';
import { getUniqueId } from '../../shared/model/request-util';
import { StateService } from '../../shared/state/statistiques';
import { ClientConditionNote } from '../client-condition-note/client-condition-note.model';
import { ClientConditionNoteService } from '../client-condition-note/client-condition-note.service';
import { ClientConditionValue } from '../client-condition-value/client-condition-value.model';
import { ClientConditionValueService } from '../client-condition-value/client-condition-value.service';
import { Client } from '../client/client.model';
import { ClientService } from '../client/client.service';
import { clientConditionNote, produit } from '../entity.module';
import { Produit } from '../produit/produit.model';
import { ProduitService } from '../produit/produit.service';
import { ConditionRequest } from './condition-request.model';
import { ConditionRequestService } from './condition-request.service';

declare let jQuery: any;
declare let select_init: any;
declare let select_tab: any;
@Component({
    selector: 'jhi-condition-request',
    templateUrl: './condition-request.component.html'
})
export class ConditionsComponent implements OnInit {
    product: Produit;
    conditionsValeurs: any[] = [];
    notes: any[] = [];
    isSaving: boolean;
    current: number = 0;
    total: number = 0;
    conditions: any[] = [];
    clients: Client[];
    produits: Produit[] = [];
    produit: Produit = new Produit();
    classes: any = {};
    message: string = '';
    condition: ConditionRequest = new ConditionRequest();

    constructor(
        private clientService: ClientService,
        private produitService: ProduitService,
        private alertService: JhiAlertService,
        private clientConditionNote: ClientConditionNoteService,
        private clientConditionValue: ClientConditionValueService,
        private stateService: StateService,
        private conditionRequestService: ConditionRequestService,
        private router: Router
    ) { }
    ngAfterViewInit() {
        this.onSelectInit();
        select_tab();
    }
    onSelectInit() {
        select_init((search, id) => {
            if (id == 'field_produit2') {
                this.produitService.query({ NO_QUERY: false, 'libelle.contains': search }).subscribe(
                    (res: ResponseWrapper) => {
                        this.produits = this.produits.concat(getNewItems(this.produits, res.json));
                    },
                    (res: ResponseWrapper) => { }
                );
            }
        });
    }
    controlForm(editForm: NgForm) {
        this.current = 0;
        this.conditions.forEach(condition => {
            this.current += parseInt(condition['valeur'], 10);
        });
        return false;
    }
    onProduitChange(flag: boolean = false) {
        this.condition.clientId = null;
        this.product = this.produits.find(produit => {
            return produit.id == this.condition.produitId;
        });

        let etat = flag ? 'AVEC_CONDITION_SANS_REQUEST' : 'SANS_CONDITION';
        this.total = 0;
        this.current = 0;
        this.conditionRequestService
            .listeConditionsProduit(this.condition.produitId)
            .subscribe((res: ResponseWrapper) => {
                let conditionsListe = res.json;
                let ids = conditionsListe.map(condition => {
                    return condition.id;
                });
                if (!ids && !ids.length) return;
                this.conditionRequestService
                    .listeConditions(ids.join(','))
                    .subscribe((res: ResponseWrapper) => {
                        this.conditions = res.json;
                    });
            });
        this.conditionRequestService
            .queryClientSansCondition(this.condition.produitId, etat)
            .subscribe((res: ResponseWrapper) => {
                jQuery('.client .ui.dropdown div.text').html('');
                jQuery('.note .ui.dropdown div.text').html('');
                this.conditionsValeurs = [];
                this.clients = res.json;
                this.condition.clientId = this.clients.length
                    ? this.clients[0].id
                    : null;
            });
        this.onSelectInit();
    }
    initialize() {
        jQuery(
            '.client .ui.dropdown div.text,.produit .ui.dropdown div.text'
        ).html('');
        this.clients = [];
        this.conditions = [];
        this.current = 0;
        this.total = 0;
        this.produit = new Produit();
        this.condition = new ConditionRequest();
        this.conditionsValeurs = [];
        this.notes = [];
    }
    loadAll() {
        this.produitService
            .getFnmAndSfdProduits({ NO_QUERY: true }, ['CREDIT', 'LIGNE_PRODUIT', 'LIGNE_CREDIT'])
            .then((produits: Produit[]) => {
                this.produits = produits;
            });
    }
    ngOnInit() {
        this.loadAll();
    }
    save() {
        if (this.product.noteMinConditionAcces > this.current || !this.conditions.length) {
            return;
        }
        this.isSaving = true;
        let code = getUniqueId('note', this.condition.clientId);
        this.conditionRequestService
            .verificationNoteClient(
                this.condition.produitId,
                this.condition.clientId
            )
            .subscribe((res: any) => {
                if ((res.json.resultat = 'OK')) {
                    let conditionNote: ClientConditionNote = new ClientConditionNote();
                    conditionNote.produitId = this.condition.produitId;
                    conditionNote.clientId = this.condition.clientId;
                    conditionNote.noteMin =
                        this.produit.noteMinConditionAcces || 0;
                    conditionNote.note = this.current;
                    conditionNote.code = code;
                    conditionNote.agenceReference = UserData.getInstance().agencesReference[0];
                    let conditionValue: ClientConditionValue;
                    for (
                        var index = 0;
                        index < this.conditions.length;
                        index++
                    ) {
                        conditionValue = new ClientConditionValue();
                        conditionValue.produitId = this.condition.produitId;
                        conditionValue.clientId = this.condition.clientId;
                        conditionValue.conditionId = this.conditions[index].id;
                        conditionValue.conditionValeur = this.conditions[index][
                            'valeur'
                        ];
                        let el = this.conditions[index].elements.find((e)=>{
                            return e.valeur == conditionValue.conditionValeur;
                        });
                        conditionValue['elementId'] = el?el.id:null;
                        conditionValue.codeNote = code;
                        conditionValue.agenceReference = UserData.getInstance().agencesReference[0];
                        ((index: number) => {
                            this.clientConditionValue
                                .create(conditionValue)
                                .subscribe(
                                    (res: any) => {
                                        if (
                                            index + 1 ==
                                            this.conditions.length
                                        ) {
                                            this.clientConditionNote
                                                .create(conditionNote)
                                                .subscribe(
                                                    (res: any) => {
                                                        this.isSaving = false;
                                                        this.alertService.success(
                                                            'Les conditions du client sont bien enrégistré',
                                                            null
                                                        );
                                                        jQuery(
                                                            '.ui.menu a.item'
                                                        )
                                                            .first()
                                                            .click();
                                                    },
                                                    () => {
                                                        this.alertService.error(
                                                            "Une erreur s'est produite lors de l'enregistrement",
                                                            null,
                                                            null
                                                        );
                                                    }
                                                );
                                        }
                                    },
                                    () => {
                                        index = this.conditions.length;
                                        this.alertService.error(
                                            "Une erreur s'est produite lors de l'enregistrement",
                                            null,
                                            null
                                        );
                                    }
                                );
                        })(index);
                    }
                } else {
                    this.alertService.error(
                        "Une erreur s'est produite lors de l'enregistrement",
                        null,
                        null
                    );
                }
                this.clients = [];
                this.condition.produitId = null;
                jQuery('.client .ui.dropdown div.text').html('');
                jQuery('.produit .ui.dropdown div.text').html('');
            });
    }
    onNoteChange() {
        this.conditionsValeurs = [];
        if (this.condition.note.code) {
            this.conditionRequestService
                .listeValeursConditionsNote(this.condition.note.code)
                .subscribe((res: ResponseWrapper) => {
                    this.conditionsValeurs = res.json;
                });
        }
    }
    onClientChange() {
        jQuery('.note .ui.dropdown div.text').html('');
        this.notes = [];
        this.conditionsValeurs = [];
        this.conditionRequestService
            .listeNoteClientProduit(
                this.condition.produitId,
                this.condition.clientId
            )
            .subscribe((res: ResponseWrapper) => {
                jQuery('.note .ui.dropdown div.text').html('');
                this.condition.note = null;
                this.notes = res.json;
            });
    }
    print() {
        this.stateService.save('.recapitulatif', 'tableau-recap-client');
    }
}
