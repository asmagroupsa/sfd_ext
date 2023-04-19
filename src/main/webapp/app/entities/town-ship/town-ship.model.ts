import { City } from '../city/city.model';
export class TownShip {
    constructor(
        public id?: number,
        public name?: string,
        public districtsId?: number,
        public cityId?: number,
        public city?: City,
    ) {
    }
}
