import { Ressource } from '../ressource';
export class AuthorityResource {
    constructor(
        public id?: number,
        public authority?: string,
        public ressource?: Ressource,
    ) {
    }
}
