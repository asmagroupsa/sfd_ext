import { FirstConnectionService, InsertionParam } from './first-connection.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ResponseWrapper, UserData, UserService, Principal } from '..';
import { ActivatedRoute, Router } from '@angular/router';
import { FirstConnectionModalService } from './modal-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SFDService } from '../../entities/s-fd';
import { Observable } from 'rxjs/Observable';
import { JhiAlertService } from 'ng-jhipster';
declare let select_init: any;

@Component({
    selector: 'jhi-first-connection',
    templateUrl: './first-connection.component.html',
    styleUrls: ['./first-connection.css']
})
export class FisrtConnectionComponent {
    public orders: Array<string> = ['Ordre SFD', 'Ordre Agence', 'Ordre Compteur', 'Ordre type de client'];
    params: InsertionParam = {
        ordre_typeclient: '',
        ordre_compteur: '',
        ordre_agence: '',
        position_compteur: '',
        initial_sfd: '',
        separateur: '/',
        sfd_id: '',
        type_compteur: '',
        ordre_sfd: ''
    };
    pass: string = '';
    confirm_pass: string = '';
    modifyPass: boolean = false;
    isSaving: boolean = false;
    constructor(private route: ActivatedRoute, private alertService: JhiAlertService, private userService: UserService, private principal: Principal, public activeModal: NgbActiveModal, private firstConnectionService: FirstConnectionService, private sfdService: SFDService) {
        let params = this.route.snapshot.queryParams;
        if (params.step == 1) {
            this.modifyPass = true;
        }
    }
    ngAfterViewInit() {
        select_init();
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }
    changePassword() {
        if (this.confirm_pass != this.pass) {
            this.alertService.warning("Le mot de passe doit être conforme à la confirmation")
            return;
        }
        if (this.confirm_pass.length < 6 || this.pass.length < 6) {
            this.alertService.warning("Entrez au minimum six (06) caractères")
            return;
        }
        if (!this.pass || !this.principal.userIdentity) return;
        this.isSaving = true;
        this.userService.changePassword(this.principal.userIdentity.login, this.pass).subscribe((resp) => {
            this.firstConnectionService.firstConnectionUpdate().subscribe((res: ResponseWrapper) => {
                if(this.principal.userIdentity){
                this.principal.userIdentity.firstConnection = false;
                this.principal.setUserIdentity(this.principal.userIdentity);
            }
                this.alertService.success("Mot de passe changé");
                this.isSaving = true;
                this.activeModal.dismiss();
            },(err)=>{
                this.isSaving = false;
                this.alertService.error("Une erreur s'est produite lors du changement du mot de passe");
            });
        }, (err) => {
            this.alertService.error("Une erreur s'est produite lors du changement du mot de passe");
            this.isSaving = false;
        });
    }
    insertion() {
        this.isSaving = true;
        this.firstConnectionService.insertionParametres(this.params).subscribe((response) => {
            if (response.json.resultat == 'OK') {
                this.modifyPass = true;
                this.alertService.success("Mise à jour des paramètres SFD effectuée");
            } else if (response.json.resultat == 'SFD_EXISTE_DEJA') {
                this.alertService.warning("Les paramètres du SFD sont déjà configurés");
                this.modifyPass = true;
            } else if (response.json.resultat == 'MAUVAIS_ORDRE') {
                this.save();
                return;
            }
            this.isSaving = false;

        }, (err) => {
            console.log(err);
            this.alertService.error("Une erreur s'est produite lors de la mise à jour des paramètres");
            this.isSaving = false;
        });
    }
    save() {
        if (this.modifyPass) {
            this.changePassword();
            return;
        }
        if (!this.params.type_compteur || !this.params.position_compteur)
            return;
        this.isSaving = true;
        this.orders.forEach((order: string, index: number) => {
            if (order == 'Ordre SFD') {
                this.params.ordre_sfd = index;
            } else if (order == 'Ordre Agence') {
                this.params.ordre_agence = index;
            } else if (order == 'Ordre Compteur') {
                this.params.ordre_compteur = index;
            } else if (order == 'Ordre type de client') {
                this.params.ordre_typeclient = index;
            }
        });
        this.params.initial_sfd = this.params.initial_sfd.toUpperCase();
        this.params.sfd_id = UserData.getInstance().sfdId;
        if (!this.params.sfd_id) {
            this.getSfd().subscribe((sfd) => {
                if (sfd) {
                    this.params.sfd_id = UserData.getInstance().sfdId;
                    this.insertion();
                }
            });
            return;
        }
        this.insertion();
    }
    getSfd(): Observable<any> {
        return this.sfdService
            .query({
                NO_QUERY: true,
                'code.equals': UserData.getInstance().currentSfdReference,
                'size': 1
            })
            .map(sfd => {
                sfd = sfd.json;
                if (sfd && sfd[0]) {
                    UserData.getInstance().currentSfdReference = sfd[0].code;
                    UserData.getInstance().sfdId = sfd[0].id;
                    UserData.getInstance().sfd_ = sfd[0];
                }
                return sfd;
            });
    }
}
@Component({
    selector: 'jhi-first-connection-popup',
    template: ''
})
export class FisrtConnectionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private principal: Principal,
        private router: Router,
        private firstPopupService: FirstConnectionModalService
    ) { }

    ngOnInit() {
        if (this.principal.userIdentity && this.principal.userIdentity.firstConnection !== false) {
            this.routeSub = this.route.params.subscribe((params) => {
                this.firstPopupService
                    .open();
            });
        } else {
            this.router.navigate(['/']);
        }
    }

    ngOnDestroy() {
        if (this.routeSub)
            this.routeSub.unsubscribe();
    }
}