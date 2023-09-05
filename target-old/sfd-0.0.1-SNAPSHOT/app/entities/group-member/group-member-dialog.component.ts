import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { GroupMember } from './group-member.model';
import { GroupMemberPopupService } from './group-member-popup.service';
import { GroupMemberService } from './group-member.service';
import { Client, ClientService } from '../client';
import { ResponseWrapper, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare var select_init: any;

@Component({
    selector: 'jhi-group-member-dialog',
    templateUrl: './group-member-dialog.component.html'
})
export class GroupMemberDialogComponent implements OnInit {
    isEditing: boolean;
    message: string;
    produitId: number;
    hasGroup: boolean;
    grpeId: number;
    groupMember: GroupMember;
    authorities: any[];
    isSaving: boolean;

    clients: Client[] = [];
    createdDateDp: any;
    lastModifiedDateDp: any;

    public roles: string[];
    public members: any[] = [];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private groupMemberService: GroupMemberService,
        private clientService: ClientService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.grpeId = +params['groupe'] || 0;
            this.hasGroup = this.grpeId ? true : false;
        });
    }
    ngAfterViewInit() {
        if (this.groupMember.id) this.isEditing = true;
        select_init();
    }
    ngOnInit() {
        this.roles = ['MEMBRE', 'PRESIDENT', 'SECRETAIRE'];
        this.clientService
            .find(this.grpeId)
            .toPromise()
            .then((data: Client) => {
                this.members = data.groups;
                this.produitId = data.produitId;
                if (!this.produitId) return;
                this.clientService
                    .clientIndividuDisponible(this.produitId)
                    .subscribe(
                        (res: ResponseWrapper) => {
                            this.clients = res.json;
                        },
                        // (res: ResponseWrapper) => this.onError(res.json)
                    );
            })
            .catch(() => {
                alert("Le groupe n'existe pas");
                this.activeModal.dismiss({});
            });
        // });

        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }
    onIndividuChange() {
        if (this.isEditing) return;
        this.message = '';
        if (this.groupMember.id) return;
        let individu = this.clients.find(client => {
            return client.id == this.groupMember.clientId;
        });
        if (individu) {
            this.message =
                'Le client est déjà dans le groupe,en sauvegardant il sera activé';
            this.members.forEach(member => {
                this.groupMember.id = undefined;
                if (member.id == this.groupMember.clientId) {
                    this.groupMember.id = this.grpeId;
                    return;
                }
            });
        }
    }
    save() {
        if (!this.grpeId && !this.groupMember.cltId) {
            alert('Veuillez renseigner le client groupe');
            return;
        }
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                this.groupMember.status = true;
                if (!this.groupMember.cltId)
                    this.groupMember.cltId = this.grpeId;

                this.groupMember.agenceReference = this.members[0].agenceReference;
                // this.groupMember.agenceReference = UserData.getInstance().currentAgence.codeAgence;
                if (this.groupMember.id !== undefined) {
                    setLastModifyBy(this.groupMember, identity);
                    this.subscribeToSaveResponse(
                        this.groupMemberService.update(this.groupMember),
                        false
                    );
                } else {
                    setCreateBy(this.groupMember, identity);
                    this.subscribeToSaveResponse(
                        this.groupMemberService.create(this.groupMember),
                        true
                    );
                }
            },
            () => { }
        );
    }

    private subscribeToSaveResponse(
        result: Observable<any>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean = false) {
        this.isSaving = false;
        if (result == 'NON') {
            this.alertService.error("Une erreur s'est produite lors de l'ajout du membre");
            return;
        }
        if (result == 'MEMBRE_EXISTANT') {
            this.alertService.warning("Le membre que vous voulez ajouter existe déjà dans un groupe");
            return;
        }
        if (result == 'DEMANDE_EN_COURS') {
            this.alertService.warning("Le groupe a déjà une demande en cours, vous ne pouvez plus ajouter un membre");
            return;
        }
        if (result == 'CREDIT_EN_COURS') {
            this.alertService.warning("Le groupe a déjà un crédit en cours, vous ne pouvez plus ajouter un membre");
            return;
        }
        if (result == 'OK') {
            this.alertService.success(
                isCreated
                    ? 'carmesfnmserviceApp.groupMember.created'
                    : 'carmesfnmserviceApp.groupMember.updated',
                { param: result.id },
                null
            );
            this.eventManager.broadcast({
                name: 'groupMemberListModification',
                content: 'OK'
            });
            this.isSaving = false;
            this.activeModal.dismiss(result);
        }
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
        this.alertService.error("Erreur, Le membre n'est pas ajouté au groupe,veuillez réessayer", null, null);
        //this.activeModal.dismiss({});
    }

    trackClientById(index: number, item: Client) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-group-member-popup',
    template: ''
})
export class GroupMemberPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private groupMemberPopupService: GroupMemberPopupService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['groupe']) {
                this.routeSub = this.route.params.subscribe(params => {
                    if (params['id']) {
                        this.modalRef = this.groupMemberPopupService.open(
                            GroupMemberDialogComponent as Component,
                            params['id']
                        );
                    } else {
                        this.modalRef = this.groupMemberPopupService.open(
                            GroupMemberDialogComponent as Component
                        );
                    }
                });
            } else {
                window.history.back();
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
