import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Ressource } from './ressource.model';
import { RessourcePopupService } from './ressource-popup.service';
import { RessourceService } from './ressource.service';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { UserService } from '../../shared/user/user.service';
import {AddAuthorityDialogComponent} from './add-authority-dialog.component';
declare let select_init: any;
@Component({
    selector: 'jhi-ressource-dialog',
    templateUrl: './ressource-dialog.component.html'
})
export class RessourceDialogComponent implements OnInit {
    isListe = false;
    params: { [key: string]: any; };
    profil: string;
    profiles: string[];
    ressources: any[] = [];
    receivingRessources: boolean = false;
    model: any = {
        profile: '',
        ressources: ''
    };
    ressource: Ressource;
    authorities: any[];
    isSaving: boolean;
    checkedRessources: any[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private ressourceService: RessourceService,
        private eventManager: JhiEventManager,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.params = params;
            this.model.profile = this.params['profile'];
            this.isListe = this.params['liste'] != undefined;
            this.onProfileChange();
        });
    }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        /*  this.userService
             .authorities()
             .subscribe(
             (res: string[]) => {
                 this.profiles = res;
             },
             (res: ResponseWrapper) => this.onError(res.json)
             ); */
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    ch(checked: boolean, value: string) {
        if (checked) this.checkedRessources.push(value);
        else this.checkedRessources.splice(this.checkedRessources.indexOf(value), 1);
    }

    checkedAll(checked: boolean) {
        this.checkedRessources = [];
        const is = document.querySelectorAll('#rTableTbody input[type=checkbox]');
        const isLength = is.length;

        for (let i = 0; i < isLength; i++) {
            (is[i] as HTMLInputElement).checked = checked;
        }

        if (checked) {
            for (let r of this.ressources) {
                this.checkedRessources.push(r.id);
            }
        }
    }

    onProfileChange() {
        if (!this.model.profile || this.receivingRessources) return;
        this.receivingRessources = true;
        this.ressourceService.queryAuthorities(this.model.profile, this.isListe).subscribe(
            (res: ResponseWrapper) => {
                this.ressources = res.json;
            },
            (res: ResponseWrapper) => {
                this.receivingRessources = false;
                this.onError(res.json);
            });
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.ressource.id !== undefined) {
            /* this.subscribeToSaveResponse(
                this.ressourceService.update(this.ressource), false); */
        } else {
            if (this.isListe) {
                this.model.ressources = this.checkedRessources;
                this.subscribeToSaveResponse(this.ressourceService.removeAuthorityRessources(this.model), false);
            }
            else this.subscribeToSaveResponse(this.ressourceService.addAuthorityRessources(this.model), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Ressource>, isCreated: boolean) {
        result.subscribe((res: Ressource) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Ressource, isCreated: boolean) {
        this.alertService.success('sfdApp.ressource.created');

        this.eventManager.broadcast({ name: 'ressourceListModification', content: 'OK' });
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
        this.alertService.error('Erreur');
    }
}

@Component({
    selector: 'jhi-ressource-popup',
    template: ''
})
export class RessourcePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private ressourcePopupService: RessourcePopupService
    ) { }

    ngOnInit() {
        
        if (this.route.snapshot.routeConfig.path === 'authority-new') {
            this.modalRef = this.ressourcePopupService.open(AddAuthorityDialogComponent as Component);
        }
        else if (this.route.snapshot.queryParams['profile']) {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.modalRef = this.ressourcePopupService
                        .open(RessourceDialogComponent as Component, params['id']);
                } else {
                    this.modalRef = this.ressourcePopupService
                        .open(RessourceDialogComponent as Component);
                }
            });
        }
        else {
            window.history.back();
        }
    }

    ngOnDestroy() {
        if (this.routeSub)
            this.routeSub.unsubscribe();
    }
}
