import { Departement } from '../departement/departement.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Address } from './address.model';
import { AddressPopupService } from './address-popup.service';
import { AddressService } from './address.service';
import { District, DistrictService } from '../district';
import { Client, ClientService } from '../client';
import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { DepartementService } from '../departement/departement.service';
import { CityService } from '../city/city.service';
import { TownShipService } from '../town-ship/town-ship.service';
import { City } from '../city/city.model';
import { TownShip } from '../town-ship/town-ship.model';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { HomeService } from '../../shared/mesServices/home-service';
declare let select_init: any;

@Component({
    selector: 'jhi-address-dialog',
    templateUrl: './address-dialog.component.html',
    styles: [
        `
  #myAddressLabel span{
    font-size:19px !important;
  }
  `
    ]
})
export class AddressDialogComponent implements OnInit {
    checkPosition: boolean;
    params: { [key: string]: any };
    address: Address;
    authorities: any[];
    isSaving: boolean;
    loading: boolean = false;
    districts: District[];
    departements: Departement[];
    communes: City[];
    arrondissements: TownShip[];
    client: Client;
    createdDateDp: any;
    lastModifiedDateDp: any;
    depId: any;
    cityId: any;
    townId: any;
    districtId: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private addressService: AddressService,
        private districtService: DistrictService,
        private departementService: DepartementService,
        private cityService: CityService,
        private townShipService: TownShipService,
        private clientService: ClientService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private homeService: HomeService
    ) { }
    ngAfterViewInit() {
        select_init();
    }
    userPosition(reload: boolean = false) {
        if (reload && !navigator.onLine) {
            alert("Vous n'avez pas la connexion internet pour charger la géolocalisation");
            return;
        }
        this.homeService.getLocation().then((data) => {
            data = data || {};
            this.address.geoLat = data.lat;
            this.address.geoLong = data.lon;
            this.checkPosition = true;
        });
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.userPosition();
        this.departementService.query().subscribe(
            (res: ResponseWrapper) => {
                this.departements = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        /* this.cityService.query({ size: 100 }).subscribe(
            (res: ResponseWrapper) => {
                this.communes = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.townShipService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.arrondissements = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.districtService.query({ size: 100000000 }).subscribe(
            (res: ResponseWrapper) => {
                this.districts = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        ); */
        this.clientService.find(this.address.clientId).subscribe(
            (res: Client) => {
                this.client = res;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }


    getCityByDep(id){
        this.address.communeId = null;
        this.address.arrondissementId = null;
        this.address.districtId = null;
        this.loading = true;
        const req: any = {
            'departementId.equals': id,
            size: 300,
            NO_QUERY: true
        };
        this.cityService.query(req).subscribe(
            (res: ResponseWrapper) => {
            this.communes = res.json;
            this.loading = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    
    getTownShipByCity(id){
        this.address.arrondissementId = null;
        this.address.districtId = null;
        this.loading = true;
        const req: any = {
            'cityId.equals': id,
            size: 1000,
            NO_QUERY: true
        };
        this.townShipService.query(req).subscribe(
            (res: ResponseWrapper) => {
            this.arrondissements = res.json;
            this.loading = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    
    getDistricByTownShip(id){
        this.address.districtId = null;
        this.loading = true;
        const req: any = {
            'cityId.equals': id,
            size: 20000,
            NO_QUERY: true
        };
        this.districtService.query(req).subscribe(
            (res: ResponseWrapper) => {
                this.districts = res.json;
                this.loading = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    

    trackById(index: number, item) {
     return item.id;
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.address.id !== undefined) {
                    setLastModifyBy(this.address, identity);
                    //this.address.lastModifiedBy = identity.firstName || "";
                    //this.address.lastModifiedBy += " " + identity.lastName || "";
                    this.subscribeToSaveResponse(
                        this.addressService.update(this.address),
                        false
                    );
                } else {
                    if (this.principal.store['coords']) {
                        this.address.geoLat =
                            this.principal.store['coords'].lat || 0;
                        this.address.geoLong =
                            this.principal.store['coords'].lon || 0;
                    }
                    setCreateBy(this.address, identity);
                    //this.address.createdBy = identity.firstName || "";
                    //this.address.createdBy += " " + identity.lastName || "";
                    this.subscribeToSaveResponse(
                        this.addressService.create(this.address),
                        true
                    );
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<Address>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Address) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Address, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.address.created' : 'carmesfnmserviceApp.address.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({
            name: 'addressListModification',
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

    trackDistrictById(index: number, item: District) {
        return item.id;
    }

    trackClientById(index: number, item: Client) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-address-popup',
    template: ''
})
export class AddressPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private addressPopupService: AddressPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.modalRef = this.addressPopupService.open(
                    AddressDialogComponent as Component,
                    params['id']
                );
            } else {
                this.modalRef = this.addressPopupService.open(
                    AddressDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
