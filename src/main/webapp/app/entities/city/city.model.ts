import { Departement } from '../departement/departement.model';
export class City {
    constructor(
        public id?: number,
        public name?: string,
        public townShipsId?: number,
        public departementId?: number,
        public departement?: Departement,
    ) {
    }
}
