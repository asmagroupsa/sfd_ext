import { JhiDeconnexionService } from './deconnexion.service';
import { Component, OnInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';
@Component({
    selector: 'jhi-deconnexion',
    templateUrl: './deconnexion.html'
})
export class JhiDeconnexionComponent implements OnInit {
    deconnectedUsers: any[] = [];
    constructor(
        private deconnexionService: JhiDeconnexionService,
        private alertService: JhiAlertService
    ) {}

    ngOnInit() {
        this.deconnexionService.getConnectedUsers().subscribe(res => {
            //this.deconnectedUsers = res;
        });
    }
    deconnectUser(id) {
        this.deconnexionService.deconnectUser(id).subscribe(res => {
            if (res.resultat == 'OK') {
                this.alertService.success(
                    "L'utilisateur est bien déconnecté",
                    null,
                    null
                );
            } else {
                this.alertService.error(
                    "Impossible de deconnecter l'utilisateur",
                    null,
                    null
                );
            }
        });
    }
}
