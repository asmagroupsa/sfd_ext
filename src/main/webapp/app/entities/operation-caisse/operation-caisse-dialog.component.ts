import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OperationCaisse } from './operation-caisse.model';
import { OperationCaissePopupService } from './operation-caisse-popup.service';
import { OperationCaisseService } from './operation-caisse.service';
import { ResponseWrapper, UserData, getNewItems } from '../../shared';
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
    operationCaisse: OperationCaisse = new OperationCaisse();
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

    maxDate = { year: new Date().getFullYear() - 18, month: 12, day: 31 };
    minDate = { year: this.maxDate.year - 82, month: 1, day: 1 };

    isDecaissement: boolean = false;
    isEncaissement: boolean = false;
    isVirement: boolean = false;
    isDepot: boolean = false;
    isRetrait: boolean = false;
    isEpargne: boolean = false;
    isDat: boolean = false;
    titre: string;
    caisseName: string;


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
            this.operationCaisse.agenceReference = this.params.agence;
            this.caisseName = this.params.caisseName;
            this.operationCaisse.comptecarmescaisseenvoi = this.params.caisse;
            this.operationCaisse.comptecarmescaisse = this.params.caisse;

            if (params['type'] == 'VIREMENT') {
                this.titre = "Virement de caisse à caisse";
                this.isVirement = true;
                this.type = { id: 1, code: 'VIREMENT', name: 'Virement caisse à caisse' };
            } else if (params['type'] == 'DEPOT') {
                this.titre = "Opération de dépôt à la caisse";
                this.isDepot = true;
                this.type = { id: 2, code: 'DEPOT', name: 'Dépôts' };
            } else if (params['type'] == 'RETRAIT') {
                this.titre = "Opération de retrait à la caisse";
                this.isRetrait = true;
                this.type = { id: 3, code: 'RETRAIT', name: 'Retraits' }
            } else if (params['type'] == 'COMPTEEPARGNE') {
                this.titre = "Ouverture de compte Epargne";
                this.isEpargne = true;
                this.type = { id: 4, code: 'COMPTEEPARGNE', name: 'Ouverture compte épargne' };
            } else if (params['type'] == 'COMPTEDAT') {
                this.titre = "Ouverture de compte DAT";
                this.isDat = true;
                this.type = { id: 44, code: 'COMPTEDAT', name: 'Ouverture compte DAT' };
            } else if (params['type'] == 'ENCAISSEMENT') {
                this.titre = "Encaissement à la caisse";
                this.isEncaissement = true;
                this.type = { id: 5, code: 'ENCAISSEMENT', name: 'Encaissement Divers' };
            } else if (params['type'] == 'DECAISSEMENT') {
                this.titre = "Décaissement à la caisse";
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



        if (this.agences.length == 1) {
            this.operationCaisse.agenceReference = this.agences[0].codeAgence;
        }

        this.caisseNouvelleService.queryTest('').subscribe(
            (res: ResponseWrapper) => {
                this.caisseNouvelles = res.json;

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

                this.loadingArray.nationality = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.produit = true;
        this.produitService.getGroupProduits().subscribe((produits) => {
            //this.produits = produits;

            let prodArray = [];

            console.log(this.produits);
            produits.forEach(element => {
                if(this.isEpargne){
                    if(!(/Epargne/i.test(element.libelle)))
                    return ;
                } else if(this.isDat){
                    if(!(/Dat/i.test(element.libelle)))
                    return ;
                }
                //console.log(element.libelle);
                let prod = {
                    id: element.id,
                    libelle: element.libelle
                }
                prodArray.push(prod);

            });
            console.log(prodArray);


            this.produits = prodArray.filter(function (element) {
               // console.log(element);
                return element !== undefined;
            });
            //console.log(this.produits);


            this.loadingArray.produit = false;
        });

        /* this.loadingArray.produit = true;
        this.produitService.getGroupProduits().subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;

                this.loadingArray.produit = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        ); */


        this.typeClientService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.typeclients = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }


    virementValide() {
        if (
            this.operationCaisse.comptecarmescaisseenvoi
            && this.operationCaisse.montant && this.operationCaisse.comptecarmescaisserecu
            && this.operationCaisse.produitId && this.operationCaisse.email
            && this.operationCaisse.telephone && this.operationCaisse.sexe
            && this.operationCaisse.typeClientId && this.operationCaisse.agenceReference
            && this.operationCaisse.professionId && this.operationCaisse.birthDate
            && this.operationCaisse.nomClient && this.operationCaisse.nationalityId) {
            return true;
        } else {
            return false;
        }
    }

    compteEpagneValid() {
        if (this.operationCaisse.montant && this.operationCaisse.comptecarmesclient
            && this.operationCaisse.produitId && this.operationCaisse.email
            && this.operationCaisse.telephone && this.operationCaisse.sexe
            && this.operationCaisse.typeClientId && this.operationCaisse.agenceReference
            && this.operationCaisse.professionId && this.operationCaisse.birthDate
            && this.operationCaisse.nomClient && this.operationCaisse.nationalityId) {
            return true;
        } else {
            return false;
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
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
        } else if (this.type.code == 'COMPTEDAT') {
            this.subscribeToSaveResponse(
                this.operationCaisseService.ouvertureCompteDat(this.operationCaisse),
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
            let msg: string;
            switch (error.resultat) {
                case 'COMPTE_CAISSE_ERRONEE':
                    msg = "Le compte caisse fourni est erroné";
                    break;
                case 'COMPTE_CAISSE_ENVOI_ERRONEE':
                    msg = "Le compte caisse d'envoi fourni est erroné";
                    break;
                case 'COMPTE_CAISSE_RECU_ERRONEE':
                    msg = "Le compte caisse de réception fourni est erroné";
                    break;
                case 'SOLDE_CAISSE_INSUFFISANT':
                    msg = "Le solde de la caisse est inférieur au montant du retrait";
                    break;
                case 'SOLDE_CAISSE_ENVOI_INSUFFISANT':
                    msg = "Le solde de la caisse d'envoi est inférieur au montant de l'envoi.";
                    break;
                case 'SOLDE_CLIENT_INSUFFISANT':
                    msg = "Le solde du client est inférieur au montant du retrait";
                    break;
                case 'MONTANT_INSUFFISANT':
                    msg = "Le montant fourni est inférieur au montant minimum requis.";
                    break;

            }
            error.message = msg || "Une erreur s'est produite";//error.text();
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
