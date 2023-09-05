import { Pipe, PipeTransform } from '@angular/core';
import { UserData } from '../../shared';

@Pipe({
    name: 'createdBy'
})
export class CreatedByPipe implements PipeTransform {
    transform(users: any[]): any[] {
        return users.filter(user => {
            return user.createdBy === UserData.getInstance().userReference;
        });
    }
}
@Pipe({
    name: 'createdDate'
})
export class CreatedDatePipe implements PipeTransform {
    transform(users: any[]): any[] {
        return users.sort((a, b) => {
            let dateA = new Date(a.createdDate);
            let dateB = new Date(b.createdDate);
            return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
        });
    }
}
@Pipe({
    name: 'authoritypipe'
})
export class AuthorityPipe implements PipeTransform {
    transform(authorities: any[], isSuperAdmin: boolean): any[] {
        return authorities.filter(authority => {
            if (/AGENT/i.test(authority)) return false;
            return isSuperAdmin ? /ADMIN|USER/i.test(authority) : true;
        });
    }
}
