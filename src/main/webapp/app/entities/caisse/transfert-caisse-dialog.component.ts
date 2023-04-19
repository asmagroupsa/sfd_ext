import {Component, OnInit, AfterViewInit} from '@angular/core';
import {SPStdAloneService, TransfertCaisseParams} from '../../shared/sp-stdalone.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService} from 'ng-jhipster';
import {CaisseService} from './caisse.service';

declare let select_init: any;

@Component({
    selector: 'jhi-transfert-caisse-dialog',
    templateUrl: './transfert-caisse-dialog.component.html'
})
export class TransfertCaisseDialogComponent implements OnInit, AfterViewInit {
    model: TransfertCaisseParams = {};
    isSaving = false;
    caisses = [];
    montant: string;
    caisseFrom = '';

    constructor(
        private _spStdAloneService: SPStdAloneService,
        public ngbActiveModal: NgbActiveModal,
        private _alertService: JhiAlertService,
        private _caisseService: CaisseService,
    ) {}

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this._caisseService.query({NO_QUERY: true}).toPromise()
        .then((r) => {
            this.caisses = r.json.filter((c: any) => c.id !== this.model.caisse_from_id);
        })
        .catch(() => {
            this.isSaving = false;
            this._alertService.error('Erreur');
        });
    }

    save() {
        this.isSaving = true;

        this._spStdAloneService.transfertCaisse(this.model)
        .then(() => {
            this.isSaving = false;
            this.ngbActiveModal.dismiss();
        })
        .catch(() => {
            this.isSaving = false;
            this._alertService.error('Erreur');
        });
    }
}
