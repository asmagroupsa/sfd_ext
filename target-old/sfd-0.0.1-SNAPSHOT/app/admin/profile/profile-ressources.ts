import {Component, OnInit} from '@angular/core';
import {RessourceService} from '../../entities/ressource';
import { ActivatedRoute } from '@angular/router';
import { JhiProfileService } from './profile.service';


@Component({
    selector: 'jhi-profile-ressources',
    templateUrl: './profile-ressources.html'
})
export class JhiProfileRessourcesComponent implements OnInit {

    profil: {name: string, ressources: any[]};

    constructor(
        private ressourceService: RessourceService,
        private activatedRoute: ActivatedRoute,
        private profileService: JhiProfileService
    ) {
        this.profil = {
            name: null,
            ressources: []
          };
    }

    ngOnInit() {
        this.profil.name = this.activatedRoute.snapshot.paramMap.get('profil');

        this.ressourceService.queryAuthorities(this.profil.name, true)
        .subscribe((res) => {
          this.profil.ressources = res.json;
        });
    }

    deleteProfileRessource(ressource) {
        this.profileService.deleteProfileRessource(ressource.id).subscribe((res) => {
            const i = this.profil.ressources.indexOf(ressource);

            this.profil.ressources.splice(i, 1);
        });
    }
}
