import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {PhasePopupService} from './sous-traitant-popup.service';
// import {PhaseService} from './phase.service';
import {ProduitService} from "../produit/produit.service";
import {numberToLocalString, sendFileToServer, UserData} from "../../shared/index";
import {CARMESService} from "../../shared/carmes.service";
import {MVNService} from "../../shared/mvn.service";
import {CityService} from "../city/city.service";
import {TownShipService} from "../town-ship/town-ship.service";
import {DistrictService} from "../district/district.service";
declare let select_init: any;

@Component({
    selector: 'jhi-sous-traitant-dialog',
    templateUrl: './sous-traitant-dialog.component.html'
})
export class SousTraitantDialogComponent implements OnInit {
    model: any = {};
    isSaving: boolean;
    password;
    @ViewChild('img') _img;
    pin;
    i;
    cities = [];
    districts = [];
    loading = {district: false};

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private _carmesService: CARMESService,
        private _mvnService: MVNService,
        private _cityService: CityService,
        private _townShipService: TownShipService,
        private _districtService: DistrictService,
    ) {}

    ngOnInit() {
        this.i = UserData.getInstance().getSFD().indicePrestataire;
        this.model.code_guichet = this.i + '-';
        this._getCities();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    async save() {
        if (UserData.getInstance().getSFD().indicePrestataire !== this.model.code_guichet.split('-')[0]) {
            this.alertService.error('Ce marchand n\' est pas un marchand de SFD');
            return;
        }

        this.isSaving = true;

       /*  try {
            await this._carmesService.checkMarchantCodeGuichetier(
                this.model.code_guichet,
                this.pin,
                this.model.comptecarmes,
            );
        }
        catch (e) {
            console.error(e);
            this.isSaving = false;
            this.alertService.error('Code guichetier incorrect');
            return;
        } */

        this._mvnService.souscriptionComplet(this.model)
        .then(() => {
            this.isSaving = false;
            this.alertService.success('Sous traitant ajouté');
            
            this.eventManager.broadcast({
                name: 'sousTraitantListModification',
                content: 'OK'
            });

            this.activeModal.dismiss();
        })
        .catch((e) => {
            this.isSaving = false;
            let msg = 'Erreur';

            if (typeof e === 'string') {
                /* if (e === 'ERROR_CARMES_REQUEST') {
                    msg = 'Erreur CAR';
                } */
                if (e === 'COMPTE INCORRECT' || e === 'COMPTE CARMES OU CODE PIN INCORRECT') {
                    msg = 'COMPTE CARMES  ou code PIN incorrect';
                }
                else if (e === 'COMPTE_CARMES_EXISTANT' || e === 'loginexists' || e === 'CETTE SOUSCRIPTION EST DEJA FAITE') {
                    msg = 'Un utilisateur avec ce compte CARMES existe déja';
                }
                else if (e === 'emailexists') {
                    msg = 'E-mail existe déja';
                }
                else if (e === 'SOLDE INSUFFISANT') {
                    msg = 'Le solde de votre compte CARMES est insuffisant pour payer les frais de souscription';
                }
            }

            this.alertService.error(msg);
        });
    }

    onPhotoChange(files) {
        if (!(files && files[0])) {
            return;
        }

        this.model.photo = undefined;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            if (e.target && e.target.result) {
                this._img.nativeElement.src = e.target.result;
            }

            this.isSaving = true;

            sendFileToServer(files[0], (resp) => {
                this.isSaving = false;
                if (resp && resp != 'NONE') {
                    this.model.photo = resp;
                }
                else {
                    this.alertService.warning("Photo non emregistrée");
                }
            });
        };
        reader.readAsDataURL(files[0]);
    }

    getInfos() {
        if (!(this.model.comptecarmes && this.model.comptecarmes.trim().length !== 0)) {
            return;
        }

        this.isSaving = true;

        this._carmesService.getCARMESUserInfos(this.model.comptecarmes).toPromise()
        .then((i) => {
            this.isSaving = false;
            this.model.name = i.lastName;
            this.model.first_name = i.firstName;
            this.model.tel = i.phoneNumber;
            this.model.email = i.email;
        })
        .catch((e) => {
            this.isSaving = false;
            console.error(e);
        });
    }

    async getDistricts(cityId) {
        if (!cityId) {
            return;
        }

        let districts = [];
        this.districts = districts;

        try {
            this.loading.district = true;
            let r = await this._townShipService.query({size: 1000000, 'cityId.equals': cityId}).toPromise();
            r = await this._districtService.query({
                size: 1000000,
                'townShipId.in': r.json.map((i) => i.id).join(','),
            }).toPromise();
            districts = r.json;
        } catch (e) {
            console.error(e);
        }

        this.loading.district = false;
        this.districts = districts;
        select_init();
    }

    private _getCities() {
        this._cityService.query({size: 1000000}).toPromise()
        .then((r) => {
            this.cities = r.json;
            select_init();
        })
        .catch((e) => {
            console.error(e);
        });
    }
}

@Component({
    selector: 'jhi-poste-popup',
    template: ''
})
export class PhasePopupComponent implements OnInit, OnDestroy {
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private postePopupService: PhasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.postePopupService.open(
                    SousTraitantDialogComponent as Component,
                    params['id']
                );
            } else {
                this.postePopupService.open(SousTraitantDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
