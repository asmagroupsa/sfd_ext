import { JhiProfileService } from './profile.service';
import { Component, OnInit } from '@angular/core';
import { RessourceService } from '../../entities/ressource';
declare let modal: any;
declare let modalHide: any;
@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.html'
})
export class JhiProfileComponent implements OnInit {
  currentProfil: any;
  isDeleting: boolean = false;
  isAdding: boolean = false;
  isModifying: boolean = false;
  profiles: any[];
  model: any = {
    name: '',
    typeUser: 'SFD'
  };
  isSaving: boolean = false;
  constructor(
    private profileService: JhiProfileService,
    private ressourceService: RessourceService
  ) {
    this.currentProfil = {
      name: null,
      ressources: []
    };
  }

  ngOnInit() {
    this.getAllProfiles();
  }
  getAllProfiles() {
    this.profileService.getProfiles().subscribe(profiles => {
      this.profiles = profiles;
    });
  }
  createProfile() {
    this.isDeleting = false;
    this.isAdding = true;
    this.isModifying = false;
    this.isSaving = false;
    this.model = { name: '' };
    modal('#profile-modal');
  }
  deleteProfile(profile: any) {
    this.isDeleting = true;
    this.isAdding = false;
    this.isModifying = false;
    this.model = profile;
    this.isSaving = false;
    modal('#profile-modal');
  }
  updateProfile(profile: any) {
    this.isDeleting = false;
    this.isAdding = false;
    this.isModifying = true;
    this.isSaving = false;
    this.model = profile;
    modal('#profile-modal');
  }
  clear() {
    this.isDeleting = false;
    this.isAdding = false;
    this.isSaving = false;
    this.isModifying = false;
    modalHide('#profile-modal');
    this.model = { name: '' };
  }
  save() {
    if (!this.model.name) return;
    this.isSaving = true;
    if (this.isDeleting) {
      this.profileService.deleteProfile(this.model.name).subscribe(() => {
        this.getAllProfiles();
        this.clear();
        this.isSaving = false;
        this.isDeleting = false;
        this.isAdding = false;
        this.isModifying = false;
      });
    } else {
      if (this.isModifying) {
        this.profileService.updateProfile(this.model).subscribe(() => {
          this.getAllProfiles();
          this.clear();
          this.isSaving = false;
          this.isDeleting = false;
          this.isAdding = false;
          this.isModifying = false;
        });
      } else if (this.isAdding) {
        this.profileService.createProfile(this.model).subscribe(() => {
          this.getAllProfiles();
          this.clear();
          this.isSaving = false;
          this.isDeleting = false;
          this.isAdding = false;
          this.isModifying = false;
        });
      }
    }
  }

  openProfilRessourcesModal(profil: any) {

    this.ressourceService.queryAuthorities(profil.name, false)
      .subscribe((res) => {
        this.currentProfil.name = profil.name;
        this.currentProfil.ressources = res.json;

        modal('#profil-ressources-modal');
      });
  }

  closeModal(selector: string) {
    modalHide(selector);
  }
}
