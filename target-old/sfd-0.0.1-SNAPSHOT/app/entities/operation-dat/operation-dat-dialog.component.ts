import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OperationDat } from './operation-dat.model';
import { OperationDatPopupService } from './operation-dat-popup.service';
import { OperationDatService } from './operation-dat.service';
import { ResponseWrapper, UserData, getNewItems } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Profession, ProfessionService } from '../profession';
import { Nationality, NationalityService } from '../nationality';
import { ProduitService } from '../produit';
import { TypeClient, TypeClientService } from '../type-client';
import { CaisseNouvelleService } from '../caisse-nouvelle';
declare let select_init: any;
@Component({
    selector: 'jhi-operation-dat-dialog',
    templateUrl: './operation-dat-dialog.component.html'
})
export class OperationDatDialogComponent implements OnInit {
    operationDat: OperationDat = new OperationDat();
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
    compteDat:string;
    client:string;


    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private operationDatService: OperationDatService,
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
            this.operationDat.agenceReference = this.params.agence;
            this.caisseName = this.params.caisseName;
            this.operationDat.id = this.params.id;
            this.compteDat = this.params.compte;
            this.client = this.params.client;
            this.operationDat.comptecarmescaisseenvoi = this.params.caisse;
            this.operationDat.comptecarmescaisse = this.params.caisse;
            
            
            if (params['type'] == 'DEPOT') {
                this.titre = "Opération d'Ajout DAT";
                this.isDepot = true;
                this.type = { id: 2, code: 'DEPOT', name: 'Dépôts' };
            } else if (params['type'] == 'RUPTURE') {
                this.titre = "Opération de rupture DAT";
                this.isRetrait = true;
                this.type = { id: 3, code: 'RUPTURE', name: 'Rupture DAT' }
            }else if (params['type'] == 'COMPTEDAT') {
                this.titre = "Ouverture de compte DAT";
                this.isDat = true;
                this.type = { id: 44, code: 'COMPTEDAT', name: 'Ouverture compte DAT' };
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
            this.operationDat.agenceReference = this.agences[0].codeAgence;
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
                let type = element.type || element.typeProduit;
                if(this.isEpargne){
                    if(type){
                        if(type != 'DAV') return ;
                    }else if( !(/Epargne/i.test(element.libelle))){
                    return ;
                    }
                } else if(this.isDat){
                    if(type){
                        if(type != 'DAT') return ;
                    }else if(!(/Dat/i.test(element.libelle))){
                    return ;
                    }
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
            this.operationDat.comptecarmescaisseenvoi
            && this.operationDat.montant && this.operationDat.comptecarmescaisserecu
            && this.operationDat.produitId && this.operationDat.email
            && this.operationDat.telephone && this.operationDat.sexe
            && this.operationDat.typeClientId && this.operationDat.agenceReference
            && this.operationDat.professionId && this.operationDat.birthDate
            && this.operationDat.nomClient && this.operationDat.nationalityId) {
            return true;
        } else {
            return false;
        }
    }

    compteEpagneValid() {
        if (this.operationDat.montant && this.operationDat.comptecarmesclient
            && this.operationDat.produitId && this.operationDat.email
            && this.operationDat.telephone && this.operationDat.sexe
            && this.operationDat.typeClientId && this.operationDat.agenceReference
            && this.operationDat.professionId && this.operationDat.birthDate
            && this.operationDat.nomClient && this.operationDat.nationalityId) {
            return true;
        } else {
            return false;
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (this.type.code == 'DEPOT') {
            // this.operationDat.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationDatService.depotCaisse(this.operationDat),
                true
            );
        } else if (this.type.code == 'RUPTURE') {
            // this.operationDat.agenceReference = 'xxx';
            this.subscribeToSaveResponse(
                this.operationDatService.ruptureCaisse(this.operationDat),
                true
            );
        }else if (this.type.code == 'COMPTEDAT') {
            this.subscribeToSaveResponse(
                this.operationDatService.ouvertureCompteDat(this.operationDat),
                true
            );
        }
    }

    private subscribeToSaveResponse(
        result: Observable<OperationDat>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: OperationDat) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: OperationDat, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.operationDat.created' : 'carmesfnmserviceApp.operationDat.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'operationDatListModification',
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
                    case 'DATE_NON_ECHU':
                        msg = "La date d'écheance n'est pas encore à terme";
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
    selector: 'jhi-operation-dat-popup',
    template: ''
})
export class OperationDatPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private operationDatPopupService: OperationDatPopupService
    ) { }
    
    ngOnInit() {
        let type: any = this.route.snapshot.queryParams['type'];
        if (!type || ['DEPOT', 'RUPTURE','COMPTEDAT'].indexOf(type) == -1) {
            window.history.back();
        } else {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.operationDatPopupService.open(
                        OperationDatDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.operationDatPopupService.open(
                        OperationDatDialogComponent as Component
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
