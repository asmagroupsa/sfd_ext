import { Component, Input } from '@angular/core';

@Component({
    selector: 'jhi-group-members-list-modal',
    templateUrl: 'group-members-modal.component.html'
})
export class GroupMembersListModalComponent {

    @Input()
    public group: any;

    constructor() {
        this.group = null;
    }
}
