import {
    Component,
    OnInit
} from '@angular/core';

import {TypeClientService} from '../type-client';
import {CountryService} from '../country';
import {NationalityService} from '../nationality';
import {SituationMatService} from '../situation-mat';
import {ResponseWrapper} from '../../shared';
import {AgenceService} from '../agence';

@Component({
    selector: 'jhi-clientpp',
    templateUrl: 'clientpp.component.html'
})
export class ClientPPComponent implements OnInit {
    private _clients: any[];
    private _typesClient: any[];
    private _countries: any[];
    private _nationalities: any[];
    private _situationMatrimoniales: any[];
    private _agences: any[];
    private _groupCriteria: any[];

    public criteria: any;

    constructor(
        private _typeClientService: TypeClientService,
        private _countryService: CountryService,
        private _nationalityService: NationalityService,
        private _situationMatrimonialeService: SituationMatService,
        private _agenceService: AgenceService,
    ) {// agence, profession, pays, typeclient, nationalite, annee, age, situation_mat
        this._initArrayProperties();
        this._groupCriteria = [
            {libelle: 'Aucun', value: ''},
            {libelle: 'Agence', value: 'agence'},
            {libelle: 'Profession', value: 'profession'},
            {libelle: 'Pays', value: 'pays'},
            {libelle: 'Type client', value: 'typeclient'},
            {libelle: 'Nationalite', value: 'nationalite'},
            {libelle: 'Annee', value: 'annee'},
            {libelle: 'Age', value: 'age'},
            {libelle: 'Situation matrimoniale', value: 'situation_mat'}
        ];
        this.criteria = {
            groupBy: '',
            cmpt_carmes: '',
        };
    }

    get clients(): any[] {
        return this._clients;
    }

    get typesClient(): any[] {
        return this._typesClient;
    }

    get countries(): any[] {
        return this._countries;
    }

    get nationalities(): any[] {
        return this._nationalities;
    }

    get situationMatrimoniales(): any[] {
        return this._situationMatrimoniales;
    }

    get groupCriteria(): any[] {
        return this._groupCriteria;
    }

    get agences(): any[] {
        return this._agences;
    }

    private _initArrayProperties(): void {
        const properties: string[] = [
            '_countries',
            '_typesClient',
            '_nationalities',
            '_clients',
            '_situationMatrimoniales',
            '_agences',
        ];

        for (const property of properties) {
            this[property] = [];
        }
    }

    private _loadInitialData(): void {
        const dataServices: any[] = [
            {service: '_countryService', property: '_countries'},
            {service: '_typeClientService', property: '_typesClient'},
            {service: '_nationalityService', property: '_nationalities'},
            {service: '_situationMatrimonialeService', property: '_situationMatrimoniales'},
            {service: '_agenceService', property: '_agences'},
        ];

        for (const item of dataServices) {
            this[item.service].query().subscribe(
                ((res: ResponseWrapper) => {
                    this[item.property] = res.json;
                })
            );
        }
    }

    public ngOnInit(): void {
        this._loadInitialData();
    }
}
