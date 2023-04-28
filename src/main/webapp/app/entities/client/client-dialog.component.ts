import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { element } from 'protractor';
import { Observable } from 'rxjs';

import {
    createRequestOption,
    LOCAL_FLAG,
    NUMERIC_FLAG,
    ResponseWrapper,
    sendFileToServer,
    UserData,
    READFILEURL,
    READBITFILEURL,
} from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { EventBus, getNewItems, setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Agence, AgenceService } from '../agence';
import { Civility, CivilityService } from '../civility';
import { Country, CountryService } from '../country';
import { groupMember, typeClient } from '../entity.module';
import { GroupMember } from '../group-member/group-member.model';
import { GroupMemberService } from '../group-member/group-member.service';
import { IdCardType, IdCardTypeService } from '../id-card-type';
import { LeaderService } from '../leader';
import { Leader } from '../leader/leader.model';
import { Literacy, LiteracyService } from '../literacy';
import { Nationality, NationalityService } from '../nationality';
import { Poste } from '../poste/poste.model';
import { PosteService } from '../poste/poste.service';
import { ProduitService } from '../produit/produit.service';
import { Profession, ProfessionService } from '../profession';
import { SchoolLevel, SchoolLevelService } from '../school-level';
import { ServiceUser, ServiceUserService } from '../service-user';
import { SituationMat, SituationMatService } from '../situation-mat';
import { TypeClient, TypeClientService } from '../type-client';
import { MembreUniquePipe } from './client-pipe';
import { ClientPopupService } from './client-popup.service';
import { Client } from './client.model';
import { ClientService } from './client.service';
import {SPUtilService} from "../../shared/sp-util.service";

declare let select_init: any;

@Component({
    selector: 'jhi-client-dialog',
    templateUrl: './client-dialog.component.html',
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

.camera {
  background: darkcyan;
}

.close:not(.modal-header.close)  {
  position: absolute;
  top: 0;
  right: 15px;
  z-index: 1000;
}

.camera video,
.camera canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.or {
  height: 150px;
  font-style: italic;
  text-align: center;
  padding-top: 50px;
}

  `
    ]
})
export class ClientDialogComponent implements OnInit {
    @ViewChild('labelPhoto') labelPhoto: ElementRef;
    photoEdit = '';
    infoClientValid = false;
    picture: boolean;
    taken: boolean;
    label: string = 'Selectionnez une photo';
    @ViewChild('video') video: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('file') file: ElementRef;
    crop: string = '';
    postes: Poste[];
    params: any;
    isIndividual: boolean;
    isLead: boolean = false;
    isValide: boolean = false;
    client: Client;
    authorities: any[];
    isSaving: boolean;
    isSavingPicture: boolean = false;
    agences: Agence[];
    localFlag: boolean;
    numericFlag: boolean;
    proprietaire: string[] = []; // proprietaire du compte carmes verifié
    civilities: Civility[];
identificationComplete = null;
    situationmats: SituationMat[];

    idcardtypes: IdCardType[];

    professions: Profession[];

    nationalities: Nationality[];

    countries: Country[];

    literacies: Literacy[];

    schoollevels: SchoolLevel[];

    typeclients: TypeClient[];

    leaders: Leader[];
    birthDateDp: any;
    createdDateDp: any;
    lastModifiedDateDp: any;
    leaderField: string = '';
    individus: Client[] = [];
    selectedIndividus: string[] = [];
    selectedMembers = [];
    selectedRoles: any[] = [];
    nbreOfMembres = [1, 2, 3, 4, 5];
    roles: string[] = ['MEMBRE', 'MEMBRE', 'PRESIDENT', 'SECRETAIRE', 'TRESORIER'];
    membersTab = [];
    membersSelectedTab = [];
    type: any;
    @ViewChild('valide') valide: ElementRef;
    @ViewChild('parente') parente: ElementRef;
    compteCarmesIsValid = true;
    produits: any[] = [];
    clientPhotoHasBeenSend: boolean = false;
    photoType = '';
    pinCARMES: number;
    loadingArray = {
        profession: false,
        idCardType: false,
        nationality: false,
        country: false,
        produit: false,
        leader: false,
        carmes: false,
        poste: false,
        recepisse: false,
    };
    maxDate = { year: new Date().getFullYear() - 18, month: 12, day: 31 };
    minDate = { year: this.maxDate.year - 82, month: 1, day: 1 };
    mModel: any = {};
    validRecepisse = true;

    constructor(
        public groupMemberService: GroupMemberService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private clientService: ClientService,
        private agenceService: AgenceService,
        private civilityService: CivilityService,
        private situationMatService: SituationMatService,
        private idCardTypeService: IdCardTypeService,
        private professionService: ProfessionService,
        private nationalityService: NationalityService,
        private countryService: CountryService,
        private literacyService: LiteracyService,
        private schoolLevelService: SchoolLevelService,
        private typeClientService: TypeClientService,
        private serviceUserService: ServiceUserService,
        private posteService: PosteService,
        private leaderService: LeaderService,
        private eventManager: JhiEventManager,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        public langue: LanguesService,
        private _membreUniquePipe: MembreUniquePipe,
        private produitService: ProduitService,
        public domSanitizer: DomSanitizer,
        private http: Http,
        private _spUtilService: SPUtilService,
    ) {
        this.localFlag = LOCAL_FLAG;
        this.numericFlag = NUMERIC_FLAG;
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
            if (params['type'] == 'INDIVIDU') {
                this.photoType = " de l' individu";
                this.type = { name: 'INDIVIDU', id: '7', code: 'INDIVIDU' };
            } else if (params['type'] == 'MUTUEL') {
                this.photoType = ' du groupe';
                this.type = { name: 'GROUPE', id: '6', code: 'MUTUEL' };
            } else if (params['type'] == 'ENTREPRISE') {
                this.photoType = " de l' entreprise";
                this.type = { name: 'ENTREPRISE', id: '8', code: 'ENTREPRISE' };
            }
        });
    }

    ngAfterViewInit() {
        select_init((query, id) => {
            if (id === 'produit_id') {
                // this.produitService.query({
                //     NO_QUERY: false,
                //     'libelle.contains': query,
                //     'typeProduit.in': 'CREDIT,LIGNE_PRODUIT',
                //     'sfdReference.equals': 'FNM',
                //     'sfdReference.specified': 'false',
                //     'condition': 'OR',
                // }).subscribe(
                //     (res: ResponseWrapper) => {
                //         this.produits = this.produits.concat(getNewItems(this.produits, res.json));
                //         this.loadingArray.produit = false;
                //     },
                //     (res: ResponseWrapper) => { }
                // );
            } else if (id === 'field_poste') {
                this.posteService.query({ NO_QUERY: false, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.postes = this.postes.concat(getNewItems(this.postes, res.json));
                        this.loadingArray.poste = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_leader') {
                this.leaderService.query({ NO_QUERY: false, 'name.contains': query, 'condition': 'OR', 'firstName.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.leaders = this.leaders.concat(getNewItems(this.leaders, res.json));
                        this.loadingArray.leader = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_profession') {
                this.professionService.query({ NO_QUERY: false, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.professions = this.professions.concat(getNewItems(this.professions, res.json));
                        this.loadingArray.profession = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_nationality') {
                this.nationalityService.query({ NO_QUERY: false, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.nationalities = this.nationalities.concat(getNewItems(this.nationalities, res.json));
                        this.loadingArray.nationality = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            } else if (id === 'field_country') {
                this.countryService.query({ NO_QUERY: false, 'name.contains': query }).subscribe(
                    (res: ResponseWrapper) => {
                        this.countries = this.countries.concat(getNewItems(this.countries, res.json));
                        this.loadingArray.country = false;
                    },
                    (res: ResponseWrapper) => { }
                );
            }
        });
        this._showClientPhotoOnEdit();
    }

    onChange() {
        this.type = this.typeclients.find(typeClient => {
            return this.client.typeClientId == typeClient.id;
        });
        this.isLead = this.type.code == 'ENTREPRISE' ? true : false;
        this.isIndividual = this.type.code == 'INDIVIDU' ? true : false;
        if (this.isIndividual && this.client.employee) this.isValide = true;
        setTimeout(() => {
            select_init();
        }, 1000);
    }
    onProduitChange() {
        this.clientService
            // .query({'typeClient.equals': 7}).subscribe(
            .clientIndividuDisponible(this.client.produitId)
            .subscribe(
                (result: ResponseWrapper) => {
                    this.individus = result.json;
                    for (let i = 0; i < this.nbreOfMembres.length; i++) {
                        this.membersTab[i] = this.individus;
                    }
                });
    }
    onEmployee(evt, no: boolean = false) {
        if (no) this.isValide = false;
        else {
            this.isValide = true;
            select_init();
        }
    }

    _onLoaded(url: string = '1.png') {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');

        return this.http
            .get(`${READBITFILEURL}${url}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((response: any) =>
                this.domSanitizer.bypassSecurityTrustUrl(
                    'data:image/png;base64,' + response._body
                )
            );
    }

    _showClientPhotoOnEdit() {
        if (this.client.id && this.client.pictureUrl) {
            this._onLoaded(this.client.pictureUrl).subscribe(url => {
                let s = (url as any).changingThisBreaksApplicationSecurity;
                this.labelPhoto.nativeElement.style.backgroundImage = `url(${s})`;
                this.isSavingPicture = true;
                this.label = '';
            });
        }
    }

    ngOnInit() {
        this.infoClientValid = this.client.id ? true : false;
        if (!this.client.id) this.client.birthDate = this.maxDate;

        this.agences = UserData.getInstance().listeAgences;
        if (this.client.id) {
            this.clientPhotoHasBeenSend = true;
            this.infoClientValid = true;
        }
        if (this.agences.length == 1) {
            this.client.agenceReference = this.agences[0].codeAgence;
            this.client.agenceId = this.agences[0].id;
        }

        this.isSaving = false;
        if (this.client.employee) this.isValide = true;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];

        this.typeClientService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.typeclients = res.json;
                this.typeclients.forEach((typeClient: TypeClient) => {
                    if (
                        this.params['type'] &&
                        typeClient.code == this.params['type']
                    ) {
                        this.client.typeClientId = typeClient.id;
                        this.type = typeClient;
                        if (typeClient.code === 'ENTREPRISE')
                            this.isLead = true;
                        if (typeClient.code == 'INDIVIDU')
                            this.isIndividual = true;
                    }
                });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.posteService.query().subscribe(
            (res: ResponseWrapper) => {
                this.postes = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.civilityService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.civilities = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.situationMatService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.situationmats = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.idCardType = true;
        this.idCardTypeService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.idcardtypes = res.json;
                this.loadingArray.idCardType = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.profession = true;
        this.professionService.query().subscribe(
            (res: ResponseWrapper) => {
                this.professions = res.json;
                this.loadingArray.profession = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.nationality = true;
        this.nationalityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.nationalities = res.json;
                this.loadingArray.nationality = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.country = true;
        this.countryService.query().subscribe(
            (res: ResponseWrapper) => {
                this.countries = res.json;
                this.loadingArray.country = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.literacyService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.literacies = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.schoolLevelService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.schoollevels = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.leader = true;
        this.leaderService.query().subscribe(
            (res: ResponseWrapper) => {
                this.leaders = res.json;
                this.loadingArray.leader = false;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadingArray.produit = true;
        this.produitService.getGroupProduits().subscribe((produits) => {
            this.produits = produits;
            console.log(this.produits);
            this.loadingArray.produit = false;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    takePicture(ev) {
        ev.stopPropagation();
        this.taken = true;
        this.picture = false;
        this.canvas.nativeElement
            .getContext('2d')
            .drawImage(
                this.video.nativeElement,
                0,
                0,
                this.canvas.nativeElement.width,
                this.canvas.nativeElement.height
            );
        this.canvas.nativeElement.toBlob(blob => {
            blob.name = Date.now() + '.png';
            this.isSavingPicture = true;
            sendFileToServer(blob, resp => {
                if (resp !== 'NONE') {
                    this.isSavingPicture = false;
                    this.clientPhotoHasBeenSend = true;
                }
                this.client.pictureUrl = resp && resp !== 'NONE' ? resp : '';
            });
        });
    }

    showCamera() {
        if (this.picture) return;
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                this.video.nativeElement.srcObject = stream;
                this.picture = true;
                this.taken = false;
            })
            .catch(() => {
                alert("votre camera ne fonctionne pas ou veuillez l'autoriser");
            });
    }

    changeIndividu(e, index: number) {
        if (index === 3 && !this.mModel['m3'] && this.mModel['m4']) this.mModel['m4'] = null;
        if (index === 4 && !this.mModel['m4'] && this.mModel['m3']) this.mModel['m3'] = null;

        if (e) {
            let oldMember = undefined;

            if (this.selectedIndividus[index]) oldMember = this.selectedMembers[index];

            this.selectedIndividus[index] = e;

            this.selectedMembers[index] = this.individus.find(i => i.id === parseInt(e, 10));

            for (let i = 0; i < this.membersTab.length; i++) {
                if (index !== i) {
                    if (oldMember !== undefined) this.membersTab[i].push(oldMember);
                    this.membersTab[i] = this._membreUniquePipe.transform(this.membersTab[i], e);
                }
            }
        }
    }

    checkIfMemberIsRequired(index: number) {
        if ([0, 1, 2].indexOf(index) !== -1) return true;

        if (index === 3 && this.mModel['m4']) return true;
        if (index === 4 && this.mModel['m3']) return true;

        return false;
    }

    selectRole(value, index) {
        if (index === 0 && value === 'PRESIDENT') {
            this.selectedRoles[index] = value;
            return true;
        }

        if (index === 1 && value === 'SECRETAIRE') {
            this.selectedRoles[index] = value;
            return true;
        }

        if (index === 2 && value === 'TRESORIER') {
            this.selectedRoles[index] = value;
            return true;
        }

        if (index === 3 && value === 'MEMBRE') {
            this.selectedRoles[index] = value;
            return true;
        }

        if (index === 4 && value === 'MEMBRE') {
            this.selectedRoles[index] = value;
            return true;
        }

        return false;
    }

    onChangeFile(labelPhoto) {
        if (
            this.file.nativeElement.files &&
            this.file.nativeElement.files.length
        ) {
            if (
                !/\.(gif|jpg|jpeg|tiff|png)$/i.test(
                    this.file.nativeElement.files[0].name
                )
            ) {
                alert('Veuillez sélectionner une image');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (e.target && e.target.result) labelPhoto.style.backgroundImage = 'url(' + e.target.result + ')';
                this.isSavingPicture = true;
                sendFileToServer(this.file.nativeElement.files[0], resp => {
                    if (resp != 'NONE') {
                        this.client.pictureUrl = resp;
                        this.isSavingPicture = false;
                        this.clientPhotoHasBeenSend = true;
                    } else alert('le fichier a échoué. Veuillez réessayer');
                });
            };
            reader.readAsDataURL(this.file.nativeElement.files[0]);
            this.label = '';
        } else this.label = 'Selectionnez une photo';
    }
    save() {
        if(this.identificationComplete === false){
            this.alertService.warning("Aucune information complémentaire pour ce compte carmes, l’identification complète doit ếtre faite.");
            return;
        }
        if (!this.compteCarmesIsValid || (!this.infoClientValid && this.isIndividual) || !this.clientPhotoHasBeenSend) {
            this.alertService.warning("Les champs obligatoires ne sont pas renseignés");
            return;
        }
        if (!this.client.pictureUrl && this.isNotGroup()) {
            this.alertService.warning('Vous devez renseigner la photo du client');
            return;
        }
        if (this.client.phone)
            this.client.phone = this.client.phone.replace(/[- ]/g, '');
        else this.client.phone = '0000000';
        if (!this.client.agenceId && this.client.agenceReference) {
            let findAgence = this.agences.find(agence => {
                return agence.codeAgence === this.client.agenceReference;
            });
            this.client.agenceId = findAgence ? findAgence.id : 0;
        }

        /* if (this.localFlag) this.client.cpteCarmes = (new Date).getTime() + ''; */

        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.valide)
                    this.client.employee = this.valide.nativeElement.checked;
                if (this.parente)
                    this.client.apparente = this.parente.nativeElement.checked;
                this.client.sex = this.client.sex ? this.client.sex : 'Autre';
                if (this.client.id !== undefined) {
                    const leader = this.leaders.find((element: Leader) => {
                        return (
                            element.name + ' ' + element.firstName ===
                            this.leaderField
                        );
                    });
                    if (leader) this.client.leaderId = leader.id;
                    setLastModifyBy(this.client, identity);

                    if (!this.isIndividual && !this.isLead)
                        this.createClientGroup();
                    else {
                        this.subscribeToSaveResponse(
                            this.clientService.update(this.client),
                            false
                        );
                    }
                }
                else {
                    if (this.type.code == 'INDIVIDU') {
                        this.client.civilityId =
                            this.client.sex === 'M' ? 2 : 3;
                    }
                    this.client.status = true;
                    // this.client.status = !LOCAL_FLAG;
                    this.client.depart = false;
                    this.client.date_depart = null;

                    const leader = this.leaders.find((element: Leader) => {
                        return (
                            element.name + ' ' + element.firstName ===
                            this.leaderField
                        );
                    });
                    if (leader) this.client.leaderId = leader.id;
                    setCreateBy(this.client, identity);
                    this.client.code = 'xxx';
                    this.client.userReference = UserData.getInstance().userReference;
                    if (!this.isIndividual && !this.isLead) {
                        this.createClientGroup();
                    } else {
                        this.client.userInitial = this.client.createdBy;
                        this.subscribeToSaveResponse(this.clientService.create(this.client), true);
                    }
                }
            },
            () => { }
        );
    }

    private createClientGroup() {
        const params: any = {
            name: this.client.name,
            user_reference: UserData.getInstance().userReference,
            email: '',
            phone: '',
            created_by: this.client.createdBy,
            sex: 'Autre',
            picture_url: this.client.pictureUrl,
            membres: '',
            produit_id: this.client.produitId,
            client_id: this.client.id,
            status: this.client.status,
            depart: this.client.depart,
            date_depart: this.client.date_depart
        };

        // if (this.client.id != undefined) params.id = this.client.id;

        params.agence_id = this.client.agenceId;
        const president = this.individus.find(individu => {
            return individu.id === parseInt(this.selectedIndividus[0], 10);
        });
        //params.cpte_carmes = president.cpteCarmes;
        params.cpte_carmes = '' + Date.now();
        if (president) {
            params.email = president.email;
            params.phone = president.phone || president['telephone'];
        }

        const length = this.selectedIndividus.length;
        let t = [];

        for (let i = 0; i < length; i++) {
            if (this.mModel[`m${i}`])
                t.push(`${this.selectedIndividus[i]}*${this.selectedRoles[i]}*${params.created_by}`);
            else break;
        }
        params.membres = t.join('#');

        this.clientService.createClientGroup(params).subscribe(res => {
            this.isSaving = false;
            if (res == 'NON' || res == 'ERREUR') {
                this.alertService.warning("Une erreur s'est produite lors de l'ajout du groupe");
                return;
            }
            if (res == 'DEMANDE_EN_COURS') {
                this.alertService.warning("Le groupe a une demande en cours");
                return;
            }
            this.alertService.success('carmesfnmserviceApp.client.created', null);
            this.eventManager.broadcast({ name: 'clientListModification', content: 'OK' });
            this.isSaving = false;
            this.activeModal.dismiss(res);
        });
    }

    pushNbre() {
        this.nbreOfMembres.push(1);
        select_init((searchValue, element) => {
        });
    }

    get presidentChose() {
        //verifie si on est en modification

        //return this.selectedIndividus[0] === undefined ? false : true;
        return true;
    }

    getPresidentPhone() {
        this.selectedRoles.forEach((role, index) => {
            if (role === this.roles[1]) {
                const client = this.individus.find(individu => individu.id === parseInt(this.selectedIndividus[index], 10));
                this.client.phone = client ? client.phone : '';
                this.client.cpteCarmes = client ? client.cpteCarmes : '';
            }
        });
    }
    private subscribeToSaveResponse(
        result: Observable<Client>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: Client) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: Client, isCreated: boolean) {
        if (!isCreated || this.isIndividual || this.isLead) {
            this.alertService.success(
                isCreated
                    ? 'carmesfnmserviceApp.client.created'
                    : 'carmesfnmserviceApp.client.updated',
                { param: result.id },
                null
            );

            this.eventManager.broadcast({
                name: 'clientListModification',
                content: 'OK'
            });
            this.isSaving = false;
            this.activeModal.dismiss(result);
            return;
        }
        // this.addMember(result, isCreated);
    }
    addMember(result: Client, isCreated: boolean) {
        // this.selectedIndividus.forEach((individu, index) => {
        for (let index = 0; index < this.selectedIndividus.length; index++) {
            const groupMember = new GroupMember();
            // groupMember.clientId = parseInt(individu, 10);
            groupMember.clientId = parseInt(this.selectedIndividus[index], 10);
            groupMember.cltId = result.id;
            groupMember.createdBy = result.createdBy;
            groupMember.memberRole = this.selectedRoles[index];
            groupMember.status = true;
            (i => {
                this.groupMemberService.create(groupMember).subscribe(() => {
                    if (i + 1 === this.selectedIndividus.length) {
                        this.alertService.success(
                            isCreated
                                ? 'carmesfnmserviceApp.client.created'
                                : 'carmesfnmserviceApp.client.updated',
                            { param: result.id },
                            null
                        );

                        this.eventManager.broadcast({
                            name: 'clientListModification',
                            content: 'OK'
                        });
                        this.isSaving = false;
                        this.activeModal.dismiss(result);
                    }
                });
            })(index);
        }
        // });
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

    trackAgenceById(index: number, item: Agence) {
        return item.id;
    }

    trackCivilityById(index: number, item: Civility) {
        return item.id;
    }

    trackSituationMatById(index: number, item: SituationMat) {
        return item.id;
    }

    trackIdCardTypeById(index: number, item: IdCardType) {
        return item.id;
    }

    trackProfessionById(index: number, item: Profession) {
        return item.id;
    }

    trackNationalityById(index: number, item: Nationality) {
        return item.id;
    }

    trackCountryById(index: number, item: Country) {
        return item.id;
    }

    trackLiteracyById(index: number, item: Literacy) {
        return item.id;
    }

    trackSchoolLevelById(index: number, item: SchoolLevel) {
        return item.id;
    }

    trackTypeClientById(index: number, item: TypeClient) {
        return item.id;
    }

    trackServiceUserById(index: number, item: ServiceUser) {
        return item.id;
    }

    trackLeaderById(index: number, item: Leader) {
        return item.id;
    }

    /* compte carmes validation
      public cpteCarmesErrorMaxLength: boolean = false;

    public cptCarmesKeydown(): void {
      if (this.client.cpteCarmes !== undefined) {
        let cpteCarmes: string = this.client.cpteCarmes.toString();

        if (cpteCarmes.length >= 9) {
          this.client.cpteCarmes = cpteCarmes.slice(0, 9);
        }
      }
      compte carmes validation */

    public onClientLastNameInput(value: string): void {
        this.client.fatherName = `${value} `;
    }

    public isNotGroup(): boolean {
        return this.type.code !== 'MUTUEL';
    }

    cptErrorMsg: string;

    onCompteCarmesBlur() {
        if (this.client.id) {
            this.compteCarmesIsValid = true;
            return;
        }

        if (this.client.cpteCarmes/*  && this.pinCARMES */) {
            this.compteCarmesIsValid = false;
            this.loadingArray.carmes = true;
            this.identificationComplete = null;

             this.clientService
                .verifierCompteCarmes(this.client.cpteCarmes)
                .subscribe((res) => {
                    this.loadingArray.carmes = false;
                    this.compteCarmesIsValid = res.json.resultat === 'OK';

                    if (!this.compteCarmesIsValid) {
                        if (res.json.resultat === 'NON') this.alertService.error('CE COMPTE CARMES EXISTE DEJA');
                        else if (res.json.resultat === 'ERROR_CARMES_REQUEST') this.alertService.error('IMPOSSIBLE DE JOINDRE LE SERVEUR CARMES');
                        else if (res.json.resultat === 'NON_CARMES') this.alertService.error(`CE COMPTE CARMES N' EXISTE PAS`);
                    }else{
                       this.queryCarmes();
                    }
                }, () => {
                    this.loadingArray.carmes = false;
                    this.compteCarmesIsValid = false;
                    this.alertService.error(`IMPOSSIBLE DE VERIFIER LE COMPTE CARMES`);
                });
        }
    }
    queryCarmes(){
            this.clientService.queryCarmesInfos(this.client.cpteCarmes).subscribe((res:any) => {
                            res = JSON.parse(`${res}`);
                            res = res.message;
                            this.compteCarmesIsValid = false;
                            if (/^AUCUNE INFORMATION COMPLEMENTAIRE POUR CE COMPTE CARMES/i.test(res)) {
                            this.compteCarmesIsValid = true;
                            this.identificationComplete = false;
                            this.alertService.warning("Aucune information complémentaire pour ce compte carmes, l’identification complète doit ếtre faite.",null,null);
                            }else if (res === 'NON') {
                                this.alertService.error('CE COMPTE CARMES EXISTE DEJA');
                        }else if (res === 'ERROR_CARMES_REQUEST'){ this.alertService.error('IMPOSSIBLE DE JOINDRE LE SERVEUR CARMES');
                        }else if (res === 'Compte CARMES incorrect') {
                            this.alertService.error(`Le compte CARMES est incorrect`);

                            }else if (res === 'NON_CARMES') {
                            this.alertService.error(`CE COMPTE CARMES N' EXISTE PAS`);

                            }else if(/^[0-9]+\* ?/.test(res)){
                                this.identificationComplete = true;
                         this.loadingArray.carmes = false;
                         this.compteCarmesIsValid = true;
                                let infosCarmes = res.split('*');
                                this.proprietaire = infosCarmes;
                                this.client.name = infosCarmes[1];
                                this.client.firstName = infosCarmes[2];
                                if(infosCarmes[3].indexOf('/') != -1){
                                    let date = infosCarmes[3].split('/');
                                this.client.birthDate = { year: +date[2], month: +date[1], day: +date[0] };
                                }
                                this.client.birthPlace = infosCarmes[4];
                                this.client.identityCard = infosCarmes[7];
                                this.client.contactPersonName = infosCarmes[8];
                                this.client.contactPersonPhone = infosCarmes[9];
                                this.client.email = infosCarmes[11];
                                this.client.ifus = infosCarmes[13];
                        }
                        }, (err) => {
                            this.loadingArray.carmes = false;
                    this.compteCarmesIsValid = false;
                    this.alertService.error(`IMPOSSIBLE DE VERIFIER LE COMPTE CARMES`);
            });
    }
    verifierInfoClient(e) {
        if (this.client.id && !e) {
            this.infoClientValid = true;
            return;
        }
        if (e) {
            if (this.minDate.year <= this.client.birthDate.year && this.maxDate.year >= this.client.birthDate.year) {
                if (this.minDate.month <= this.client.birthDate.month && this.maxDate.month >= this.client.birthDate.month) {
                    if (this.minDate.day <= this.client.birthDate.day && this.maxDate.day >= this.client.birthDate.day) {
                        this.client.birthDate = e;
                    }
                    else {
                        this.client.birthDate = this.maxDate;
                    }
                } else {
                    this.client.birthDate = this.maxDate;
                }
            } else {
                this.client.birthDate = this.maxDate;
            }
        }

        this.infoClientValid = true;

        if (this.client.name && this.client.firstName && this.client.phone && this.client.birthDate) {
            this.clientService
                .verifierInfoClient({
                    nom: this.client.name,
                    prenom: this.client.firstName,
                    dateNaiss: this.client.birthDate,
                    phone: this.client.phone
                })
                .subscribe(res => {
                    this.infoClientValid = res.json.resultat === 'OK';
                });
        }
    }

    onRecepisseBlur() {
        if (!this.client.recepisse) {
            return;
        }

        if (this.client.recepisse.trim().length === 0) {
            return;
        }

        this.loadingArray.recepisse = true;
        this.validRecepisse = false;

        this._spUtilService.verifierRavip(null, this.client.recepisse)
        .then(() => {
            this.loadingArray.recepisse = false;
            this.validRecepisse = true;
        })
        .catch((e) => {
            console.error(e);
            this.loadingArray.recepisse = false;
            this.alertService.error('Erreur de verification du récépicé');
        });
    }
}

@Component({
    selector: 'jhi-client-popup',
    template: ''
})
export class ClientPopupComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private clientPopupService: ClientPopupService
    ) { }

    ngOnInit() {
        let type: any = this.route.snapshot.queryParams['type'];
        if (!type || ['INDIVIDU', 'MUTUEL', 'ENTREPRISE'].indexOf(type) == -1) {
            window.history.back();
        } else {
            this.routeSub = this.route.params.subscribe(params => {
                if (params['id']) {
                    this.modalRef = this.clientPopupService.open(
                        ClientDialogComponent as Component,
                        params['id']
                    );
                } else {
                    this.modalRef = this.clientPopupService.open(
                        ClientDialogComponent as Component
                    );
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.routeSub) this.routeSub.unsubscribe();
    }
}
