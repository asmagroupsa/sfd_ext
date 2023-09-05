import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Client } from './client.model';
import { ClientService } from './client.service';
import { CivilityService } from '../civility/civility.service';
import {
    ResponseWrapper,
    READFILEURL,
    createRequestOption,
    UserData,
    READBITFILEURL
} from '../../shared';
import { Civility } from '../civility/civility.model';
import { Poste } from '../poste/poste.model';
import { PosteService } from '../poste/poste.service';
import { SituationMatService } from '../situation-mat/situation-mat.service';
import { IdCardTypeService } from '../id-card-type/id-card-type.service';
import { ProfessionService } from '../profession/profession.service';
import { NationalityService } from '../nationality/nationality.service';
import { LiteracyService } from '../literacy/literacy.service';
import { SchoolLevelService } from '../school-level/school-level.service';
import { LeaderService } from '../leader/leader.service';
import { SituationMat } from '../situation-mat/situation-mat.model';
import { IdCardType } from '../id-card-type/id-card-type.model';
import { Profession } from '../profession/profession.model';
import { Nationality } from '../nationality/nationality.model';
import { Literacy } from '../literacy/literacy.model';
import { SchoolLevel } from '../school-level/school-level.model';
import { Leader } from '../leader/leader.model';
import { StateService } from '../../shared/state/statistiques';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { getImgSrc, EventBus } from '../../shared/model/functions';
declare let select_init: any;
@Component({
    selector: 'jhi-client-detail',
    templateUrl: './client-detail.component.html',
    styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit, OnDestroy {
    sfdName: string;
    agentEnrole: any = {};
    picture: any = '';
    leader: Leader;
    schoollevel: string = '';
    literacy: string = '';
    nationality: string = '';
    profession: string = '';
    idcardtype: string = '';
    situationmat: string = '';
    poste: string = '';
    civility: string = '';
    client: Client;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    createBy: any = {};

    constructor(
        private eventManager: JhiEventManager,
        private clientService: ClientService,
        private civilityService: CivilityService,
        private posteService: PosteService,
        private situationMatService: SituationMatService,
        private idCardTypeService: IdCardTypeService,
        private professionService: ProfessionService,
        private nationalityService: NationalityService,
        private literacyService: LiteracyService,
        private schoolLevelService: SchoolLevelService,
        private leaderService: LeaderService,
        private route: ActivatedRoute,
        private statistique: StateService,
        public domSanitizer: DomSanitizer,
        private http: Http
    ) {
        this.sfdName = UserData.getInstance().sfdName || '';
    }

    ngAfterViewInit() {
        select_init();
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangeInClients();
        this._loadInfoMarchand();
    }

    onLoadedAgent(url: string) {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
        .get(`${READBITFILEURL}${url}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
        .map((response: any) => {
            return 'data:image/png;base64,' + response._body;
        })
        .subscribe(url => {
            this.agentEnrole.photo = this.domSanitizer.bypassSecurityTrustUrl(url);
        });
    }
    onLoaded(client: Client) {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        this.http
        .get(`${READBITFILEURL}${client.pictureUrl}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
        .map((response: any) => {
            return 'data:image/png;base64,' + response._body;
        })
        .subscribe(url => {
            this.picture = this.domSanitizer.bypassSecurityTrustUrl(url);
        });
    }
    load(id) {
        this.clientService.find(id).subscribe(client => {
            this.client = client;
            /* this.clientService.getAgentAyantEnrole(this.client.id).subscribe(resp => {
                if (resp && resp.json) {
                    this.agentEnrole.cpteCarmes = resp.json['compte_carmes'];
                    this.agentEnrole.phone = resp.json['phone'];
                    this.agentEnrole.name = resp.json['name'];
                    this.agentEnrole.photo = resp.json['photo'];
                    if (this.agentEnrole.photo) {
                        this.onLoadedAgent(this.agentEnrole.photo);
                    }
                }
            }); */
            this.onLoaded(this.client);
            if (this.client.civilityId) {
                this.civilityService
                    .find(this.client.civilityId)
                    .subscribe((res: Civility) => {
                        this.civility = res.name;
                    });
            }
            if (this.client.posteId) {
                this.posteService
                    .find(this.client.posteId)
                    .subscribe((res: Poste) => {
                        this.poste = res.name;
                    });
            }
            if (this.client.situationMatId) {
                this.situationMatService
                    .find(this.client.situationMatId)
                    .subscribe((res: SituationMat) => {
                        this.situationmat = res.name;
                    });
            }
            if (this.client.idCarteTypeId) {
                this.idCardTypeService
                    .find(this.client.idCarteTypeId)
                    .subscribe((res: IdCardType) => {
                        this.idcardtype = res.name;
                    });
            }
            if (this.client.professionId) {
                this.professionService
                    .find(this.client.professionId)
                    .subscribe((res: Profession) => {
                        this.profession = res.name;
                    });
            }
            if (this.client.nationalityId) {
                this.nationalityService
                    .find(this.client.nationalityId)
                    .subscribe((res: Nationality) => {
                        this.nationality = res.name;
                    });
            }
            if (this.client.literacyId) {
                this.literacyService
                    .find(this.client.literacyId)
                    .subscribe((res: Literacy) => {
                        this.literacy = res.niveau;
                    });
            }
            if (this.client.schoolLevelId) {
                this.schoolLevelService
                    .find(this.client.schoolLevelId)
                    .subscribe((res: SchoolLevel) => {
                        this.schoollevel = res.niveau;
                    });
            }
            if (this.client.leaderId) {
                this.leaderService
                    .find(this.client.leaderId)
                    .subscribe((res: Leader) => {
                        this.leader = res;
                    });
            }
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInClients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'clientListModification',
            response => this.load(this.client.id)
        );
    }

    print() {
        this.statistique.save('.movie-card', 'fiche-detaille');
    }

    private _loadInfoMarchand() {
        this.clientService.infoMarchand(this.route.snapshot.params.id)
        .subscribe((m) => {
            this.createBy = m[0];
        });
    }

    getImgSrc(url: string): string {
        return getImgSrc(url);
    }
}
