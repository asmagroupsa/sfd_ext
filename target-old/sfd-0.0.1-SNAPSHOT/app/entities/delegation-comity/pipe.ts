import { PipeTransform, Pipe } from "@angular/core";
import { DelegatedMember } from "../delegated-member/delegated-member.model";


@Pipe({ name: "delegation" })
export class DelegationPipe implements PipeTransform {
    transform(delegateds: DelegatedMember[], id: any) {
        return delegateds.filter((delegated: DelegatedMember) => delegated.delegationComityId == id);
    }
}
