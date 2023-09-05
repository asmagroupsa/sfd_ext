import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService} from 'ng-jhipster';
import {ClientService} from './client.service';

@Component({
    selector: 'jhi-init-password-dialog',
    templateUrl: './init-password-dialog.component.html'
})
export class InitPasswordDialogComponent {
    isSaving = false;
    passwordBis: string;
    password: string;
    login: string;
    name: string;

    constructor(
        private _activeModal: NgbActiveModal,
        private _alertService: JhiAlertService,
        private _clientService: ClientService,
    ) {}

    cancel() {
        this._activeModal.dismiss('cancel');
    }

    save() {
        console.log(this.name, this.login);
        if (!this.formIsValid()) {
            return;
        }

        this.isSaving = true;
        this._clientService.initialiserPassword(this.login, this.password)
        .subscribe(
            () => {
                this.isSaving = false;
                this._alertService.success('Mot de passe initialisé.');
                this._activeModal.dismiss('success');
            },
            (e) => {
                this.isSaving = false;

                if (e.message) {
                    switch (e.message) {
                        case 'LOGIN_INCORRECTE':
                            this._alertService.error('LOGIN INCORRECTE');
                            break;
                        default:
                            this._alertService.error('Erreur');
                    }
                } else {
                    this._alertService.error('Erreur');
                }
            }
        );
    }

    formIsValid(): boolean {
        if (!this.password && !this.login) {
            return false;
        }

        return this.password === this.passwordBis;
    }
}
