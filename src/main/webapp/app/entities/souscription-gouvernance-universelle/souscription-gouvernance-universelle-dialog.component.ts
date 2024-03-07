import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SouscriptionGouvernanceUniverselle } from './souscription-gouvernance-universelle.model';
import { SouscriptionGouvernanceUniversellePopupService } from './souscription-gouvernance-universelle-popup.service';
import { ResponseWrapper, setCreateBy, setLastModifyBy, Principal } from '../../shared';
import { getNewItems } from '../../shared/model/functions';
import { SouscriptionGouvernanceUniverselleService } from './souscription-gouvernance-universelle.service';
import { DatePipe } from '@angular/common';
declare let select_init: any;


@Component({
    selector: 'jhi-souscription-gouvernance-universelle-dialog',
    templateUrl: './souscription-gouvernance-universelle-dialog.component.html',
    styles: [
        `
       input {
        padding: 0px;
       }
       `
    ]
})
export class SouscriptionGouvernanceUniverselleDialogComponent implements OnInit {
    souscriptionGouvernanceUniverselle: SouscriptionGouvernanceUniverselle;
    authorities: any[];
    isSaving: boolean;
    createdDateDp: any;
    lastModifiedDateDp: any;
    products: any[] = [];
    tarifs: any[] = [];
    partners: any[] = [];
    date_debut: any
    date_fin: any

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private souscriptionGouvernanceUniverselleService: SouscriptionGouvernanceUniverselleService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private _datePipe: DatePipe

    ) { }

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this._loadProduct();
        this._loadPartner();
        this._loadTarif();
        // console.log('id -> ' + this.souscriptionGouvernanceUniverselle.id != null ? this.souscriptionGouvernanceUniverselle.id : 0);

        this.isSaving = false;
        if (this.souscriptionGouvernanceUniverselle.id) {
        }

        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];

    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this.souscriptionGouvernanceUniverselle.date_debut = this.formatDate(this.date_debut);
        this.souscriptionGouvernanceUniverselle.date_fin = this.formatDate(this.date_fin);

        console.log(this.souscriptionGouvernanceUniverselle);
        this.principal.identity().then(async (identity) => {
            //console.log(identity);
            if (this.souscriptionGouvernanceUniverselle.id !== undefined) {
                setLastModifyBy(this.souscriptionGouvernanceUniverselle, identity);
                this.subscribeToSaveResponse(this.souscriptionGouvernanceUniverselleService.update(this.souscriptionGouvernanceUniverselle), false);
            } else {
                setCreateBy(this.souscriptionGouvernanceUniverselle, identity);
                this.souscriptionGouvernanceUniverselle.createdBy = identity.id || identity.login;
                this.subscribeToSaveResponse(this.souscriptionGouvernanceUniverselleService.create(this.souscriptionGouvernanceUniverselle), true);
            }
        });
    }

    private subscribeToSaveResponse(result: Observable<SouscriptionGouvernanceUniverselle>, isCreated: boolean) {
        console.log(result);

        result.subscribe(
            (res: SouscriptionGouvernanceUniverselle) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        console.log(result);
        console.log(result.resultat);
        this.alertService.success(
            isCreated ? 'carmesfnmserviceApp.souscriptionGouvernanceUniverselle.created' : 'carmesfnmserviceApp.souscriptionGouvernanceUniverselle.updated',
            { param: result.id },
            null
        );

        this.eventManager.broadcast({ name: 'SouscriptionGouvernanceUniverselleListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    /* private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    } */

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            let msg: string;
            switch (error.resultat) {
                case 'SOUSCRIPTION_EXISTE_DEJA':
                    msg = "La souscription existe déjà";
                    break;
                case 'Non':
                    msg = "La répponse est non";
                    break;
                case 'PRODUIT_INACTIF':
                    msg = "Le produit est inactif";
                    break;
            }
            error.message = msg || "Une erreur s'est produite";
            //error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackProductById(index: number, item: any) {
        return item.id;
    }

    trackTarifById(index: number, item: any) {
        return item.id;
    }

    trackPartnerById(index: number, item: any) {
        return item.id;
    }

    private _loadProduct(req?: any) {
        this.souscriptionGouvernanceUniverselleService.queryProduct(req).subscribe(
            (res: ResponseWrapper) => {
                console.log(res);

                this.products = this.products.concat(getNewItems(this.products, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private _loadTarif(req?: any) {
        this.souscriptionGouvernanceUniverselleService.queryTarif(req).subscribe(
            (res: ResponseWrapper) => {
                console.log(res);

                this.tarifs = this.tarifs.concat(getNewItems(this.tarifs, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private _loadPartner(req?: any) {
        this.souscriptionGouvernanceUniverselleService.queryPartner(req).subscribe(
            (res: ResponseWrapper) => {
                console.log(res);

                this.partners = this.partners.concat(getNewItems(this.partners, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
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

    formatDate = (date) => {
        if (!date) return null;
        return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
    }

    formatDate2(date: any): any {
        let month: string;
        let day: string;
        date.month.toString().length == 1 ? month = '0' + date.month : date.month;
        date.day.toString().length == 1 ? day = '0' + date.day : date.day;

        let dateToString = date.year + '-' + month + '-' + day;

        return dateToString;
    }
}

@Component({
    selector: 'jhi-souscription-gouvernance-universelle-popup',
    template: ''
})
export class SouscriptionGouvernanceUniversellePopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private SouscriptionGouvernanceUniversellePopupService: SouscriptionGouvernanceUniversellePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                console.log("edition sous-bail");

                this.modalRef = this.SouscriptionGouvernanceUniversellePopupService.open(
                    SouscriptionGouvernanceUniverselleDialogComponent,
                    params['id']
                );
            } else {
                console.log("Creation sous-bail");

                setTimeout(() => {
                    this.modalRef = this.SouscriptionGouvernanceUniversellePopupService.open(SouscriptionGouvernanceUniverselleDialogComponent as Component);
                }, 0);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }


}
