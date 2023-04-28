import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OperationCaisse } from './operation-caisse.model';
import { OperationCaissePopupService } from './operation-caisse-popup.service';
import { OperationCaisseService } from './operation-caisse.service';
import { ResponseWrapper, LOCAL_FLAG, UserData, getNewItems } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Profession, ProfessionService } from '../profession';
import { Nationality, NationalityService } from '../nationality';
import { ProduitService } from '../produit';
import { TypeClient, TypeClientService } from '../type-client';
import { CaisseNouvelleService } from '../caisse-nouvelle';
declare let select_init: any;
@Component({
    selector: 'jhi-operation-caisse-dialog',
    templateUrl: './operation-caisse-dialog.component.html'
})
export class OperationCaisseDialogComponent implements OnInit {
    operationCaisse: OperationCaisse;
    authorities: any[];
    isSaving: boolean;
    professions: Profession[];

    typeclients: TypeClient[];;
    type: any;
    params: any;

    nationalities: Nationality[];
    caisseNouvelles: any[];
    produits: any[];
    agences = [];

    loadingArray = {
        profession: false,
        nationality: false,
        country: false,
        produit: false,
    };
    isDecaissement: boolean = false;
    isEncaissement: boolean = false;
    isVirement: boolean = false;
    isDepot: boolean = false;
    isRetrait: boolean = false;
    isEpargne: boolean = false;


    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private operationCaisseService: OperationCaisseService,
        private professionService: ProfessionService,
        private nationalityService: NationalityService,
        private produitService: ProduitService,
        private typeClientService: TypeClientService,
        private caisseNouvelleService: CaisseNouvelleService,
        private eventManager: JhiEventManager,
        public langue: LanguesService,
        private activatedRoute: ActivatedRoute,
    ) {

        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
            if (params['type'] == 'VIREMENT') {
                this.isVirement = true;
                this.type = { id: 1, code: 'VIREMENT', name: 'Virement caisse à caisse' };
            } else if (params['type'] == 'DEPOT') {
                this.isDepot = true;
                this.type = { id: 2, code: 'DEPOT', name: 'Dépôts' };
            } else if (params['type'] == 'RETRAIT') {
                this.isRetrait = true;
                this.type = { id: 3, code: 'RETRAIT', name: 'Retraits' }
            } else if (params['type'] == 'COMPTEEPARGNE') {
                this.isEpargne = true;
                this.type = { id: 4, code: 'COMPTEEPARGNE', name: 'Ouverture compte épargne' };
            } else if (params['type'] == 'ENCAISSEMENT') {
                this.isEncaissement = true;
                this.type = { id: 5, code: 'ENCAISSEMENT', name: 'Encaissement Divers' };
            } else if (params['type'] == 'DECAISSEMENT') {
                this.isDecaissement = true;
                this.type = { id: 6, code: 'DECAISSEMENT', name: 'Décaissement Divers' }
            }
        });
    }
    ngAfterViewInit() {
        select_init((query, id) => {
            if (id === 'produit_id') {
                // this.produitService.query({
                //     NO_QUERY: false,
                //     'libelle.contains': query,
                //     'typeProduit.in': 'CREDIT,LIGNE_PRODUIT',
                //     'sfdReference.equals': 'FNM',
                //     'sfdReference.specified': 'false',
                //     'condition': 'OR',
                // }).subscribe(
                //     (res: ResponseWrapper) => {
                //         this.produits = this.produits.concat(getNewItems(this.produits, res.json));
                //         this.loadingArray.produit = false;
                //     },
                //     (res: ResponseWrapper) => { }
                // );
            } else if (id === 'field_profession') {
                this.professionService.query({ NO_QUERY: false, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.professions = this.professions.concat(getNewItems(this.professions, res.json));
                        this.loadingArray.profession = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_nationality') {
                this.nationalityService.query({ NO_QUERY: false, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.nationalities = this.nationalities.concat(getNewItems(this.nationalities, res.json));
                        this.loadingArray.nationality = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            }
        });
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.agences = UserData.getInstance().listeAgences;
        console.log(this.agences);


        if (this.agences.length == 1) {
            this.operationCaisse.agenceReference = this.agences[0].codeAgence;
        }

        this.caisseNouvelleService.queryTest().subscribe(
            (res: ResponseWrapper) => {
                this.caisseNouvelles = res.json;
                console.log(res.json);
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.professionService.query().subscribe(
            (res: ResponseWrapper) => {
                this.professions = res.json;
                this.loadingArray.profession = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.nationality = true;
        this.nationalityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.nationalities = res.json;
                console.log(res.json);

                this.loadingArray.nationality = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.produit = true;
        this.produitService.getGroupProduits().subscribe((produits) => {
            this.produits = produits;
            console.log(produits);
            console.log('produits');
            console.log(this.produits);

            this.loadingArray.produit = false;
        });

        /* this.loadingArray.produit = true;
        this.produitService.getGroupProduits().subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;
                console.log( res.json);

                this.loadingArray.produit = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        ); */


        this.typeClientService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.typeclients = res.json;
                console.log(res.json);
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        /* this.isSaving = true;
        if (this.operationCaisse.id !== undefined) {
            this.subscribeToSaveResponse(
                this.operationCaisseService.update(this.operationCaisse),
                false
            );
        } else {
            this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.create(this.operationCaisse),
                true
            );
        } */
        if (this.type.code == 'VIREMENT') {
            // this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.virementCaisseToCaisse(this.operationCaisse),
                true
            );
        } else if (this.type.code == 'DEPOT') {
            // this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.depotCaisse(this.operationCaisse),
                true
            );
        } else if (this.type.code == 'RETRAIT') {
            // this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.retraitCaisse(this.operationCaisse),
                true
            );
        } else if (this.type.code == 'COMPTEEPARGNE') {
            // this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.ouvertureCompteEpargne(this.operationCaisse),
                true
            );
        } else if (this.type.code == 'ENCAISSEMENT') {
            // this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.encaissement(this.operationCaisse),
                true
            );
        } else if (this.type.code == 'DECAISSEMENT') {
            // this.operationCaisse.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationCaisseService.decaissement(this.operationCaisse),
                true
            );
        }
    }

    private subscribeToSaveResponse(
        result: Observable<OperationCaisse>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: OperationCaisse) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: OperationCaisse, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.operationCaisse.created' : 'carmesfnmserviceApp.operationCaisse.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'operationCaisseListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-operation-caisse-popup',
    template: ''
})
export class OperationCaissePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private operationCaissePopupService: OperationCaissePopupService
    ) { }

    /* ngOnInit() {
        let type: any = this.route.snapshot.queryParams['type'];
        // if (LOCAL_FLAG) {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.operationCaissePopupService.open(
                    OperationCaisseDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.operationCaissePopupService.open(
                    OperationCaisseDialogComponent as Component
                );
            }
        });
        // } else {
        //   window.history.back();
        // }
    } */

    ngOnInit() {
        let type: any = this.route.snapshot.queryParams['type'];
        if (!type || ['VIREMENT', 'DEPOT', 'RETRAIT', 'COMPTEEPARGNE',
            'ENCAISSEMENT', 'DECAISSEMENT'].indexOf(type) == -1) {
            window.history.back();
        } else {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.operationCaissePopupService.open(
                        OperationCaisseDialogComponent as Component,
                        params['id']
                    );
                } else {
                    console.log('I am here');

                    this.modalRef = this.operationCaissePopupService.open(
                        OperationCaisseDialogComponent as Component
                    );
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub)
            this.routeSub.unsubscribe();
    }
}
