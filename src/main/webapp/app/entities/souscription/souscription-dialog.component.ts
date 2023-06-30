import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Souscription } from './souscription.model';
import { SouscriptionPopupService } from './souscription-popup.service';
import { SouscriptionService } from './souscription.service';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { UserService } from '../../shared/user/user.service';
import {AddSouscriptionSfdDialogComponent} from './add-souscription-sfd-dialog.component';
import { AddSouscriptionBailleurDialogComponent } from './add-souscription-bailleur-dialog.component';
declare let select_init: any;
@Component({
    selector: 'jhi-souscription-dialog',
    templateUrl: './souscription-dialog.component.html'
})
export class SouscriptionDialogComponent implements OnInit {
    isListe = false;
    params: { [key: string]: any; };
    profil: string;
    profiles: string[];
    souscriptions: any[] = [];
    receivingSouscriptions: boolean = false;
    model: any = {
        profile: '',
        souscriptions: ''
    };
    souscription: Souscription;
    authorities: any[];
    isSaving: boolean;
    checkedSouscriptions: any[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private souscriptionService: SouscriptionService,
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
        if (checked) this.checkedSouscriptions.push(value);
        else this.checkedSouscriptions.splice(this.checkedSouscriptions.indexOf(value), 1);
    }

    checkedAll(checked: boolean) {
        this.checkedSouscriptions = [];
        const is = document.querySelectorAll('#rTableTbody input[type=checkbox]');
        const isLength = is.length;

        for (let i = 0; i < isLength; i++) {
            (is[i] as HTMLInputElement).checked = checked;
        }

        if (checked) {
            for (let r of this.souscriptions) {
                this.checkedSouscriptions.push(r.id);
            }
        }
    }

    onProfileChange() {
        if (!this.model.profile || this.receivingSouscriptions) return;
        this.receivingSouscriptions = true;
        this.souscriptionService.queryAuthorities(this.model.profile, this.isListe).subscribe(
            (res: ResponseWrapper) => {
                this.souscriptions = res.json;
            },
            (res: ResponseWrapper) => {
                this.receivingSouscriptions = false;
                this.onError(res.json);
            });
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.souscription.id !== undefined) {
            /* this.subscribeToSaveResponse(
                this.souscriptionService.update(this.souscription), false); */
        } else {
            if (this.isListe) {
                this.model.souscriptions = this.checkedSouscriptions;
                this.subscribeToSaveResponse(this.souscriptionService.removeAuthoritySouscriptions(this.model), false);
            }
            else this.subscribeToSaveResponse(this.souscriptionService.addAuthoritySouscriptions(this.model), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Souscription>, isCreated: boolean) {
        result.subscribe((res: Souscription) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Souscription, isCreated: boolean) {
        this.alertService.success('sfdApp.souscription.created');

        this.eventManager.broadcast({ name: 'souscriptionListModification', content: 'OK' });
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
    selector: 'jhi-souscription-popup',
    template: ''
})
export class SouscriptionPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private souscriptionPopupService: SouscriptionPopupService
    ) { }

    ngOnInit() {

        if (this.route.snapshot.routeConfig.path === 'sfd') {
            this.modalRef = this.souscriptionPopupService.open(AddSouscriptionSfdDialogComponent as Component);
        }
        if (this.route.snapshot.routeConfig.path === 'bailleur') {
            this.modalRef = this.souscriptionPopupService.open(AddSouscriptionBailleurDialogComponent as Component);
        }
        else if (this.route.snapshot.queryParams['profile']) {
            this.routeSub = this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.modalRef = this.souscriptionPopupService
                        .open(SouscriptionDialogComponent as Component, params['id']);
                } else {
                    this.modalRef = this.souscriptionPopupService
                        .open(SouscriptionDialogComponent as Component);
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
