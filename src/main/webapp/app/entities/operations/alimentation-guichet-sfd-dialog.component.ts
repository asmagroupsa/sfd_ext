import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService} from 'ng-jhipster';
import {OperationService} from '.';
import { UserData, UserService} from '../../shared';
import { CompteService } from '../compte';


declare const select_init: any;

@Component({
    selector: 'jhi-alimentation-guichet-sfd-dialog',
    templateUrl: './alimentation-guichet-sfd-dialog.component.html'
})
export class AlimentationGuichetSFDDialogComponent implements OnInit, AfterViewInit {
    gichetiers = [];
    authorities: any[];
    model: any = {};
    loading = {guichetier: false};
    modelMontant: string;
    isSaving = false;
    queryParams: Params;

    constructor(
        public activeModal: NgbActiveModal,
        private _alertService: JhiAlertService,
        private _compteService: CompteService,
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _operationService: OperationService
    ) {}

    ngOnInit() {
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        
        this.loading.guichetier = true;
        this._activatedRoute.queryParams.subscribe((params) => {
            this.queryParams = params;

            this._userService.listeUtilisateursProfil(this.queryParams.type == 'ambulant' ? 'GUICHETIER_SFD_AMBULANT': 'GUICHETIER_SFD')
            .subscribe(
                (r) => {
                    this.loading.guichetier = false;
                    this.gichetiers = this.gichetiers.concat(r);
                },
                () => {
                    this.loading.guichetier = false;
                }
            );
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this._operationService.alimentationGuichetSFD(this.model)
        .subscribe(
            (r) => {
                this.isSaving = false;
                switch (r) {
                    case 'NON':
                        this._alertService.error("Une erreur s'est produite!!! Veuillez réessayer!");
                        break;
                    case 'COMPTE_AGENT_ERRONEE':
                        this._alertService.error('GUICHETIER INEXISTANT');
                        break;
                    default:
                        this._alertService.success('Compte guicher alimenter avec succès');
                        this.activeModal.dismiss();
                        break;
                }
            },
            () => {
                this.isSaving = false;
                this._alertService.error("Une erreur s'est produite!!! Veuillez réessayer!");
            }
        );
    }

    ngAfterViewInit() {
        select_init();
    }
}
