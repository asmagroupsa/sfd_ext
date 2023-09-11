
import { NUMERIC_FLAG, LOCAL_FLAG, sendFileToServer } from '../../shared/model/request-util';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { UserModalService } from './user-modal.service';
import {
    JhiLanguageHelper,
    User,
    UserService,
    ResponseWrapper
} from '../../shared';
import { SFDService } from '../../entities/s-fd';
import { UserData } from '../../shared/model/singleton';
import { AgenceService } from '../../entities/agence/agence.service';
import { ZoneAgenceService } from '../../entities/zone-agence/zone-agence.service';
import { LanguesService } from '../../shared/myTranslation/langues';
declare let select_init: any;
declare let jQuery: any;

@Component({
    selector: 'jhi-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html',
    styles: [
        `
        .label,
.camera {
  display: block;
  border: 1px solid lightblue;
  height: 150px;
  text-align: center;
  padding-top: 50px;
  cursor: pointer;
  position: relative;
}

.label {
  background: lightseagreen;
      background-size: cover;
    background-repeat: no-repeat;
}
        `
    ]
})
export class UserMgmtDialogComponent implements OnInit {

    @ViewChild('file') file: ElementRef;
    label: string = 'Sélectionnez la signature du DG';
    @ViewChild('labelPhoto') labelPhoto: any;
     @ViewChild('file2') file2: ElementRef;
    label2: string = 'Sélectionnez la carte du DG';
    @ViewChild('labelPhoto2') labelPhoto2: any;
    error: string = ''; 
    sfds: any;
    isSuperAdmin: boolean = false;
    isAgent: boolean = false;
    level: boolean = false;
    agences: any[] = [];
    zones: any[] = [];
    model: any = {
        login: '',
        password_hash: '',
        first_name: '',
        last_name: '',
        email: '',
        cpteCarmes: '',
        phone: '',
        image_url: '../../../content/coreUi/assets/img/avatars/6.jpg',
        activated: true,
        created_by: '',
        chaine_authorities: [],
        sfd_reference: '',
        zone_reference: '',
        agence_reference: '',
        profil_user: 'GUICHETIER_SFD',
        zone_sfd_ref: '',
        signature_url: '',
        carte_url: '',
        date_function: '',
        date_end_function: ''
    };
    confirmation: string = '';
    user: any;
    languages: any[];
    authorities: any[];
    isSaving: Boolean;
    guichetier = false;
    localFlag: boolean;
    numericFlag: boolean;
    minDate = { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() };
    isPhotoSaving: string = '';
    country:any; 

    constructor(
        public activeModal: NgbActiveModal,
        private languageHelper: JhiLanguageHelper,
        private userService: UserService,
        private sfdService: SFDService,
        private zoneService: ZoneAgenceService,
        private agenceService: AgenceService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public langue: LanguesService
    ) {
       
        this.localFlag = LOCAL_FLAG;
        this.numericFlag = NUMERIC_FLAG;
        this.zones = UserData.getInstance().listeZones;
    }
    ngAfterViewInit() {
        this._slectInit();
    }
    hasDG(): boolean {
        this.model.chaine_authorities = this.model.chaine_authorities || [];
        return this.model.chaine_authorities.indexOf("DG") != -1 || this.model.chaine_authorities.indexOf('DIRECTEUR_EXECUTIF') != -1;
    }
    onChangeFile(label:string) {
      let file:any,labelPhoto:any;
      if(label === 'signature'){
file = this.file;
labelPhoto = this.labelPhoto.nativeElement;
      }else if(label === 'carte'){
file = this.file2;
labelPhoto = this.labelPhoto2.nativeElement;
      }else{
        return ;
      }
        if (
            file.nativeElement.files &&
            file.nativeElement.files.length
        ) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result)
                    labelPhoto.style.backgroundImage =
                        'url(' + e.target.result + ')';
                if(label === 'signature')
                        this.isPhotoSaving = "La signature du DG est en cours d'envoi";
                        else if(label === 'carte')
                this.isPhotoSaving = "La carte du DG est en cours d'envoi";
                sendFileToServer(file.nativeElement.files[0], resp => {
                    if (resp !== 'NONE'){
                      if(label === 'signature')
                        this.model.signature_url = resp;
                        else if(label === 'carte')
                        this.model.carte_url = resp;
                    }
                    this.isPhotoSaving = '';
                });
            };
            reader.readAsDataURL(file.nativeElement.files[0]);
            if(label === 'signature')
                        this.label = '';
                        else if(label === 'carte')
            this.label2 = '';
        } else{
          if(label === 'signature')
                        this.label = 'Sélectionnez la signature du DG';
                        else if(label === 'carte')
this.label2 = 'Sélectionnez la carte du DG';
        } 
    }

    onLevelChange() {
        this.model.zone_reference = '';
        this.model.agence_reference = '';
        jQuery('.zone_reference .ui.dropdown div.text').html('');
        jQuery('.agence_reference .ui.dropdown div.text').html('');
    }

    fillModel() {
        if (!this.user.id) return;
        this.level = this.user.sfd_reference ? true : false;

        this.model = {
            id: this.user.id,
            login: this.user.login,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email,
            phone: this.user.phone,
            sfd_reference: this.user.sfd_reference,
            zone_reference: this.user.zone_reference,
            agence_reference: this.user.agence_reference,
            activated: this.user.activated,
            created_by: this.user.created_by,
            image_url:
                this.user.image_url ||
                '../../../content/coreUi/assets/img/avatars/6.jpg'
        };
        let profiles = this.user.authority.split('*');
        this.model.chaine_authorities = [];
        profiles.forEach(element => {
            if (this.model.chaine_authorities.indexOf(element) == -1) {
                this.model.chaine_authorities.push(element);
            }
        });
    }
    verifierDate(ev,field){
        if(true == true){
           this.model[field] = ev;
           return ;
        }
        if(ev){
            if(field === 'date_function'){
              if((this.minDate.year <= ev.year && this.minDate.month <= ev.month && this.minDate.day <= ev.day)){
this.model.date_function = ev;
              }else{
               this.model.date_function = '';   
              }
            } else if(field === 'date_end_function'){
                if(!this.model.date_function){
this.model.date_end_function = ev;
return ;
                }
if(this.model.date_function.year <= ev.year && this.model.date_function.month <= ev.month && this.model.date_function.day <= ev.day){
    this.model.date_end_function = ev;
}else{
    this.model.date_end_function = '';   
}
            }
        }
    }
    ngOnInit() {
        this.isSaving = false;
        this.fillModel();
        this.activatedRoute.queryParams.subscribe((params) => {
            this.guichetier = params.guichetier == 'true' ? true : false;
            this.country = params.country;
        });

        if (
            !UserData.getInstance().currentSfdReference &&
            !UserData.getInstance().sfd
        ) {
            this.isSuperAdmin = true;
            this.sfdService.query({
                'country_id':this.country,
                size: 1000 }).subscribe(
                (res: ResponseWrapper) => {
                    this.sfds = res.json;
                },
                (res: ResponseWrapper) => { }
            );
        }
        this.authorities = [];
        /* this.agences = UserData.getInstance().listeAgences;
        if (!this.agences || !this.agences.length) { */
        this.agenceService.query({ 'country_id':this.country,size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.agences = res.json;
            },
            (res: ResponseWrapper) => { }
        );
        // }
        //if (!this.zones || !this.zones.length) {
        this.zoneService.query({ 'country_id':this.country, size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.zones = res.json;
            },
            (res: ResponseWrapper) => { }
        );
        //}
        this.userService.authoritys({ 'country_id':this.country,size: 1000 }).subscribe(authorities => {
            this.authorities = authorities.map((auth)=>{
                return auth.name;
            });
        });
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.error = '';
        let statement =
            (!this.isSuperAdmin &&
                !this.level &&
                (!this.model.zone_reference && !this.model.agence_reference)) ||
            this.emailIsInvalid() ||
            (!this.user.id && this.confirmation != this.model.password_hash);
            console.log(statement);
            if (statement) {
                console.log(statement);
            alert("Le formulaire n'est pas valide");
            return;
        }
        this.isSaving = true;
        this.model.created_by = UserData.getInstance().userReference;
        if (Array.isArray(this.model.chaine_authorities)) {
            this.model.chaine_authorities = this.model.chaine_authorities.join('*');
        }
        if (!this.model.chaine_authorities) {
            this.model.chaine_authorities = this.user.authority;
        }
        if (this.isSuperAdmin && !this.isAgent) {
            this.model.chaine_authorities = 'ROLE_ADMIN*ROLE_USER';
        }
        if (this.isAgent) {
            this.model.chaine_authorities = 'AGENT';
        }

        if (this.level) {
            this.model.sfd_reference = this.model.sfd_reference || UserData.getInstance().currentSfdReference || UserData.getInstance().sfd;
            this.model.zone_reference = '';
            this.model.agence_reference = '';
        }
        if (this.isAgent) {
            this.model.sfd_reference = '';
            this.model.zone_reference = '';
            this.model.agence_reference = '';
        }
        if (this.user.id) {
            let authorities = [];
            jQuery('.droits .ui.fluid.search.dropdown .ui.label').each(
                function () {
                    authorities.push(jQuery(this).text());
                }
            );
            this.model.chaine_authorities = authorities.join('*') || this.model.chaine_authorities;
        }
        if (this.model.chaine_authorities) {
            if (this.model.chaine_authorities.indexOf('ROLE_USER') == -1) {
                this.model.chaine_authorities += '*ROLE_USER';
            }
        }
        if (!this.hasDG()) {
            this.model.signature_url = '';
            this.model.date_function = '';
            this.model.date_end_function = '';
        }
        if (this.guichetier) {
            this.userService.addGuichetierSFD(this.model)
            .subscribe(
                (response) => this.onSaveSuccess(response, this.user.id ? false : true),
                () => this.onSaveError()
            );
        }
        else {
            this.userService.create(this.model)
            .subscribe(
                (response) => {
                    this.onSaveSuccess(response, this.user.id ? false : true);
                },
                () => this.onSaveError()
            );
        }
    }

    onchange() {
        this._slectInit();
    }

    private _slectInit() {
        select_init((query, id) => {

        });
    }

    emailIsInvalid(): boolean {
        return !/^(([^<>()\[\]\\.,;:\s@" ]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            this.model.email
        );
    }
    private onSaveSuccess(result, isCreated: boolean) {
        this.isSaving = false;
        if (result.json.resultat == 'loginexists') {
            this.error = "Le nom d'utilisateur existe déjà utilisé";
            this.alertService.error("Le nom d'utilisateur existe déjà utilisé");
            return;
        }
        else if (result.json.resultat == 'dgexists') {
            this.error = "Un utilisateur DG existe déjà et est activé";
            this.alertService.error(this.error);
            return;
        }
        else if (result.json.resultat == 'DE') {
            this.error = "Un directeur executif existe déja";
            this.alertService.error(this.error);
            return;
        }else if(['DAF','dafexists'].indexOf(result.json.resultat) != -1){
             this.error = "Un utilisateur DAF existe déjà et est activé";
            this.alertService.error(this.error);
            return;
        }else if(result.json.resultat.toLowerCase() == 'existant'){
            let prof = 'Un utilisateur de ce profil';
            if(this.hasDG()) prof =  'Un directeur executif';
            else if(this.model.chaine_authorities.indexOf('DAF') != -1)
            prof =  'Un utilisateur DAF ';
             this.error = `${prof} existe déjà et est activé`;
            this.alertService.error(this.error);
            return;
        }
        else if (result.json.resultat == 'emailexists') {
            this.error = "L'email saisi existe déjà";
            this.alertService.error("L'email saisi existe déjà");
            return;
        }
        else if (result.json.resultat == 'NON') {
            this.error =
                "Une erreur s'est produite lors de la création de l'utilisateur! Veuillez réessayer";
            this.alertService.error(
                "Une erreur s'est produite lors de la création de l'utilisateur! Veuillez réessayer"
            );
            return;
        }
        this.error = '';
        this.alertService.success(
            isCreated ? 'userManagement.created' : 'userManagement.updated',
            { param: result.json.login },
            null
        );
        this.eventManager.broadcast({
            name: 'userListModification',
            content: 'OK'
        });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.error =
            "Une erreur s'est produite lors de l création de l'utilisateur! Veuillez réessayer";
        this.alertService.error(
            "Une erreur s'est produite lors de l création de l'utilisateur! Veuillez réessayer"
        );
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-user-dialog',
    template: ''
})
export class UserDialogComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private userModalService: UserModalService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['login']) {
                this.modalRef = this.userModalService.open(
                    UserMgmtDialogComponent as Component,
                    params['login']
                );
            } else {
                this.modalRef = this.userModalService.open(
                    UserMgmtDialogComponent as Component
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
